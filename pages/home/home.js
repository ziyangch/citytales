// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    current_story: false,
    current: 0,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: []
  },

  navigateToShow(e) {
    let id = e.currentTarget.dataset.id
    console.log("this is show id", id)
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  markerTap: function(event) {
    this.setMarkers(this.data.stories)

    console.log('marker id --------> ', event.markerId)
    let current_story = this.data.stories.find(story => story.id == event.markerId);
    this.setData({ current_story })

    let markers = this.data.markers
    let index = this.data.stories.findIndex(story => story.id == event.markerId);
    markers[index].width = 60
    markers[index].height = 60

    this.setData({markers})
  },

  mapTap: function(event) {
    console.log(event)
    let current_story = false
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
    query.compare('visible', '=', true)
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
    wx.BaaS.auth.getCurrentUser().then(user => {
      this.setData({ user })
    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
    this.setStories()
    this.mapCtx = wx.createMapContext('myMap')
    const that = this
    wx.getLocation({
      type: 'wgs84', // **1
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({ latitude, longitude })
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function (e) {
  
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.setStories()
    this.mapCtx = wx.createMapContext('myMap')
    const that = this
    wx.getLocation({
      type: 'wgs84', // **1
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({ latitude, longitude })
      }
    })
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
    return {
      title: '城事CityTales',
      path: 'pages/home/home',
      imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576076902204&di=3976f55fd2511190201063cb611dbfc1&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F10%2F15%2Fse16101588a.jpg'
    }
  },
  onChange(e) {
    this.setData({
      current: e.detail.key,
    })
  }
})