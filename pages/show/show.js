// pages/show/show.js
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';

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
      likers:[],
    },
    content: undefined,
    dateNow: undefined,

    posterConfig:{
    width: 375,
    height: 812,
    backgroundColor: '#FFF',
    pixelRatio: 1,
    blocks: [{
      width: 630,
      height: 0,
      x: 0,
      y: 190,
      borderWidth: 1,
      borderColor: '#DDDDDD'
    }],
    texts: [{
    },
    ],
    images: [{
     }]
    },

    user: {id: undefined},

    texts: "至少5个字",
    min: 5,//最少字数
    max: 150, //最多字数 (根据自己需求改变)

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

setMarkers: function () {
 let latitude = this.data.story.latitude
 let longitude = this.data.story.longitude
 let markers = [{  
   iconPath: "https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifOM5c01ybmL4zj.png",
    id: 0,
    latitude: latitude,
    longitude: longitude,
    width: 40,
    height: 40
 }]
this.setData({markers})
},

  navigateToUserProfile(e) {
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/userprofile/userprofile?id=${id}`
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
    console.log(id)
    let Story = new wx.BaaS.TableObject('story')
    Story.get(id.toString()).then(res => {
      let story = res.data;
      story = this.setDisplayDate(story)
      this.setData({ story })
      this.setMarkers()

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
    let userId = this.data.user.id.toString()
    let query = new wx.BaaS.Query()
    let Comments = new wx.BaaS.TableObject('comment')

    query.compare('story', '=', storyId)
    Comments.setQuery(query).expand(['user']).find().then(res => {
      if (res.data.objects.length !== 0) {
        let comments = res.data.objects;
        comments.forEach((comment) => {
          if (comment && comment.likers && comment.likers.length !== 0) {
            comment["userLiked"] = comment.likers.includes(userId)
          }
        })
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

  dateToday: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) {
      month = '0' + month;
    };
    if (day < 10) {
      day = '0' + day;
    };
    let formatDate = year + '/' + month + '/' + day;
    console.log(formatDate)
    this.setData({
      "dateNow": formatDate
    })
  },

  commentStory: function () {
    let story = this.data.story
    let peopleCommented = story.people_commented
    
    peopleCommented += 1

    let Story = new wx.BaaS.TableObject('story')
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
      content: this.data.comment.content,
      likes: this.data.comment.likes, 
      date: this.data.dateNow
    }

    if (this.data.comment.content.length <= this.data.min) {
      wx.showToast({
        title: `字数不够`,
        icon: 'none'
      })
    } else if (this.data.comment.content.length > this.data.max) {
      wx.showToast({
        title: `字数太多`,
        icon: 'none'
      })
    } else {
      comment.set(newComment).save().then(res => { // (6) saving new Comment object into DB
        this.getComments(this.data.story.id) // (7) get comments from DB
      }, err => console.log(err))

      wx.showToast({ title: '已成功评论！' })
      this.setData({ 'value': '' })
      this.setData({ 'comment.content': '' })
      this.setData({ 'currentWordNumber': 0 })
      this.hideCommentBox()
    } 
  },

  unlikeComment: function (e) {
    let storyId = this.data.story.id
    let id = e.currentTarget.dataset.id
    let likes = e.currentTarget.dataset.likes
    let userId = this.data.user.id.toString()
    
    let Comment = new wx.BaaS.TableObject('comment')
    let dbComment = Comment.getWithoutData(id)
    
    likes -= 1
    
    dbComment.set("likes", likes)
    dbComment.remove("likers", userId)
    dbComment.update().then(res => {
      this.getComments(storyId)
      wx.showToast({title: `取消喜欢`})
    }, err => {
      wx.showToast({
        title: `网络错误`,
        icon: 'loading'
      })
    })
  
  },

  likeComment: function (e) {
    let storyId = this.data.story.id
    let id = e.currentTarget.dataset.id
    let likes = e.currentTarget.dataset.likes
    let user = this.data.user.id.toString()
    let Comment = new wx.BaaS.TableObject('comment')
    let dbComment = Comment.getWithoutData(id)
    likes += 1
    dbComment.set("likes", likes)
    dbComment.append("likers", user)
    dbComment.update().then(res => {
      this.getComments(storyId)
      wx.showToast({title: '已喜欢!'})
    }, err => {
      wx.showToast({title: '网络错误', icon: 'loading'})
    })

    let Like = new wx.BaaS.TableObject('like')
    let like = Like.create()
    let newLike = { 
      user: this.data.user.id,
      comment: e.currentTarget.dataset.id,
      liked: true
    }
    like.set(newLike).save().then(res => { // (6b) saving new UserStory object into DB
      let like = res.data
      console.log("this is like",like)
      this.setData({ like }) // (7b) setting UserStory Object in local page data
      // this.getUserStories(this.data.story.id) // (8b) getting UserStories --- for avatar display
    }, err => {
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

  navigateToProfile: function () {
    wx.switchTab({
      url: '/pages/profile/profile'
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

  setApple: function () {
    let tableName = 'apple'
    let recordID = '5df70bc6d69d0e122d89a3f0'

    let Product = new wx.BaaS.TableObject(tableName)

    Product.get(recordID).then(res => {
      console.log("this is controller", res)
      this.setData({
        "apple":res.data.controller
      })
      // success
    }, err => {
      // err
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    let storyId = options.id // Setting storyId from Page properties
    this.setStory(storyId) // setting Story object by search with Story ID in local page data
    console.log(this.data)
    let user = wx.getStorageSync('user')
    if (user) {
      this.setData({ user })  // Saving User object to local page data
      this.getUserStory(storyId, user.id)
      this.getComments(storyId)
      // this.getUserStories(storyId) // getting UserStories --- for avatar display
    }
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
    this.dateToday()
    this.setApple()
   
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
      title: '一起来探索城事吧！',
      path: `/pages/show/show?id=${this.data.story.id}`
    }
  },
  onCreatePoster () {
    console.log(e)
    
  },
  onPosterSuccess (e) {
    let { detail } = e
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  //Comment Function
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
  },
//Create Poster Function
  onPosterFail (e) {
    console.log(e)
  },
  
  setConfig() {
    console.log(this.data)
    this.setData({
      posterConfig: {

        texts: [{
          x: 25,
          y: 115,
          text: 'CityTales',
          fontFamily: 'Baskerville',
          fontSize: 60,
          color: '#484E5C',
          fontWeight: 'bold'
        },
        {
          x: 25,
          y: 180,
          text: '欢迎来到你的城事',
          fontFamily: 'STFangsong',
          fontSize: 50,
          color: '#484E5C'
        },
        {
          x: 25,
          y: 325,
          text: this.data.story.title,
          fontFamily: 'STFangsong',
          fontSize: 40,
          color: '#484E5C',
          width: 600,
          marginLeft: 50,
          marginRight: 50
        },
        {
          x: 25,
          y: 930,
          text: this.data.story.address,
          fontFamily: 'STFangsong',
          fontSize: 30,
          color: '#484E5C',
          marginLeft: 50,
          marginRight: 50,
          lineNum: 3,
          width: 675
        },
        {
          x: 25,
          y: 1015,
          text: this.data.story.content,
          // '我用什么才能留住你？我给你贫穷的街道、绝望的日落、破败郊区的月亮。我给你一个久久地望着月亮的人的悲哀。我给你我已死去的先辈，人们用大理石纪念她们的幽灵；我给你我写的书中所能包含的一切悟力、我生活中所能有的男子气概或幽默。我给你一个从未有过信仰的人的忠诚。我给你我设法保全的我自己的核心——不营字造句，不和梦想交易，不被时间、欢乐和逆境触动的核心。——博尔赫斯',
          //TODO: 用户自定义祝福语，随机生成语料库
          fontFamily: 'STFangsong',
          fontSize: 30,
          color: '#484E5C',
          opacity: 0.85,
          // textAlign: 'center',
          lineHeight: 40,
          lineNum: 13,
          width: 675,
          fontStyle: 'italic',
        },
        {
          x: 355,
          y: 1570,
          text: 'From: 城事Official Account',
          fontFamily: 'STFangsong',
          fontSize: 30,
          color: '#484E5C'
        },

        // {
        //   x: 380,
        //   y: 1220,
        //   text: '请长按保存或分享图片',
        //   //TODO: 用户自定义祝福语
        //   fontFamily: 'KaiTi',
        //   fontSize: 24,
        //   color: '#F30',
        //   textAlign: 'center'
        // },
        ],
        images: [
          {
          width: 750,
          height: 1624,
          x: 0,
          y: 0,
            url: 
            // 白信纸//'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifIFkVh2efgacEF.png'
            //Vintage concrete
             'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifGvmTkQz63CdSf.png'
            // 黄色纹理 
  // 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifGHSfOd8uiHaZG.JPG'
        },
          {
          width: 700,
          height: 525,
          x: 25,
          y: 350,
          url: this.data.story.image
        }, 
        {
          width: 200,
          height: 200,
          x: 525,
          y: 40,
          url: 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifh3hlco9fcu01w.PNG'
          //邮票二维码
        }
        ]
      }
    }, () => {
      Poster.create(true);
  })}
  
})