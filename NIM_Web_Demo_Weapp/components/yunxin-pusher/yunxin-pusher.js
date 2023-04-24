Component({
  properties: {
    config: {
      type: Object,
      value: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    },
    debug: {
      type: Boolean,
      value: false
    },
    minBitrate: {
      type: Number,
      value: 200
    },
    maxBitrate: {
      type: Number,
      value: 500
    },
    enableCamera: {
      type: Boolean,
      value: true
    },
    muted: {
      type: Boolean,
      value: false
    },
    beauty: {
      type: String,
      value: 0
    },
    aspect: {
      type: String,
      value: "3:4"
    },
    /**
     * 加载状态：loading、ready、error
     */
    status: {
      type: String,
      value: "loading",
      observer: function (newVal, oldVal, changedPath) {
        console.log(`yunxin-pusher status changed from ${oldVal} to ${newVal}`);
      }
    },
    coverText: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: "",
      observer: function (newVal, oldVal, changedPath) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    livePusherContext: null, // 组件操作上下文
    detached: false // 组件是否被移除标记
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    /**
     * 在组件实例被从页面节点树移除时执行
     */
    detached: function () {
      console.log("yunxin-pusher detached");
      // auto stop yunxin-pusher when detached
      // this.stop()
      this.setData({
        detached: true
      })
    },
    /**
     * 在组件布局完成后执行，此时可以获取节点信息
     */
    attached: function () {
      console.log("yunxin-pusher ready")
      this.start()
      this.setData({
        detached: false
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 播放推流
     * 一般情况下不应手动调用，在推流组件预备好后会自动被调用
     */
    start(options = {}) {
      if (!this.livePusherContext) {
        this.livePusherContext = wx.createLivePusherContext()
      }
      console.log(`starting yunxin-pusher`);
      this.livePusherContext.start(options)
    },
    /**
     * 停止推流
     */
    stop(options = {}) {
      if (this.livePusherContext) {
        console.log(`stopping yunxin-pusher`);
        this.livePusherContext.stop(options)
      }
    },
    /**
     * 切换前后摄像头
     */
    switchCamera() {
      this.livePusherContext.switchCamera()
    },
    /**
     * 快照
     */
    snapshot() {
      this.livePusherContext.snapshot()
    },

    /**
     * 推流状态变化事件回调
     */
    stateChangeHandler(e) {
      console.warn(`yunxin-pusher code: ${e.detail.code} - ${e.detail.message}`)
      if (e.detail.code === -1307) { // 网络断连，且经多次重连抢救无效，更多重试请自行重启推
        console.log('yunxin-pusher stopped', `code: ${e.detail.code}`);
        this.setData({
          status: "error"
        })
        this.livePusherContext.stop({
          complete: () => {
            this.livePusherContext.start()
          }
        })
        this.triggerEvent('pushfailed');
      } else if (e.detail.code === 1008) { // 编码器启动
        console.log(`yunxin-pusher started`, `code: ${e.detail.code}`);
        if (this.data.status === "loading") {
          this.setData({
            status: "ready"
          })
        }
      }
    },
    /**
     * 网络状态通知回调
     */
    netChangeHandler(e) {
      // console.log(`network: ${JSON.stringify(e.detail)}`);
    },
    /**
     * 开启调试
     */
    toggleDebug(isDebug) {
      this.setData({
        debug: isDebug
      })
    }
  }
})
