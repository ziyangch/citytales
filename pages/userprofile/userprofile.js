// pages/userprofile/userprofile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0
  },

  setStoriesLiked: function (id) {
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')

    query.compare('user', '=', id)
    query.compare('liked', '=', true)
    query.compare('visible', '=', true)
    UserStory.setQuery(query).expand(['story']).find().then(res => {
      let user_stories_liked = res.data.objects;
      let stories_liked = user_stories_liked.map(user_story_liked => user_story_liked.story)
      this.setData({ stories_liked })
    })
  },

  setStoriesSaved: function (id) {
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')

    query.compare('user', '=', id)
    query.compare('saved', '=', true)
    query.compare('visible', '=', true)
    UserStory.setQuery(query).expand(['story']).find().then(res => {
      let user_stories_saved = res.data.objects;
      let stories_saved = user_stories_saved.map(user_story_saved => user_story_saved.story)
      this.setData({ stories_saved })
    })
  },

  navigateToShow(e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  setProfile(id) {
    console.log(id)
    let User = new wx.BaaS.User()
    User.get(id.toString()).then(res => {
      let user = res.data;
      this.setData({ user })
      this.setStoriesLiked(user.id)
      this.setStoriesSaved(user.id)
    }, err => {
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = options.id // Setting storyId from Page properties
    console.log(userId)
    this.setProfile(userId) // setting Story object by search with Story ID in local page data
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onChange(e) {
    this.setData({
      current: e.detail.key,
    })
  }
})