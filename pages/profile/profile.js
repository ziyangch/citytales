// pages/profile/profile.js
Page({

  /**
   * Page initial data
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

  navigateToEditProfile: function () {
    wx.navigateTo({
      url: '/pages/edit_profile/edit_profile'
    })
  },

  setApple: function () {
    let tableName = 'apple'
    let recordID = '5df70bc6d69d0e122d89a3f0'

    let Product = new wx.BaaS.TableObject(tableName)

    Product.get(recordID).then(res => {
      console.log("this is controller", res)
      this.setData({
        "apple": res.data.controller
      })
      // success
    }, err => {
      // err
    })
  },

  setStoriesCreated: function (id) {
    console.log("fetching stories....")
    let query = new wx.BaaS.Query()
    let Event = new wx.BaaS.TableObject('story')

    query.compare('created_by', '=', id)
    query.compare('visible', '=', true)
    console.log("ready for query...")
    Event.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      let stories_created = res.data.objects;
      console.log('created stories', this.data.stories_created);
      this.setData({ stories_created })
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
    wx.BaaS.auth.getCurrentUser().then(user => {
      user.custom_nickname = user.get("custom_nickname")
      user.bio = user.get("bio")
      this.setData({ user })
      this.setStoriesLiked(user.id)
      this.setStoriesSaved(user.id)
      this.setStoriesCreated(user.id)

    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })

    this.setApple()
  },

  loginWithWechat: function (data) {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      console.log("this is current user---->", user)
      user.custom_nickname = user.get("custom_nickname")
      user.bio = user.get("bio")
      wx.setStorage({
        key: 'user',
        data: user,
      })
      this.setData({ user })
    }, err => {
      console.log(err);
      // 登录失败
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

  },

  onChange(e) {
    this.setData({
      current: e.detail.key,
    })
  }
})