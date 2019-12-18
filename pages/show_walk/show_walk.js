// pages/show_walk/show_walk.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  navigateToUserProfile(e) {
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/userprofile/userprofile?id=${id}`
    })
  },

  setWalk: function(id) {
    let that = this
    let Walk = new wx.BaaS.TableObject('walk')
    Walk.get(id.toString()).then(res => {
      let walk = res.data;
      that.setData({ walk: walk })
      that.setWalkStories()
    }, err => {
    })
  },

  setWalkStories: function() {
    let that = this
    let storiesIdArr = that.data.walk.stories_id_arr
    let query = new wx.BaaS.Query()
    let Story = new wx.BaaS.TableObject('story')
    query.compare('created_at', '>', 0)
    query.compare('visible', '=', true)
    Story.setQuery(query).find().then(res => {
      let stories = res.data.objects

      let walkStories = stories.filter(function (item) {
        return (storiesIdArr.includes(item.id))
      })
      that.setData({walkStories: walkStories})
      that.setMarkers(walkStories)
    })
  },

  setMarkers: function(walkStories) {
    let that = this
    let markers = walkStories.map(walkStory => {
      return {
        id: walkStory.id,
        latitude: walkStory.latitude,
        longitude: walkStory.longitude,
        name: walkStory.title,
        iconPath: 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifOM5c01ybmL4zj.png',
        width: 40,
        height: 40
      }
    });
    that.setData({ markers })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let walkId = options.id // Setting walkId from Page properties
    this.setWalk(walkId) // setting Walk object by search with Walk ID in local page data
    let user = wx.getStorageSync('user')
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

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

  }
})