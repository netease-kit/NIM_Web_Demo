import EmojiObj from '../../utils/emojimap.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    localAlbumImages: ['/images/album-emoji.png', '/images/album-ajtd.png', '/images/album-xxy.png', '/images/album-lt.png'],
    albumArr: [],
    currentAlbum: 'emoji',
    emojiList: {},
    currentAlbumKeys: [] //存储每一类别的key
  },
  attached: function() {
    let currentAlbumKeys = this.splitAlbumKeys(Object.keys(EmojiObj.emojiList[this.data.currentAlbum]), this.data.currentAlbum == 'emoji' ? 23 : 10)
    this.setData({
      albumArr: EmojiObj.albumArr,
      emojiList: EmojiObj.emojiList,
      currentAlbumKeys
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
       * 切换emoji类别
       */
    switchAlbum: function(e) {
      let currentAlbum = e.currentTarget.dataset.album
      // 提前跟新一次，下面分类需要用到
      this.setData({
        currentAlbum
      })
      let currentAlbumKeys = this.splitAlbumKeys(Object.keys(this.data.emojiList[currentAlbum]), currentAlbum == 'emoji' ? 23 : 10, currentAlbum)

      this.setData({
        currentAlbumKeys
      })
    },
    /**
     * 每页显示固定个数
     * arr数据源数组，space每个数组最大容量 
     * [[], [], []]
     */
    splitAlbumKeys: function (arr, space, currentAlbum) {
      const delta = space || 23
      let result = [],
        factor = Math.ceil(arr.length / delta),
        begin = 0,
        end = 1
      if (factor == 1) {
        result = [[...arr]]
      } else {
        for (let i = 1; i < factor; i++) {
          let temp = []
          temp = [...arr.slice(begin, i * delta)]
          begin = i * delta
          result.push(temp)
        }
        result.push([...arr.slice(delta * (factor - 1), arr.length)])
      }
      if (currentAlbum == 'emoji' || this.data.currentAlbum == 'emoji') { // 只有emoji才添加删除按钮
        result.map((cata, index) => {
          if(index != (result.length-1)) {
            cata.push('[删除]')
          }
        })
        // console.log(result)
      }
      return result
    },
    /**
     * 单击emoji
     */
    emojiTap: function(e) {
      let emoji = e.target.dataset.emoji
      if (!emoji) return
      // console.log(emoji)
      this.triggerEvent("EmojiClick", emoji)
    },
    /**
     * 发送emoji
     */
    emojiSend: function () {
        this.triggerEvent("EmojiSend")
      }
  },
})
