// pages/walks/walks.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  setWalks: function () {
    let query = new wx.BaaS.Query()
    let Walk = new wx.BaaS.TableObject('walk')
    query.compare('created_at', '>', 0)
    Walk.setQuery(query).limit(1000).find().then(res => {
      let walks = res.data.objects
      this.setData({ walks })
    })
  },

  navigateToShow(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show_walk/show_walk?id=${id}`
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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
    this.setWalks()
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