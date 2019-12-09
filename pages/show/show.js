// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  setDisplayDate: function (event) {
    let date = new Date(event.date)

    // const dateArray = date.toLocaleString().split(', ')
    event.display_day = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    event.display_time = [date.getHours(), date.getMinutes()].map(this.formatNumber).join(':')
    return event
  },

  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  getStory(id) {
    let Story = new wx.BaaS.TableObject('story')
   
    Story.get(id.toString()).then(res => {
      console.log("this is res", res)
      let story = res.data;
      story = this.setDisplayDate(story)
      this.setData({ story })
      console.log("this is story",story)
      // success
    }, err => {
      // err
    })
  },

  getUserStory: function (storyId, userId) {
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')

    query.compare('story', '=', storyId.toString())
    query.compare('user', '=', userId.toString())
    console.log("ready for query...")
    UserStory.setQuery(query).find().then(res => {
      console.log('fetched result object from getting User story: ...')
      console.log(res)
      if (res.data.objects.length !== 0) {
        let userStory = res.data.objects[0];
        console.log('userstory fetched')
        this.setData({ userStory }) // Saving User story to local page data
      }
    })
  },

  unsaveUserStory: function () {
    let story = this.data.story // (1) update people_saved to Story object in data base
    let peopleSaved = story.people_saved
    console.log(peopleSaved, typeof (peopleSaved))
    peopleSaved = peopleSaved === null ? "0" : peopleSaved;
    // peopleSaved = Number.parseInt(peopleSaved)
    peopleSaved -= 1

    let Story = new wx.BaaS.TableObject('story') // (2) update people_saved to Story object in data base
    let dbStory = Story.getWithoutData(story.id)
    dbStory.set("people_saved", peopleSaved)
    dbStory.update().then(res => {
      let story = res.data
      story = this.setDisplayDate(story)
      this.setData({ story })
    }, err => {
    })

    let userStory = this.data.userStory
    userStory.saved = false

    let UserStory = new wx.BaaS.TableObject('user_story') // update 'saved' to User Story object in data base
    let dbUserStory = UserStory.getWithoutData(userStory.id)
    dbUserStory.set("saved", userStory.saved)
    dbUserStory.update().then(res => {
      let userStory = res.data
      this.setData({ userStory })
      this.getUserStorys(this.data.story.id)
    }, err => {
    })

    wx.showToast({
      title: `成功取消收藏`,
      icon: 'success'
    })
  },

  saveUserStory: function () {
    let story = this.data.story // (1) update people_saved to Event object in data base
    let peopleSaved = story.saved
    peopleSaved = peopleSaved === null ? "0" : peopleSaved;
    // peopleSaved = Number.parseInt(peopleSaved)
    peopleSaved += 1
    console.log(peopleSaved, typeof (peopleSaved))

    let Story = new wx.BaaS.TableObject('story') // (2) update 'people_saved' to Story object in data base
    let dbStory = Story.getWithoutData(story.id)

    dbStory.set("people_saved", peopleSaved)
    dbStory.update().then(res => {
      let story = res.data
      story = this.setDisplayDate(story)
      this.setData({ story })
    }, err => {
    })

    if (this.data.userStory) { // updating "saved" to true in DB, if User Story already exists

      let userStory = this.data.userStory
      userStory.saved = true

      let UserStory = new wx.BaaS.TableObject('user_story') // update 'saved' to User Story object in data base
      let dbUserStory = UserStory.getWithoutData(userStory.id)
      dbUserStory.set("saved", userStory.saved)
      dbUserStory.update().then(res => {
        let userStory = res.data
        this.setData({ userStory })
        // this.getUserStorys(this.data.story.id)
      }, err => {
      })

    } else { // Creating new User Story and saving into DB, if User Story doens not exist yet

      let UserStory = new wx.BaaS.TableObject('user_story')
      let userStory = UserStory.create()
      let newUserStory = {
        user_id: this.data.user.id,
        story_id: this.data.story.id,
        saved: true
      }
      userStory.set(newUserStory).save().then(res => {
        let userStory = res.data
        this.setData({ userStory })
        // this.getUserStorys(this.data.story.id)
      }, err => {
      })
    }
    wx.showToast({
      title: `已成功收藏！`,
      icon: 'success'
    })
  },

  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    let storyId = options.id // Setting eventId from Page properties
    console.log("this is storyId--->" ,storyId)
    this.getStory(storyId) // Getting Event object by search with Event ID
    wx.BaaS.auth.getCurrentUser().then(user => { // Getting current_user information
      this.setData({ user })  // Saving current_user object to local page data
      this.getUserStory(storyId, user.id)
      // this.getUserStories(storyId)
    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
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