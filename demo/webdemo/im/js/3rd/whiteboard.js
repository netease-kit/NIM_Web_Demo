(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.whiteboard = factory());
}(this, (function () { 'use strict';

// https://github.com/developit/mitt
// The MIT License (MIT)
// Copyright (c) 2017 Jason Miller
// Modified by ukabuer <ukabuer@live.com> at 2017.11.3

var defaultExport$2 = function defaultExport (all) {
  this.all = all || Object.create(null);
};

defaultExport$2.prototype.on = function on (type, handler) {
  (this.all[type] || (this.all[type] = [])).push(handler);
};

defaultExport$2.prototype.off = function off (type, handler) {
  if (this.all[type]) {
    this.all[type].splice(this.all[type].indexOf(handler) >>> 0, 1);
  }
};

defaultExport$2.prototype.emit = function emit (type, evt) {
  (this.all[type] || []).map(function (handler) { handler(evt); })
  ;(this.all['*'] || []).map(function (handler) { handler(type, evt); });
};

var Draw = (function (EventEmitter) {
  function Draw(container, opt) {
    if ( opt === void 0 ) opt = {};

    EventEmitter.call(this);
    if (this.displayCtx) { this.destroy(); } // 如果先前的画板没有销毁
    this.users = {};
    this.opt = opt;
    this.UID = opt.UID || 0; // 本地用户的UID
    this.shapes = []; // 所有用户绘制内容的列表
    this.visible = 0; // 可见绘制内容的个数，撤销后并没有把绘制内容从数组移除而是设置不可见
    this.currMode = null; // 当前绘图模式, 跟随绘图模式更新
    this.currModeBk = null; // 当前绘图模式备份, 用于互动者和观众互切之间的状态保持!
    this.currColor = opt.color;
    if (!container) { return; }
    if (!(container instanceof window.HTMLElement))
      { throw new Error('画板容器不是HTMLElement实例'); }
    this.setContainer(container, opt);
    console.log('opt.mode', opt.mode);
    opt.mode = opt.mode || 'free';
    this.mode(("draw:" + (opt.mode)));
  }

  if ( EventEmitter ) Draw.__proto__ = EventEmitter;
  Draw.prototype = Object.create( EventEmitter && EventEmitter.prototype );
  Draw.prototype.constructor = Draw;

  // 动态设置container
  Draw.prototype.setContainer = function setContainer (container, opt) {
    if ( opt === void 0 ) opt = {};

    // console.log('setContainer', container);
    if (!(container instanceof window.HTMLElement))
      { throw new Error('画板容器不是HTMLElement实例'); }
    this.container && this.container.remove();
    this.container = container;
    container.style.position = 'relative';
    opt.width = opt.width || container.clientWidth || 400;
    opt.height = opt.height || container.clientHeight || 400;
    this.opt = Object.assign(this.opt, opt);
    this.width = this.opt.width;
    this.height = this.opt.height;
    if (!this.canvas) {
      this.initCanvas();
    } else {
      // 直接更新canvas宽高
      this.setCanvasSize();
    }
    container.appendChild(this.displayCanvas);
    container.appendChild(this.canvas);
    this.switchEventListener(true); // 绑定事件
  };

  // 初始化canvas环境
  Draw.prototype.initCanvas = function initCanvas () {
    var displayCanvas = document.createElement('canvas');
    this.displayCtx = displayCanvas.getContext('2d');
    displayCanvas.style.position = 'relative';
    displayCanvas.style.boxSizing = 'content-box';
    displayCanvas.style.backgroundPosition = 'center';
    displayCanvas.style.backgroundRepeat = 'no-repeat';
    displayCanvas.style.backgroundSize = 'contain';
    displayCanvas.style.zIndex = this.opt.zIndex || 0;
    if (typeof this.width !== 'number') { throw new Error('画板宽度不是数字'); }
    if (typeof this.height !== 'number') { throw new Error('画板高度不是数字'); }

    this.displayCtx.lineCap = this.displayCtx.lineJoin = 'round';
    this.setCanvasSize();
    var user = this.addUser(this.UID);

    this.displayCanvas = displayCanvas;
    this.canvas = user.ctx.canvas;
    this.dispatcher = this.dispatcher.bind(this);
  };

  Draw.prototype.setCanvasSize = function setCanvasSize () {
    // console.log('setCanvasSize', this.opt);
    this.displayCtx.canvas.width = this.width;
    this.displayCtx.canvas.height = this.height;
  };

  // 是否有权限进行画布操作
  Draw.prototype.enableDraw = function enableDraw (enable) {
    console.log('enableDraw', enable);
    this.isEnable = !!enable;
    this.switchEventListener(!!enable);
    // 切换为观众后，如果当前在激光笔，先保存当前状态
    if (!enable) {
      this.currModeBk = '';
      if (/flag/.test(this.currMode)) {
        this.currModeBk = this.currMode;
        this.clearFlag();
        this.emit('action', { op: 'flagend' });
      }
      this.setCursor('not-allowed');
    } else {
      if (this.currModeBk) {
        // 恢复互动者后，恢复之前的状态
        this.currModeBk && this.mode(this.currModeBk);
        this.currModeBk = '';
      } else {
        this.currMode && this.setCursor(this.currMode.replace('draw:', ''));
      }
    }
  };

  /**
   * 增加或移除事件监听
   * @param {Boolean} add 是否增加事件监听
   * @private
   */
  Draw.prototype.switchEventListener = function switchEventListener (add) {
    var op = add ? 'add' : 'remove';
    var workCanvas = this.users[this.UID].ctx.canvas;
    var canvas = [workCanvas, this.displayCtx.canvas];
    workCanvas.style.visibility = add ? 'visible' : 'hidden';
    var d = this.dispatcher;
    canvas.forEach(function (c) {
      c[op + 'EventListener']('mousedown', d);
      c[op + 'EventListener']('mousemove', d);
      c[op + 'EventListener']('touchmove', d);
      c[op + 'EventListener']('touchstart', d);
    });
    document[op + 'EventListener']('mouseup', d);
    document[op + 'EventListener']('touchend', d);
  };

  // 设置光标样式
  Draw.prototype.setCursor = function setCursor (type) {
    var this$1 = this;
    if ( type === void 0 ) type = 'not-allowed';

    console.log('setCursor', type);
    var canvas = [
      this.users[this.UID].ctxFree.canvas,
      this.users[this.UID].ctxFlag.canvas,
      this.displayCtx.canvas
    ];
    type = /(flag|crosshair|not-allowed)/.test(type) ? type : 'crosshair';
    this.cursor = type || this.cursor;
    if (this.cursor === 'flag') {
      this.cursor = 'none';
    }
    canvas.forEach(function (c) {
      c.style.cursor = this$1.cursor;
    });
  };
  /**
   * 获取或者设置操作模式
   * @param {string} value 'flag', 'free', 'erase', 'fill', 'select'
   * @param {string} UID 进行操作的用户的ID
   * @public
   */
  Draw.prototype.mode = function mode (value, UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (!value) { return user.mode; }
    if (typeof value !== 'string') {
      throw new Error('操作模式不是字符串');
    }
    // 如果要设置的模式就是当前模式，直接返回
    // if (user.currMode === value) return;
    // console.log('change mode', value, UID);
    var v = value.split(':');
    user.mode = v[0];
    user.type = v[1] || 'free';
    user.type = user.type === 'flagend' ? 'free' : user.type;

    if (user.type === 'flag') {
      user.isFlag = true;
      user.ctx = user.ctxFlag;
      user.shapesFlag = {
        r: 3.5
      };
      // console.log('切换mode flag', user);
    } else {
      if (user.isFlag === true) {
        user.isFlag = false;
        this.clearFlag(UID);
      }
    }
    user.currMode = value;
    if (UID !== this.UID) {
      return;
    }
    // 暂存当前绘图模式
    this.currMode = value;
    // 当前是观众模式
    if (!this.isEnable) {
      this.currModeBk = value;
      return;
    }
    this.setCursor(user.type);
    this.emit('action', { UID: UID, op: 'mode', value: value });
  };
  Draw.prototype.clearFlag = function clearFlag (UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (!user) { return; }
    this.emit('action', { UID: UID, op: 'flagend' });
    user.shapesFlag = { r: 3.5 };
    user.ctx = user.ctxFree;
    clearCtx(user.ctxFlag);
    this._clear();
    render(this.displayCtx, this.shapes, ++this.visible, this.users);
  };
  /**
   * 获取或者设置笔&橡皮擦的大小
   * @param {number} value 笔&橡皮擦的大小
   * @param {string} UID 进行操作的用户的ID
   * @public
   */
  Draw.prototype.size = function size (value, UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (!value) { return user.size; }
    if (typeof value !== 'number') {
      throw new Error('Type Error: size');
    }
    user.size = value;
    this.emit('action', { UID: UID, op: 'size', value: value });
  };

  /**
   * 获取或者设置笔的颜色
   * @param {number} value 笔的颜色
   * @param {string} UID 进行操作的用户的ID
   * @public
   */
  Draw.prototype.color = function color (value, UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (!value) { return user.color; }
    user.color = value;
    if (UID === this.UID) {
      this.currColor = value;
    }
    this.emit('action', { UID: UID, op: 'color', value: value });
  };

  /**
   * 鼠标按下&开始触摸时的处理函数
   * @param {Point} offset 当前位置坐标
   * @param {string} UID 进行操作的用户的ID
   */
  Draw.prototype.mousedown = function mousedown (offset, UID) {
    if ( UID === void 0 ) UID = this.UID;

    var shape;
    var user = this.users[UID];
    var start = user.start;
    var oldMid = user.oldMid;
    var end = user.end;
    user.isMouseDown = true;
    var workCtx = user.ctx;
    if (user.type === 'free') {
      workCtx.canvas.style.visibility = 'hidden';
    } else {
      workCtx.canvas.style.visibility = 'visible';
    }
    applyState(this.displayCtx, user);
    switch (user.mode) {
      case 'draw':
      case 'erase':
        shape = new Shape(
          user.mode,
          user.type,
          user.size,
          user.color,
          new Point(offset.x, offset.y)
        );
        user.activeShape = shape;
        this.shapes.push(shape);
        user.shapes.push(this.shapes.length - 1);
        switch (user.type) {
          case 'free':
            // 用三个点画二次曲线，使笔迹光滑，降低锯齿感
            Point.set(start, offset.x, offset.y);
            Point.set(oldMid, start.x, start.y);
            Point.set(end, start.x, start.y);
            break;
          case 'flag':
            Point.set(start, offset.x, offset.y);
            break;
          default:
            Point.set(start, offset.x, offset.y);
            break;
        }
        break;
      case 'fill':
        shape = new Shape(
          user.mode,
          user.type,
          user.size,
          user.color,
          new Point(offset.x, offset.y)
        );
        this.shapes.push(shape);
        user.shapes.push(this.shapes.length - 1);
        fill(this.displayCtx, offset);
        break;
      case 'select':
        break;
    }
    if (user.mode !== 'select') {
      // linear undo model
      user.available = ++user.visible;
      this.visible++;
    }
    this.emit('action', { UID: UID, op: 'mousedown', value: offset });
  };

  /**
   * 鼠标移动&触摸移动时的处理函数
   * @param {Point} offset 当前位置坐标
   * @param {string} UID 进行操作的用户的ID
   */
  Draw.prototype.mousemove = function mousemove (offset, UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (UID === this.UID) {
      if (!this.isEnable) { return; }
    }
    if (!user.isMouseDown && !user.isFlag) { return; }

    var start = user.start;
    var oldMid = user.oldMid;
    var end = user.end;
    var workCtx = user.ctx;
    var displayCtx = this.displayCtx;
    if (user.isFlag) {
      clearCtx(workCtx);
      user.shapesFlag = Object.assign(user.shapesFlag, offset);
      this._clear();
      render(displayCtx, this.shapes, ++this.visible, this.users);
      this.emit('action', { UID: UID, op: 'mousemove', value: offset });
      return;
    }
    switch (user.mode) {
      case 'draw':
      case 'erase':
        applyState(displayCtx, user);
        switch (user.type) {
          case 'free':
            var mid = new Point((end.x + offset.x) / 2, (end.y + offset.y) / 2);
            free(workCtx, oldMid, end, mid);
            free(displayCtx, oldMid, end, mid);
            Point.set(oldMid, mid.x, mid.y);
            Point.set(end, offset.x, offset.y);
            break;
          case 'line':
            Point.set(end, offset.x, offset.y);
            workCtx.clearRect(
              0,
              0,
              workCtx.canvas.width,
              workCtx.canvas.height
            );
            line(workCtx, start, end);
            break;
          case 'rect':
            Point.set(end, offset.x, offset.y);
            workCtx.clearRect(
              0,
              0,
              workCtx.canvas.width,
              workCtx.canvas.height
            );
            rect(workCtx, start, end.x - start.x, end.y - start.y);
            break;
          case 'roundRect':
            Point.set(end, offset.x, offset.y);
            workCtx.clearRect(
              0,
              0,
              workCtx.canvas.width,
              workCtx.canvas.height
            );
            roundRect(workCtx, start, end.x - start.x, end.y - start.y, 30);
            break;
          case 'circle':
            Point.set(end, offset.x, offset.y);
            workCtx.clearRect(
              0,
              0,
              workCtx.canvas.width,
              workCtx.canvas.height
            );
            circle(workCtx, start, Math.abs(offset.x - start.x));
            break;
        }
        var corner = user.activeShape.corner;
        if (corner) {
          // 需要在移动时找到绘图范围的最左上角和右下角以确定绘图范围
          if (user.type === 'circle') {
            var radius = Math.abs(offset.x - start.x);
            corner[0].x = start.x - radius;
            corner[0].y = start.y - radius;
            corner[1].x = start.x + radius;
            corner[1].y = start.y + radius;
          } else {
            corner[0].x = Math.min(end.x, corner[0].x);
            corner[0].y = Math.min(end.y, corner[0].y);
            corner[1].x = Math.max(end.x, corner[1].x);
            corner[1].y = Math.max(end.y, corner[1].y);
          }
        }
        break;
      case 'fill':
        break;
      case 'select':
        break;
      case 'image':
        break;
    }
    this.emit('action', { UID: UID, op: 'mousemove', value: offset });
  };

  /**
   * 鼠标松开&触摸结束时的处理函数
   * @param {Point} offset 当前位置坐标
   * @param {string} UID 进行操作的用户的ID
   * @private
   */
  Draw.prototype.mouseup = function mouseup (offset, UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (!user.isMouseDown) { return; }
    user.isMouseDown = false;
    var start = user.start;
    var oldMid = user.oldMid;
    var end = user.end;
    var workCtx = user.ctx;
    var displayCtx = this.displayCtx;
    switch (user.mode) {
      case 'draw':
      case 'erase':
        applyState(displayCtx, user);
        switch (user.type) {
          case 'free':
            var mid = new Point((end.x + offset.x) / 2, (end.y + offset.y) / 2);
            free(workCtx, oldMid, end, mid);
            free(displayCtx, oldMid, end, mid);
            Point.set(oldMid, mid.x, mid.y);
            Point.set(end, offset.x, offset.y);
            break;
          case 'line':
            Point.set(end, offset.x, offset.y);
            line(workCtx, start, end);
            break;
          case 'rect':
            Point.set(end, offset.x, offset.y);
            rect(workCtx, start, end.x - start.x, end.y - start.y);
            break;
          case 'roundRect':
            Point.set(end, offset.x, offset.y);
            roundRect(workCtx, start, end.x - start.x, end.y - start.y, 30);
            break;
          case 'circle':
            Point.set(end, offset.x, offset.y);
            circle(workCtx, start, Math.abs(offset.x - start.x));
            break;
        }
        var corner = user.activeShape.corner;
        var ctx = user.activeShape.ctx;
        corner[0].x -= this.size();
        corner[0].y -= this.size();
        corner[1].x += this.size();
        corner[1].y += this.size();
        ctx.canvas.width = Math.ceil(corner[1].x - corner[0].x);
        ctx.canvas.height = Math.ceil(corner[1].y - corner[0].y);
        ctx.lineCap = ctx.lineJoin = user.ctx.lineCap;
        ctx.lineWidth = user.ctx.lineWidth;
        var imgData = workCtx.getImageData(
          corner[0].x,
          corner[0].y,
          ctx.canvas.width,
          ctx.canvas.height
        );
        ctx.putImageData(imgData, 0, 0);
        // document.body.appendChild(ctx.canvas)
        if (user.type !== 'free')
          { displayCtx.drawImage(ctx.canvas, corner[0].x, corner[0].y); }
        workCtx.clearRect(
          0,
          0,
          this.displayCtx.canvas.width,
          this.displayCtx.canvas.height
        );
        break;
      case 'fill':
        break;
      case 'select':
        break;
    }
    this.emit('action', { UID: UID, op: 'mouseup', value: offset });
  };

  /**
   * 撤销绘制，本地撤销模型，即只能撤销自己的绘制
   * @param {string} UID 进行操作的用户的ID
   * @public
   */
  Draw.prototype.undo = function undo (UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (user.visible === 0) { return; }

    var discard = user.shapes.pop();
    this.shapes[discard].visible = false;
    user.recycle.push(discard);
    --user.visible;
    this._clear();
    render(this.displayCtx, this.shapes, --this.visible, this.users);
    this.emit('action', { UID: UID, op: 'undo', value: UID });
  };

  /**
   * 绘制图片
   * @param {string} url 图片地址
   * @private
   */
  Draw.prototype.image = function image (url) {
    if (!url) { return; }
    var that = this;
    var canvas = this.displayCtx.canvas;
    var img = new Image();
    var tmpUrl =
      this.opt.backgroundUrl === undefined
        ? 'http://dev.netease.im/images/logo2.png'
        : this.opt.backgroundUrl;
    img.onload = function() {
      that.container.classList.remove('canvas-loading');
      canvas.style.backgroundSize = 'contain';
      canvas.style.backgroundImage = "url(" + url + ")";
    };
    this.container.classList.add('canvas-loading');
    canvas.style.backgroundSize = 'auto';
    canvas.style.backgroundImage = "url(" + tmpUrl + ")";
    img.src = url;
  };

  // 取消背景绘制
  Draw.prototype.clearImage = function clearImage () {
    this.displayCtx.canvas.style.backgroundImage = '';
  };

  /**
   * 反撤销绘制，取消本地撤销模型，即只能取消撤销自己的绘制
   * @param {string} UID 进行操作的用户的ID
   * @public
   */
  Draw.prototype.redo = function redo (UID) {
    if ( UID === void 0 ) UID = this.UID;

    var user = this.users[UID];
    if (user.visible === user.available) { return; }

    var restore = user.recycle.pop();
    this.shapes[restore].visible = true;
    user.shapes.push(restore);
    ++user.visible;
    this._clear();
    render(this.displayCtx, this.shapes, ++this.visible, this.users);
    this.emit('action', { UID: UID, op: 'redo', value: UID });
  };

  /**
   * 清除画板或者清除某个用户的绘制
   * @param {string} target 需要清除操作的用户ID
   * @param {string} UID 进行操作的用户的ID
   * @public
   */
  Draw.prototype.clear = function clear (target, UID) {
    var this$1 = this;
    if ( UID === void 0 ) UID = this.UID;

    this._clear();
    if (target && this.users[target]) {
      var user = this.users[target];
      user.isMouseDown = false;
      user.shapes.forEach(function (shape) {
        if (!this$1.shapes[shape]) { return; }
        this$1.shapes[shape].visible = false;
        this$1.visible--;
      });
      user.shapes = [];
      user.shapesFlag = { r: 3.5 };
      user.recycle = [];
      user.available = 0;
      user.visible = 0;
      this._clear();
      render(this.displayCtx, this.shapes, this.visible, this.users);
      return;
    }

    this.shapes = [];
    this.visible = 0;
    for (var _UID in this$1.users) {
      var user$1 = this$1.users[_UID];
      user$1.shapes = [];
      user$1.shapesFlag = { r: 3.5 };
      user$1.recycle = [];
      user$1.available = 0;
      user$1.visible = 0;
      user$1.isMouseDown = false;
    }
    this.emit('action', { UID: UID, op: 'clear', value: null });
  };

  /**
   * 清除画板，包括展示用Canvas和用户自己的Canavs
   * @private
   */
  Draw.prototype._clear = function _clear () {
    var this$1 = this;

    this.displayCtx.clearRect(0, 0, this.width, this.height);
    for (var _UID in this$1.users) {
      var user = this$1.users[_UID];
      user.ctx.clearRect(0, 0, this$1.width, this$1.height);
    }
  };

  /**
   * 收到指令后进行对应操作
   * @param {string} UID 用户ID
   * @param {string} op 操作
   * @param {any} [value] 操作值
   * @public
   */
  Draw.prototype.act = function act (ref) {
    var UID = ref.UID;
    var op = ref.op;
    var value = ref.value;

    var user = this.users[UID];
    if (!user) { this.users[UID] = this.addUser(UID); }
    this[op] && this[op](value, UID);
  };

  /**
   * 重新设置画布大小，等比例
   * @param {number} width 画布宽度
   * @public
   */
  Draw.prototype.resize = function resize (width) {
    var this$1 = this;

    width = parseInt(width);
    if (isNaN(width) || width <= 0) { throw new Error('白板宽度应是大于0的数字'); }
    var scale = width / this.width;
    var height = this.height * scale;

    resizeCanvas(this.displayCtx, scale);
    for (var UID in this$1.users) { resizeCanvas(this$1.users[UID].ctx, scale); }
    this.shapes.forEach(function (shape) {
      resizeCanvas(shape.ctx, scale);
      shape.corner[0].x *= scale;
      shape.corner[0].y *= scale;
      shape.corner[1].x *= scale;
      shape.corner[1].y *= scale;
    });

    this.width = width;
    this.height = height;
  };

  /**
   * 增加一个用户并初始化其canvas，已存在则直接返回
   * @param {String | Number} UID 用户ID
   * @return {User} 用户
   */
  Draw.prototype.addUser = function addUser (UID) {
    if (this.users[UID]) { return this.users[UID]; }
    var user = new User(UID);
    var canvas = user.ctx.canvas;
    var displayCanvas = this.displayCtx.canvas;
    canvas.style.position = 'absolute';
    canvas.style.boxSizing = 'content-box';
    canvas.style.top = displayCanvas.clientTop + 'px';
    canvas.style.left = displayCanvas.clientLeft + 'px';
    canvas.style.zIndex = displayCanvas.style.zIndex + 1;
    canvas.style.cursor = 'crosshair';
    canvas.style.width = this.width + 'px';
    canvas.style.height = this.height + 'px';
    canvas.width = this.width;
    canvas.height = this.height;
    user.ctx.lineCap = user.ctx.lineJoin = 'round';
    this.users[UID] = user;
    return this.users[UID];
  };
  /**
   * 移除一个用户, 删除其canvas
   * @param {String | Number} UID 用户ID
   * @return {User} 用户
   */
  Draw.prototype.removeUser = function removeUser (UID) {
    UID && this.clearFlag(UID) && this._removeUser(UID);
  };

  Draw.prototype._removeUser = function _removeUser (UID) {
    var user = this.users[UID];
    if (!user) { return; }
    try {
      this.container.removeChild(user.ctxFree.canvas);
      this.container.removeChild(user.ctxFlag.canvas);
    } catch (e) {}
    this.users[UID] = null;
    delete this.users[UID];
  };

  /**
   * 销毁白板, 移除所有用户
   * 实际上只移除了事件监听，并将内存占用较大的对象清空，等待垃圾回收
   * @private
   */
  Draw.prototype.destroy = function destroy () {
    var this$1 = this;

    Object.keys(this.users).map(function (key) {
      this$1._removeUser(key);
      delete this$1.users[key];
    });
    if (this.users[this.UID]) {
      this.switchEventListener(false);
    }
    this.container.removeChild(this.displayCtx.canvas);
    this.displayCtx = null;
    this.shapes = [];
    this.visible = 0;
  };

  /**
   * 对事件数据进行预处理，再调用对应的处理函数
   * @param {Event} e 鼠标或触摸屏事件
   * @private
   */
  Draw.prototype.dispatcher = function dispatcher (e) {
    e.preventDefault();
    e = e.originalEvent ? e.originalEvent : e;
    if (!this.displayCtx) { return; }
    var rect = this.displayCtx.canvas.getBoundingClientRect();
    var x, y;
    if (e.touches && e.touches.length === 1) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length === 1) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    if (!x && x !== 0) { x = 0; }
    if (!y && y !== 0) { y = 0; }
    var offset = new Point(x - rect.left, y - rect.top);
    var type = e.type;
    if (type === 'touchstart') { type = 'mousedown'; }
    if (type === 'touchmove') { type = 'mousemove'; }
    if (type === 'touchend') { type = 'mouseup'; }
    this[type](offset);
  };

  return Draw;
}(defaultExport$2));

var Point = function Point(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};
Point.prototype.copy = function copy () {
  return new Point(this.x, this.y);
};
Point.set = function set (point, x, y) {
  point.x = x;
  point.y = y;
};

/**
 * 绘制内容
 */
var Shape = function Shape(mode, type, size, color, start) {
  this.visible = true;
  // 在画完之后把绘制轨迹截取为图片保存在Canvas中
  this.ctx = document.createElement('canvas').getContext('2d');
  this.type = type;
  this.mode = mode;
  this.color = color;
  this.size = size;
  // 绘制内容保存为Canvas上所处位置
  this.corner = [start.copy(), start.copy()];
  this.transform = [];
  this.path = [];
  this.zIndex = 0;
};

var User = function User(UID) {
  this.UID = UID;
  this.ctxFree = document.createElement('canvas').getContext('2d');
  // 激光笔需要单独的图层
  this.ctxFlag = document.createElement('canvas').getContext('2d');
  // 默认为自由绘图模式
  this.ctx = this.ctxFree;
  this.shapes = []; // 保存用户所做的可视操作的index
  this.shapesFlag = {}; // 激光笔的标记操作, 没有轨迹
  this.recycle = [];
  this.mode = 'draw';
  this.type = 'free';
  this.size = 4;
  this.color = '#000';
  this.isMouseDown = false;
  this.start = new Point(0, 0);
  this.oldMid = new Point(0, 0);
  this.end = new Point(0, 0);
  // local undo/redo model
  this.visible = 0;
  this.available = 0;
  this.activeShape = {};
};

/**
 * 渲染
 * @param {Shape[]} shapes 绘制内容数组
 * @param {number} visibleCount 绘制个数
 * @private
 */
function render(ctx, shapes, visibleCount, users) {
  var count = 0;
  shapes.forEach(function (shape) {
    if (!shape.visible || count >= visibleCount) { return; }
    applyState(ctx, shape);
    if (shape.mode === 'fill') { return fill(ctx, shape.corner[0]); }
    ctx.drawImage(shape.ctx.canvas, shape.corner[0].x, shape.corner[0].y);
    visibleCount++;
  });
  renderFlag(ctx, users);
}

/**
 * 渲染激光笔
 * @param {Shape[]} shapes 绘制内容数组
 * @param {number} visibleCount 绘制个数
 * @private
 */
function renderFlag(ctx, users) {
  if (!users) { return; }
  Object.keys(users).map(function (key) {
    var tmpCtx = users[key].ctxFlag;
    var flags = users[key].shapesFlag;
    if (!flags.x || !flags.y) { return; }
    // console.log('renderFlag', flags);
    flag(ctx, flags, users[key].color);
  });
}

/**
 * 不同用户的模式、笔大小、颜色都是不同的，在对displayCtx操作时先应用状态
 * @param {string} UID 对应用户的ID
 * @param {number} size 笔大小
 * @param {string} color 颜色
 * @param {string} mode 模式
 * @private
 */
function applyState(displayCtx, ref) {
  var UID = ref.UID;
  var ctx = ref.ctx;
  var size = ref.size;
  var color = ref.color;
  var mode = ref.mode;

  if (UID !== undefined) {
    displayCtx.lineWidth = ctx.lineWidth = size;
    displayCtx.strokeStyle = ctx.strokeStyle = color;
  }
  if (mode === 'erase') {
    displayCtx.globalCompositeOperation = 'destination-out';
  } else {
    displayCtx.globalCompositeOperation = 'source-over';
  }
}

/**
 * 等比例缩放Canvas
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {number} scale 缩放比例
 * @private
 */
function resizeCanvas(ctx, scale) {
  var cvs = ctx.canvas;
  var temp = document.createElement('canvas').getContext('2d');
  temp.canvas.width = cvs.width;
  temp.canvas.height = cvs.height;
  temp.drawImage(cvs, 0, 0, cvs.width, cvs.height);
  cvs.style.width = cvs.width * scale + 'px';
  cvs.style.height = cvs.height * scale + 'px';
  cvs.width = cvs.width * scale;
  cvs.height = cvs.height * scale;
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.drawImage(temp.canvas, 0, 0, cvs.width, cvs.height);
}

/**
 * 清除某个画板的内容
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @private
 */
function clearCtx(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * 绘制单个点，没有任何轨迹
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {Point} end 终止点
 * @private
 */
function flag(ctx, start, color) {
  // console.log('flag', ctx, start);
  var r = start.r || 1.5;
  circle(ctx, start, r + 2, true, '#aaa');
  circle(ctx, start, r, true, color);
}

/**
 * 绘制曲线
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {Point} start 起始点
 * @param {Point} control 控制点
 * @param {Point} end 终止点
 * @private
 */
function free(ctx, start, control, end) {
  // 用三个点画二次曲线，使笔迹光滑，降低锯齿感
  if (start.x === end.x && start.y === end.y) {
    // IE下使用quadraticCurveTo无法画点
    rect(ctx, start, 1, 1);
    return;
  }
  if (start.c) {
    ctx.strokeStyle = start.c;
  }
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
  ctx.stroke();
}

/**
 * 绘制直线
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {Point} start 起始点
 * @param {Point} end 终止点
 * @private
 */
function line(ctx, start, end) {
  if (start.c) {
    ctx.strokeStyle = start.c;
  }
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

/**
 * 绘制矩形
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {Point} start 起始点
 * @param {number} w 宽度，单位px
 * @param {number} h 高度，单位px
 * @param {boolean} fill 是否填充
 * @private
 */
function rect(ctx, start, w, h, fill) {
  if ( fill === void 0 ) fill = false;

  if (fill) { ctx.fillRect(start.x, start.y, w, h); }
  else { ctx.strokeRect(start.x, start.y, w, h); }
}

/**
 * 绘制圆角矩形
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {CanvasRenderingContext2D} start 起始点
 * @param {number} w 宽度，单位px
 * @param {number} h 高度，单位px
 * @param {*} radius 圆角半径，单位px
 * @param {boolean} fill 是否填充
 * @private
 */
function roundRect(ctx, start, w, h, radius, fill) {
  if ( fill === void 0 ) fill = false;

  var sx = start.x;
  var sy = start.y;
  var radiusX = w < 0 ? -radius : radius;
  var radiusY = h < 0 ? -radius : radius;
  ctx.beginPath();
  ctx.moveTo(sx + radiusX, sy);
  ctx.lineTo(sx + w - radiusX, sy);
  ctx.quadraticCurveTo(sx + w, sy, sx + w, sy + radiusY);
  ctx.lineTo(sx + w, sy + h - radiusY);
  ctx.quadraticCurveTo(sx + w, sy + h, sx + w - radiusX, sy + h);
  ctx.lineTo(sx + radiusX, sy + h);
  ctx.quadraticCurveTo(sx, sy + h, sx, sy + h - radiusY);
  ctx.lineTo(sx, sy + radiusY);
  ctx.quadraticCurveTo(sx, sy, sx + radiusX, sy);
  ctx.stroke();
  if (fill) { ctx.fill(); }
}

/**
 * 绘制圆形
 * @param {CanvasRenderingContext2D} ctx 目标Canvas的context
 * @param {CanvasRenderingContext2D} center 圆心
 * @param {number} radius 半径，单位px
 * @param {boolean} fill 是否填充
 * @param {string} color 颜色
 * @private
 */
function circle(ctx, center, radius, fill, color) {
  if ( fill === void 0 ) fill = false;

  // console.log('circle', center, radius, fill, color);
  ctx.save();
  ctx.beginPath();
  if (color) {
    ctx.strokeStyle = color;
  }
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
  ctx.stroke();
  if (fill) { ctx.fill(); }
  ctx.restore();
}

/**
 * 为封闭区域填充颜色
 * TODO 为IE做Typed Array的polyfill
 * @param {Point} s 起始点
 * @param {String|Number} UID 执行此次操作的用户ID
 * @private
 */
function fill(ctx, s) {
  var sx = s.x;
  var sy = s.y;
  var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  var X = 0;
  var Y = 1;

  var stroke = ctx.strokeStyle;
  var r = parseInt(stroke.substr(1, 2), 16);
  var g = parseInt(stroke.substr(3, 2), 16);
  var b = parseInt(stroke.substr(5, 2), 16);
  // >>> 0 运算转换为无符号32位整数
  var fillColor = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
  var start = [sx, sy];
  var buf = new ArrayBuffer(img.data.length);
  var buf8 = new Uint8ClampedArray(buf);
  buf8.set(img.data);
  var data = new Uint32Array(buf);

  var startColor = data[sy * img.width + sx];
  if (startColor === fillColor) {
    return;
  }
  var queue = [start];
  var pixel;
  var maxX = img.width - 1;
  var maxY = img.height - 1;

  function compare(color) {
    return color === startColor || (color & 0xff000000) >>> 0 < 0xff000000;
  }

  while ((pixel = queue.pop())) {
    var pos = pixel[Y] * img.width + pixel[X];
    var x = pixel[X];
    var y = pixel[Y];

    while (y-- >= 0 && compare(data[pos])) {
      pos -= img.width;
    }
    pos += img.width;
    y++;

    var reachLeft = false;
    var reachRight = false;
    while (y++ < maxY && compare(data[pos])) {
      data[pos] = fillColor;
      if (x > 0) {
        if (compare(data[pos - 1])) {
          if (!reachLeft) {
            queue.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      if (x < maxX) {
        if (compare(data[pos + 1])) {
          if (!reachRight) {
            queue.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }
      pos += img.width;
    }
  }

  img.data.set(buf8);
  ctx.putImageData(img, 0, 0);
}

/**
 * 协议适配器
 * Web白板使用的通信数据形式和目前SDK定义的白板协议不同
 * 因此需要做一层转化
 */

var LOCAL_COLOR = '#f5455e';
var REMOTE_COLOR = '#238efa';

var fileTypeMap = {
  10: 'jpg',
  11: 'png',
  0: 'unknown'
};
var flagMap = {
  1: 1,
  2: 1,
  3: 1,
  12: 1
};
var syncMap = {
  8: 1,
  9: 1,
  10: 1,
  11: 1
};
var defaultExport = (function (EventEmitter$$1) {
  function defaultExport (container, opt) {
    var this$1 = this;
    if ( opt === void 0 ) opt = {};

    EventEmitter$$1.call(this);
    this.resetStatus();
    this.nim = opt.nim || {};
    this.debug = opt.debug || false;
    this.limit = opt.limit || 80;
    this.draw = new Draw(container, opt);
    this.draw.size(4);
    // 验证色值是否正确
    if (this.formatColor(opt.color, 10) === -1) {
      console.warn(
        'whiteboard::setColor:设置颜色失败:不合法的色值,采用默认红色值'
      );
      opt.color = LOCAL_COLOR;
    }
    this.draw.color(opt.color);
    this.draw.on('action', this.transform.bind(this));

    this.timer = setInterval(function () {
      Object.keys(this$1.dataQue).map(function (key) {
        if (!this$1.dataQue[key]) { return }
        // if (key - 0 === 0) {
        //   // 数据集合
        //   this.appendDatas(this.draw.UID, this.dataQue[key])
        // }
        var data = this$1.dataQue[key];
        if (this$1.debug) { data += '5:' + this$1.count + ',0;'; }
        this$1.emit('action', { key: key, data: data });
        this$1.dataQue[key] = '';
        this$1.count++;
      });
    }, this.limit);
  }

  if ( EventEmitter$$1 ) defaultExport.__proto__ = EventEmitter$$1;
  defaultExport.prototype = Object.create( EventEmitter$$1 && EventEmitter$$1.prototype );
  defaultExport.prototype.constructor = defaultExport;

  /**
   * 移除事件监听
   * 清除白板创建的canvas节点和内存占用较大的对象
   * 新建白板需要重新实例化
   * @public
   */
  defaultExport.prototype.destroy = function destroy () {
    this.resetStatus();
    this.timer && clearInterval(this.timer);
    this.timer = null;
    this.draw && this.draw.destroy();
    this.draw = null;
  };
  defaultExport.prototype.resetStatus = function resetStatus () {
    // 文档背景渲染数据池
    this.fileMap = {};
    // 所有人发送的数据集合，根据uid发送数据
    this.datas = {};
    // 己方待发送的队列
    this.dataQue = {};
    this.count = 0;
  };
  // 所有人发送的数据集合
  defaultExport.prototype.appendDatas = function appendDatas (uid, data, type) {
    if ( type === void 0 ) type = 'draw';

    if (!this.datas[uid]) {
      this.datas[uid] = {};
    }
    console.log('appendDatas', data, type);
    // 如果是普通绘图，数据累计，如果是播放PPT文档背景，数据覆盖
    if (type === 'file') {
      this.datas[uid][type] = data;
    } else {
      this.datas[uid][type] = (this.datas[uid][type] || '') + data;
    }
  };

  // 单播发送历史数据
  defaultExport.prototype.sendDatas = function sendDatas (uid, i) {
    var this$1 = this;
    if ( i === void 0 ) i = 0;

    console.log('sendDatas start', this.datas);
    Object.keys(this.datas).map(function (target) {
      var tmp = this$1.datas[target];
      Object.keys(tmp).map(function (item) {
        if (!tmp[item]) { return }
        console.log('sendDatas', tmp, item);
        this$1.emit('action', {
          key: uid,
          data: { uid: target, data: tmp[item] }
        });
      });
    });
  };

  defaultExport.prototype.clearDatas = function clearDatas () {
    this.datas = {};
  };
  // 设置绘图容器
  defaultExport.prototype.setContainer = function setContainer (container) {
    this.draw.setContainer(container);
  };

  // 是否允许绘图操作
  defaultExport.prototype.enableDraw = function enableDraw (enable) {
    this.draw.enableDraw(enable);
  };

  // 设置颜色
  defaultExport.prototype.setColor = function setColor (color, UID) {
    if (!color) { return }
    if (!/^#/.test(color)) {
      color = '#' + color;
    }
    if (this.formatColor(color, 10) === -1) {
      console.error('whiteboard::setColor:设置颜色失败:不合法的色值');
    } else {
      // console.log('setColor', color)
      this.draw.color(color, UID);
    }
  };

  // 设置样式
  defaultExport.prototype.setStyle = function setStyle (style) {
    this.draw.setStyle(style);
  };
  /**
   * 撤销操作
   * @public
   */
  defaultExport.prototype.undo = function undo () {
    this.draw.undo();
  };
  /**
   * 反撤销操作
   * @public
   */
  defaultExport.prototype.redo = function redo () {
    this.draw.redo();
  };
  /**
   * 清空操作
   * @public
   */
  defaultExport.prototype.clear = function clear () {
    this.draw.clear();
  };

  // 设置绘图模式
  defaultExport.prototype.setDrawMode = function setDrawMode (mode, uid) {
    this.draw.mode(("draw:" + mode), uid);
  };

  // 绘制图片
  defaultExport.prototype.image = function image (option, UID) {
    if ( UID === void 0 ) UID = this.draw.UID;

    var url = option.url;
    var docId = option.docId;
    var pageCount = option.pageCount;
    var currentPage = option.currentPage;
    if (url) {
      this.draw.image(url, UID);
    } else {
      this._image(option, UID);
    }
    if (UID !== this.draw.UID) { return }
    // 发送指令
    this.transform({
      UID: this.draw.UID,
      op: 'file',
      value: {
        docId: docId,
        pageCount: pageCount,
        currentPage: currentPage
      }
    });
  };

  defaultExport.prototype._image = function _image (option, UID) {
    console.log('_image', option);
    var docId = option.docId;
    var currentPage = option.currentPage;
    if (!docId || currentPage - 0 === 0) {
      this.clearImage(UID);
      return
    }
    var nim = this.nim;
    var file = this.fileMap[docId];
    if (!file && !nim) { return }
    console.log('file!!!', file);
    if (file) {
      var url = (file.prefix) + "_" + (file.type) + "_" + currentPage + "." + (fileTypeMap[file.transType]);
      this.draw.image(url, UID);
      return
    }
    var that = this;
    if(!window.nim){
      console.warn('缺少nim实例，无法拉取文件');
      return
    }
    window.nim.getFile({
      docId: docId,
      success: function (data) {
        // console.log('getFile success', data)
        that.fileMap[docId] = data;
        that._image(option, UID);
      },
      error: function (error) {
        console.error('getFile error', error);
      }
    });
  };

  // 取消背景图片
  defaultExport.prototype.clearImage = function clearImage (UID) {
    if ( UID === void 0 ) UID = this.draw.UID;

    this.draw.clearImage();
    if (UID !== this.draw.UID) { return }
    if (this.datas[UID]) {
      this.datas[UID].file = '';
    }
    this.transform({
      UID: this.draw.UID,
      op: 'file',
      value: {
        docId: ''
      }
    });
  };

  /**
   * 等比例调整画布大小，
   * @public
   * @param {Number} width 画布大小
   */
  defaultExport.prototype.resize = function resize (width) {
    this.draw.resize(width);
  };

  /**
   * 收到协议数据后进行白板操作
   * @public
   * @param {String | Number} UID 发送数据的用户ID
   * @param {String} data 白板协议数据
   */
  defaultExport.prototype.act = function act (ref) {
    var this$1 = this;
    var UID = ref.UID;
    var data = ref.data;

    if (UID === this.draw.UID) { return }
    if (!this.draw.users[UID]) {
      this.draw.addUser(UID);
      this.draw.users[UID].color = REMOTE_COLOR;
    }
    var ops = data.split(';');
    var width = this.draw.width;
    var height = this.draw.height;
    // console.log('act', data, ops)
    var syncType = data.match(/\d+/);
    if (!syncMap[syncType && syncType[0]]) {
      this.appendDatas(UID, data);
    }
    ops.forEach(function (op) {
      if (!op) { return }
      var arr = op.split(':');
      var type = arr[0];
      var value = arr.length > 1 ? arr[1].split(',') : [];
      var action = {};
      // console.log('act', type, data)
      switch (type) {
        case '1': // 起始点 1:x,y,rgb
          action.op = 'mousedown';
          action.value = {
            x: Math.ceil(parseFloat(value[0]) * width),
            y: Math.ceil(parseFloat(value[1]) * height)
          };
          break
        case '2': // 移动点 1:x,y,rgb
          action.op = 'mousemove';
          this$1.setColor(this$1.formatColor(value[2]), UID);
          action.value = {
            x: Math.ceil(parseFloat(value[0]) * width),
            y: Math.ceil(parseFloat(value[1]) * height)
          };
          break
        case '3': // 结束点 3:x,y,rgb
          action.op = 'mouseup';
          action.value = {
            x: Math.ceil(parseFloat(value[0]) * width),
            y: Math.ceil(parseFloat(value[1]) * height)
          };
          break
        case '4': // 上一步 4
          action.op = 'undo';
          action.value = UID;
          break
        case '5': // 包序号 5:id
          // console.log(value[0])
          return
        case '6': // 清空 6
          action.op = 'clear';
          this$1.clearDatas();
          this$1.dataQue[UID] += '7:0,0;';
          break
        case '7': // 清空响应 7
          action.op = 'clear';
          action.value = UID;
          break
        case '8': // 同步请求 8
          console.log('收到同步请求', UID);
          this$1.sendDatas(UID);
          return
        case '9': // 同步 9:uid,end
          console.log('同步数据', action.value);
          break
        case '10': // 同步准备 10
          action.value = UID;
          action.op = 'syncResponse';
          this$1.draw.clear();
          this$1.draw.clearImage();
          break
        case '11': // 同步准备响应 11
          break
        case '12': // 标记 12:x,y,rgb
          action.op = 'mousemove';
          this$1.draw.color(this$1.formatColor(value[2]), UID);
          action.value = {
            x: Math.ceil(parseFloat(value[0]) * width),
            y: Math.ceil(parseFloat(value[1]) * height)
          };
          this$1.setDrawMode('flag', UID);
          break
        case '13': // 标记结束 13
          // action.op = 'mousemove'
          // action.value = {
          //   x: Math.ceil(parseFloat(value[0]) * width),
          //   y: Math.ceil(parseFloat(value[1]) * height)
          // }
          this$1.setDrawMode('flagend', UID);
          break
        case '14': // 文档分享 14:docId,pageCount,currentPage
          this$1.image(
            {
              docId: value[0],
              currentPage: value[1],
              pageCount: value[2]
            },
            UID
          );
          break
        default:
          return
      }
      action.UID = UID;
      this$1.draw.act(action);
    });
  };

  defaultExport.prototype.removeUser = function removeUser (UID) {
    UID && this.draw.removeUser(UID);
  };

  /**
   * @private
   * @param {{ UID: String, op: String, value: any, target }} action 原始操作
   * target: 默认为空，如果有值则代表发送给该target
   * @return {void} 无返回
   */
  defaultExport.prototype.transform = function transform (action) {
    if (action.UID !== this.draw.UID) { return }
    var target = action.target || 0;
    var user = this.draw.users[action.UID];
    var type = '';
    var value = [];
    var width = this.draw.width;
    var height = this.draw.height;
    var x, y;
    switch (action.op) {
      case 'mousedown':
        type = '1';
        x = action.value.x / width;
        y = action.value.y / height;
        value.push(x.toFixed(2), y.toFixed(2)); // , parseInt(this.color, 16))
        break
      case 'mousemove':
        type = '2';
        x = action.value.x / width;
        y = action.value.y / height;
        value.push(x.toFixed(2), y.toFixed(2));
        break
      case 'mouseup':
        type = '3';
        x = action.value.x / width;
        y = action.value.y / height;
        value.push(x.toFixed(2), y.toFixed(2));
        break
      case 'undo':
        type = '4';
        value.push(0, 0);
        break
      case 'color':
        this.color = parseInt(action.value.substring(1), 16);
        return
      case 'clear':
        type = '6';
        value.push(0, 0);
        break
      case 'syncRequest':
        type = '8';
        value.push(0, 0);
        break
      case 'syncBegin':
        type = '10';
        value.push(0, 0);
        break
      case 'syncResponse':
        type = '11';
        value.push(0, 0);
        break
      case 'flag':
        type = '12';
        x = action.value.x / width;
        y = action.value.y / height;
        value.push(x.toFixed(2), y.toFixed(2));
        break
      case 'flagend':
        type = '13';
        break
      case 'file':
        type = '14';
        value.push(
          action.value.docId,
          action.value.currentPage,
          action.value.pageCount,
          '1'
        );
        break
      default:
        return
    }
    if (flagMap[type]) {
      type = user.isFlag ? '12' : type;
      value.push(this.formatColor(this.draw.currColor, 10));
    }
    var data = type + ':' + value.join(',') + ';';
    this.dataQue[target] = this.dataQue[target] || '';
    this.dataQue[target] += data;
    if (type === '12') { return }
    if (type === '6') {
      this.clearDatas();
    } else if (type === '14') {
      this.appendDatas(this.draw.UID, this.dataQue[target], 'file');
    } else if (flagMap[type]) {
      this.appendDatas(this.draw.UID, this.dataQue[target]);
    }
    // console.log(this.dataQue[target])
  };

  /**
   * 格式化颜色值, 默认为十六进制(16), 默认自动补齐
   * @param {string} color 十六进制请不要带#号
   * @param {number} format 需要转换的进制, 默认为十六进制
   */
  defaultExport.prototype.formatColor = function formatColor (color, format) {
    if ( format === void 0 ) format = 16;

    if (!color) { return -1 }
    var res = '';
    if (format === 16) {
      color = +color;
      if (color < 0) {
        res = this.hex2rgb(color);
        console.log('hex2rgb', color, res);
        return res
      }
      res = color.toString(16);
      if (res.length < 3) {
        res = ('000' + res).slice(-3);
      }
      if (res.length > 3 && res.length < 6) {
        res = ('000' + res).slice(-6);
      }
      res = '#' + res;
      console.log('formatColor 16', color, res);
      return res
    } else if (format === 10) {
      res = color.replace(/#/gi, '');
      res = parseInt('0x' + res);
      console.log('formatColor 10', color, res);
      return isNaN(res) ? -1 : res
    }
  };

  // rgba转rgb
  defaultExport.prototype.hex2rgb = function hex2rgb (val) {
    // return '#' + (0x00FFFFFF & val)
    var red = (val >> 16) & 0xff;
    var green = (val >> 8) & 0xff;
    var blue = val & 0xff;
    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);
    console.log('rgb', red, green, blue);
    return (
      '#' +
      ('0' + red).slice(-2) +
      ('0' + green).slice(-2) +
      ('0' + blue).slice(-2)
    )
  };

  // 同步准备清空，主播重新登录聊天室后，广播该协议给其他人，其他人收到后进行本地清空
  defaultExport.prototype.syncBegin = function syncBegin () {
    console.log(
      '同步准备清空，主播重新登录聊天室后，广播该协议给其他人，其他人收到后进行本地清空'
    );
    this.transform({
      UID: this.draw.UID,
      op: 'syncBegin'
    });

    this.clearImage();
  };

  // 同步请求，非主播重新登录后发请求给主播
  defaultExport.prototype.syncRequest = function syncRequest (uid) {
    console.log('同步请求，非主播重新登录后发请求给主播');
    this.transform({
      UID: this.draw.UID,
      op: 'syncRequest',
      target: uid
    });
  };

  // 同步响应，非主播重新登录后发请求给主播
  defaultExport.prototype.syncResponse = function syncResponse () {
    this.transform({
      UID: this.draw.UID,
      op: 'syncResponse'
    });
  };

  return defaultExport;
}(defaultExport$2));

return defaultExport;

})));
