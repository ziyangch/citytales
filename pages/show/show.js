// pages/show/show.js
Page({

  /**
   * Page initial data
   */
  data: {
    displayCommentBox: false,
    comments:[

    ],
    comment:{
      content: undefined,
      likes: 0,
    },
    content: undefined,
    user: {id: undefined},

    texts: "至少5个字",
    min: 5,//最少字数
    max: 10, //最多字数 (根据自己需求改变)

    focusInput: false,
    height: '',
    isInput: false
  },

  inputFocus(e) {
    console.log(e, '键盘弹起')
    this.setData({
      height: e.detail.height,
      isInput: true
    })
  },
  inputBlur() {
    console.log('键盘收起')
    this.setData({
      isInput: false
    })
  },

  focusButn: function () {
    this.setData({
      focusInput: true,
      isInput: true
    })
  },


  setDisplayDate: function (story) {
    let date = new Date(story.date)
    story.display_day = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    story.display_time = [date.getHours(), date.getMinutes()].map(this.formatNumber).join(':')
    return story
  },

  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  setStory(id) {
    let Story = new wx.BaaS.TableObject('story')
    Story.get(id.toString()).then(res => {
      let story = res.data;
      story = this.setDisplayDate(story)
      this.setData({ story })
    }, err => {
    })
  },

  getUserStory: function (storyId, userId) {
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')

    query.compare('story', '=', storyId)
    query.compare('user', '=', userId)
    query.compare('visible', '=', true)
    UserStory.setQuery(query).find().then(res => {
      if (res.data.objects.length !== 0) {
        let userStory = res.data.objects[0];
        this.setData({ userStory }) // Saving User story to local page data
      }
    })
  },

  showCommentBox: function () {
    let displayCommentBox = this.data.displayCommentBox
    displayCommentBox = true
    console.log(displayCommentBox, "set true")
    this.setData({displayCommentBox})
  },

  hideCommentBox: function () {
    let displayCommentBox = this.data.displayCommentBox
    displayCommentBox = false
    console.log(displayCommentBox, "set false")
    this.setData({ displayCommentBox })
  },

  getComments: function (storyId) {
    let query = new wx.BaaS.Query()
    let Comments = new wx.BaaS.TableObject('comment')

    query.compare('story', '=', storyId)
    Comments.setQuery(query).expand(['user']).find().then(res => {
      if (res.data.objects.length !== 0) {
        let comments = res.data.objects;
        this.setData({ comments }) // Saving User story to local page data
      }
    })
  },


  onChangeContent: function (e) {
    console.log(e)
    this.setData({
      "comment.content": e.detail.value,
    })
  },


  commentStory: function () {
    let story = this.data.story // (1) increase "people_commented" of Story object
    let peopleCommented = story.people_commented
    peopleCommented += 1

    let Story = new wx.BaaS.TableObject('story') // (2) update 'people_commented' to Story object in data base
    let dbStory = Story.getWithoutData(story.id)
    dbStory.set("people_commented", peopleCommented)
    dbStory.update().then(res => {
      let story = res.data
      story = this.setDisplayDate(story) // (3) add display data format for Story object
      this.setData({ story }) // (4) set updated Story object in local page data
    }, err => {
    })

    let Comment = new wx.BaaS.TableObject('comment')
    let comment = Comment.create()
    let newComment = { // (5) creating new Comment object
      user: this.data.user.id,
      story: this.data.story.id,
      avatar: this.data.user.avatar,
      content: this.data.comment.content,
      likes: this.data.comment.likes 
    }
    comment.set(newComment).save().then(res => { // (6) saving new Comment object into DB
      let comment = res.data
      let comments = this.data.comments
      comments.push(comment) // (7) pushing new comment to existing comments array
      this.setData({ comments }) // (8) setting comments array Object in local page data
      // this.setData({"comment.content": ""})
      console.log('comment_content', this.data.comment.content)
      console.log('content', this.data.content.value)
    }, err => {
    })
  
  wx.showToast({
    title: `已成功评论！`,
    icon: 'success'
  })

  this.setData({
    'content': ''
  })
  this.hideCommentBox()
  },

  unlikeComment: function (e) {
    let id = e.currentTarget.dataset.id
    let likes = e.currentTarget.dataset.likes
    console.log(id)
    console.log(likes)
    let Comment = new wx.BaaS.TableObject('comment')
    let dbComment = Comment.getWithoutData(id)
    likes -= 1
    dbComment.set("likes", likes)
    dbComment.update().then(res => {
      console.log(res)
      let id = res.data.id
      let likes = res.data.likes
      let comments = this.data.comments
      for (var i in comments) {
        if (comments[i].id == id) {
          comments[i].likes = likes;
          break; //Stop this loop, we found it!
        }
      }
      this.setData({ comments })
    }, err => {
    })
    wx.showToast({
      title: `取消喜欢`,
      icon: 'success'
    })
  },

  likeComment: function (e) {
    let id = e.currentTarget.dataset.id
    let likes = e.currentTarget.dataset.likes
    console.log(id)
    console.log(likes)
    let Comment = new wx.BaaS.TableObject('comment')
    let dbComment = Comment.getWithoutData(id)
    likes += 1
    dbComment.set("likes", likes)
    dbComment.update().then(res => {
      console.log(res)
      let id = res.data.id
      let likes = res.data.likes
      let comments = this.data.comments
      for (var i in comments) {
        if (comments[i].id == id) {
          comments[i].likes = likes;
          break; //Stop this loop, we found it!
        }
      }
      this.setData({ comments })
    }, err => {
    })
    wx.showToast({
      title: `已喜欢！`,
      icon: 'success'
    })
  },

  unsaveUserStory: function () {
    if ((this.data.user.id)) {
      
      let story = this.data.story // (1) decrease "people_saved" of Story object
      let peopleSaved = story.people_saved
      peopleSaved -= 1

      let Story = new wx.BaaS.TableObject('story') // (2) update 'people_saved' to Story object in data base
      let dbStory = Story.getWithoutData(story.id)
      dbStory.set("people_saved", peopleSaved)
      dbStory.update().then(res => {
        let story = res.data
        story = this.setDisplayDate(story) // (3) add display data format for Story object
        this.setData({ story }) // (4) set updated Story object in local page data
      }, err => {
      })

      let userStory = this.data.userStory
      userStory.saved = false // (5) change 'saved' attribute in UserStory object

      let UserStory = new wx.BaaS.TableObject('user_story')
      let dbUserStory = UserStory.getWithoutData(userStory.id)
      dbUserStory.set("saved", userStory.saved) // (6) update 'saved' to UserStory object in data base
      dbUserStory.update().then(res => {
        let userStory = res.data
        this.setData({ userStory }) // (7) set updated UserStory object in local page data
        // this.getUserStories(this.data.story.id) // (8) get UserStories --- for avatar display
      }, err => {
      })

      wx.showToast({
        title: `成功取消收藏`,
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: `请先登录`,
        icon: 'none'
      })      
    }
  },

  saveUserStory: function () {
    if ((this.data.user.id)) {
     
      let story = this.data.story // (1) increase "people_saved" of Story object
      let peopleSaved = story.people_saved
      peopleSaved += 1

      let Story = new wx.BaaS.TableObject('story') // (2) update 'people_saved' to Story object in data base
      let dbStory = Story.getWithoutData(story.id)
      dbStory.set("people_saved", peopleSaved)
      dbStory.update().then(res => {
        let story = res.data
        story = this.setDisplayDate(story) // (3) add display data format for Story object
        this.setData({ story }) // (4) set updated Story object in local page data
      }, err => {
      })

      if (this.data.userStory) { // (5a) updating "saved" to true in DB, if UserStory already exists
        let userStory = this.data.userStory
        userStory.saved = true

        let UserStory = new wx.BaaS.TableObject('user_story') // (6a) update 'saved' to UserStory object in data base
        let dbUserStory = UserStory.getWithoutData(userStory.id)
        dbUserStory.set("saved", userStory.saved)
        dbUserStory.update().then(res => {
          let userStory = res.data
          this.setData({ userStory }) // (7a) set updated UserStory Object in local page data
          // this.getUserStories(this.data.story.id) // (8a) get UserStories --- for avatar display
        }, err => {
        })

      } else { // Creating new UserStory and saving into DB, if User Story does not exist yet

        let UserStory = new wx.BaaS.TableObject('user_story')
        let userStory = UserStory.create()
        let newUserStory = { // (5b) creating new UserStory object with 'saved' = true
          user: this.data.user.id,
          story: this.data.story.id,
          saved: true
        }
        userStory.set(newUserStory).save().then(res => { // (6b) saving new UserStory object into DB
          let userStory = res.data
          this.setData({ userStory }) // (7b) setting UserStory Object in local page data
          // this.getUserStories(this.data.story.id) // (8b) getting UserStories --- for avatar display
        }, err => {
        })
      }
      wx.showToast({
        title: `已成功收藏！`,
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: `请先登录`,
        icon: 'none'
      })
    }
  },


  unlikeUserStory: function () {
    if ((this.data.user.id)) {
      
      let story = this.data.story // (1) decrease "people_liked" of Story object
      let peopleLiked = story.people_liked
      peopleLiked -= 1

      let Story = new wx.BaaS.TableObject('story') // (2) update 'people_liked' to Story object in data base
      let dbStory = Story.getWithoutData(story.id)
      dbStory.set("people_liked", peopleLiked)
      dbStory.update().then(res => {
        let story = res.data
        story = this.setDisplayDate(story) // (3) add display data format for Story object
        this.setData({ story }) // (4) set updated Story object in local page data
      }, err => {
      })

      let userStory = this.data.userStory
      userStory.liked = false // (5) change 'liked' attribute in UserStory object

      let UserStory = new wx.BaaS.TableObject('user_story')
      let dbUserStory = UserStory.getWithoutData(userStory.id)
      dbUserStory.set("liked", userStory.liked) // (6) update 'liked' to UserStory object in data base
      dbUserStory.update().then(res => {
        let userStory = res.data
        this.setData({ userStory }) // (7) set updated UserStory object in local page data
        // this.getUserStories(this.data.story.id) // (8) get UserStories --- for avatar display
      }, err => {
      })

      wx.showToast({
        title: `取消喜欢`,
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: `请先登录`,
        icon: 'none'
      })
    }
  },



  likeUserStory: function () {
    if ((this.data.user.id)) {
      
      let story = this.data.story // (1) increase "people_liked" of Story object
      let peopleLiked = story.people_liked
      peopleLiked += 1

      let Story = new wx.BaaS.TableObject('story') // (2) update 'people_liked' to Story object in data base
      let dbStory = Story.getWithoutData(story.id)
      dbStory.set("people_liked", peopleLiked)
      dbStory.update().then(res => {
        let story = res.data
        story = this.setDisplayDate(story) // (3) add display data format for Story object
        this.setData({ story }) // (4) set updated Story object in local page data
      }, err => {
      })

      if (this.data.userStory) { // (5a) updating "liked" to true in DB, if UserStory already exists
        let userStory = this.data.userStory
        userStory.liked = true

        let UserStory = new wx.BaaS.TableObject('user_story') // (6a) update 'liked' to UserStory object in data base
        let dbUserStory = UserStory.getWithoutData(userStory.id)
        dbUserStory.set("liked", userStory.liked)
        dbUserStory.update().then(res => {
          let userStory = res.data
          this.setData({ userStory }) // (7a) set updated UserStory Object in local page data
          // this.getUserStories(this.data.story.id) // (8a) get UserStories --- for avatar display
        }, err => {
        })

      } else { // Creating new UserStory and saving into DB, if User Story does not exist yet

        let UserStory = new wx.BaaS.TableObject('user_story')
        let userStory = UserStory.create()
        let newUserStory = { // (5b) creating new UserStory object with 'liked' = true
          user: this.data.user.id,
          story: this.data.story.id,
          liked: true
        }
        userStory.set(newUserStory).save().then(res => { // (6b) saving new UserStory object into DB
          let userStory = res.data
          this.setData({ userStory }) // (7b) setting UserStory Object in local page data
          // this.getUserStories(this.data.story.id) // (8b) getting UserStories --- for avatar display
        }, err => {
        })
      }
      wx.showToast({
        title: `已喜欢！`,
        icon: 'success'
      })
    } else {
      wx.showToast({
        title: `请先登录`,
        icon: 'none'
      })      
    }
  },

  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  openLocation: function () {
    let latitude = this.data.story.latitude
    let longitude = this.data.story.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },

  deleteUserStory: function (userStoryId) {
    let UserStory = new wx.BaaS.TableObject('user_story')
    let dbUserStory = UserStory.getWithoutData(userStoryId)
    dbUserStory.set("visible", false)
    dbUserStory.update().then(res => {}, err => {})
  },

  deleteUserStories: function (storyId) {
    console.log("entered delete UserStories")
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')
    query.compare('story', '=', storyId)
    console.log("ready for query...")
    UserStory.setQuery(query).find().then(res => {
      let userStories = res.data.objects;
      console.log("entered pre Iteration")
      userStories.forEach((userStory) => {
        this.deleteUserStory(userStory.id)
      })
    })
  },

  deleteStory: function () {
    let Story = new wx.BaaS.TableObject('story')
    let story = this.data.story
    let dbStory = Story.getWithoutData(story.id)
    dbStory.set("visible", false)
    dbStory.update().then(res => {
      // success
      let storyId = this.data.story.id
      // ********************************** delete comments
      this.deleteUserStories(storyId)
      wx.showToast({
        title: `城事已删掉！`,
        icon: 'success'
      })
      this.navigateToHome()
    }, err => {
      // err
    })
  },

  loginWithWechat: function (data) {
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      console.log("this is current user---->", user)
      this.setData({ user })
    }, err => {
      console.log(err);
      // 登录失败
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    let storyId = options.id // Setting storyId from Page properties
    this.setStory(storyId) // setting Story object by search with Story ID in local page data
    
    wx.BaaS.auth.getCurrentUser().then(user => { // Getting current_user information
      this.setData({ user })  // Saving User object to local page data
      this.getUserStory(storyId, user.id)
      this.getComments(storyId)
      // this.getUserStories(storyId) // getting UserStories --- for avatar display
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

  },
  inputs: function (e) {
    console.log(e)
    this.setData({
      "comment.content": e.detail.value,
    })

    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最少字数限制
    if (len <= this.data.min) {
      this.setData({
        texts: "最低五个字"
      })
    } else if (len > this.data.max) {
      this.setData({
        texts: "超过最多字数限制"
      });
    } else {
      this.setData({ texts: " " })
    }
    this.setData({
      currentWordNumber: len //当前字数
    });
  }
})