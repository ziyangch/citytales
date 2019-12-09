// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    current: 0,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }, {
      id: 1,
      iconPath: '/image/red_pin.png',
      latitude: 23.099994,
      longitude: 113.344520,
      width: 40,
      height: 40,
      callout: {
        content: '我是这个大笨蛋',
        fontSize: 14,
        color: '#ffffff',
        bgColor: '#000000',
        padding: 8,
        borderRadius: 4,
        boxShadow: '4px 8px 16px 0 rgba(0)'
      }
    }, {
      id: 2,
      iconPath: '/image/red_pin.png',
      latitude: 23.099994,
      longitude: 113.304520,
      width: 40,
      height: 40,
      callout: {
        content: '你呢?',
        fontSize: 14,
        color: '#ffffff',
        bgColor: '#000000',
        padding: 8,
        borderRadius: 4,
        boxShadow: '4px 8px 16px 0 rgba(0)'
      }
      },],   
  },

  markertap: function(event) {
    console.log('marker id --------> ', event.markerId)
    let current_story = this.data.stories.find(story => story.id == event.markerId);
    this.setData({current_story})
  },

  setMarkers: function (stories) {
    let markers = stories.map(story => { 
      return {
        id: story.id,
        latitude: story.latitude,
        longitude: story.longitude,
        name: story.title,
        iconPath: '/image/red_pin.png',
        width: 40,
        height: 40
      }
      });
    console.log('markersarray', markers)
    this.setData({markers})
  },

  setStories: function() {
    console.log("fetching stories....")
    let query = new wx.BaaS.Query()
    let Story = new wx.BaaS.TableObject('story')

    query.compare('created_at', '>', 0)
    Story.setQuery(query).find().then(res => {
      console.log('stories.....', res.data.objects)
      let stories = res.data.objects
      this.setData({stories})
      this.setMarkers(res.data.objects)
      this.setData({stories})
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const that = this
    wx.getLocation({
      type: 'wgs84', // **1
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.setData({ latitude, longitude, speed, accuracy })
      }
    })
    this.setStories()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  onChange(e) {
    this.setData({
      current: e.detail.key,
    })
  }
})