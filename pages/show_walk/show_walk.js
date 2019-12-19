// pages/show_walk/show_walk.js
Page({

  /**
   * Page initial data
   */
  data: {
    visible1: false,
    visible2: false,
    btnShimmering: false,
    scale: 16,
    toView: 'green',
    scrollTop: 100,
    latitude: undefined,
    longitude: undefined,
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  open1() {
    this.setData({
      visible1: true,
    })
  },
  open2() {
    this.setData({
      visible2: true,
    })
  },
  close1() {
    this.setData({
      visible1: false,
    })
  },
  close2() {
    this.setData({
      visible2: false,
    })
  },
  onClose(key) {
    console.log('onClose')
    this.setData({
      [key]: false,
    })
  },
  onClose1() {
    this.onClose('visible1')
  },
  onClose2() {
    this.onClose('visible2')
  },
  onClosed1() {
    console.log('onClosed')
  },

   navigateToShow(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  navigateToUserProfile(e) {
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/userprofile/userprofile?id=${id}`
    })
  },

  navigateToWalks: function () {
    wx.switchTab({
      url: '/pages/walks/walks'
    })
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

  setWalk: function(id) {
    let that = this
    let Walk = new wx.BaaS.TableObject('walk')
    Walk.get(id.toString()).then(res => {
      let walk = res.data;
      that.setData({ walk: walk })
      that.setWalkStories()
      let scale = walk.scale
      that.setData({scale: scale})
      that.setData({ latitude: walk.latitude })
      that.setData({longitude: walk.longitude})
    }, err => {
    })
  },


  setPolyline: function (walkId) {
    let that = this
    let Walk = new wx.BaaS.TableObject('walk')

    Walk.get(walkId).then(res => {
      console.log("Result of DB Read Walk", res)
      let polylineLatitudeArr = res.data.polyline_latitude
      let polylineLongitudeArr = res.data.polyline_longitude
      let pl = []
      for (let i = 0; i < (polylineLatitudeArr.length); i += 1) {
        pl.push({ latitude: polylineLatitudeArr[i], longitude: polylineLongitudeArr[i] })
      }
      that.setData({
        polyline: [{
          points: pl,
          color: "#0091ff",
          width: 3
        }]
      })
      // success
    }, err => {
      // err
    })
  },


  setWalkStories: function() {
    let that = this
    let query = new wx.BaaS.Query()
    let Story = new wx.BaaS.TableObject('story')
    query.compare('created_at', '>', 0)
    query.compare('visible', '=', true)
    Story.setQuery(query).limit(1000).find().then(res => {
      let storiesIdArr = that.data.walk.stories_id_arr
      let stories = res.data.objects
      let walkStories = storiesIdArr.map((storyId) => {
        return stories.find(story => story.id === storyId)
      })

  
      // let walkStories = stories.filter(function (item) {
      //   return (storiesIdArr.includes(item.id))
      // })
      that.setData({walkStories: walkStories})
      that.setMarkers(walkStories)
      that.setIncludePoints(walkStories)
      that.setAverageLatitude(walkStories)
      that.setAverageLongitude(walkStories)
    })
  },

  setAverageLatitude: function(walkStories) {
    let that = this
    let latitudeSum = 0
    walkStories.forEach((story) => {
      latitudeSum = latitudeSum + story.latitude
    })
    let averageLatitude = latitudeSum / walkStories.length
    that.setData({latitude: averageLatitude})
  },

  setAverageLongitude: function (walkStories) {
    let that = this
    let longitudeSum = 0
    walkStories.forEach((story) => {
      longitudeSum = longitudeSum + story.longitude
    })
    let averageLongitude = longitudeSum / walkStories.length
    that.setData({ longitude: averageLongitude })
  },

  setIncludePoints: function(walkStories) {
    let that = this
    let points = walkStories.map(walkStory => {
      return {
        latitude: walkStory.latitude,
        longitude: walkStory.longitude
      }
    })
    that.setData({points})
  },

  setMarkers: function(walkStories) {
    let that = this
    let markers = walkStories.map(walkStory => {
      return {
        id: walkStory.id,
        latitude: walkStory.latitude,
        longitude: walkStory.longitude,
        // name: walkStory.title,
        iconPath: 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifOM5c01ybmL4zj.png',
        width: 40,
        height: 40
      }
    });
    markers[0].iconPath = 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ihsSL0ltvp6rwf1.png'
    that.setData({ markers })
  },

  setUserWalk: function (walkId, userId) {
    let that = this
    let query = new wx.BaaS.Query()
    let UserWalk = new wx.BaaS.TableObject('user_walk')

    query.compare('walk', '=', walkId)
    query.compare('user', '=', userId)
    query.compare('visible', '=', true)
    UserWalk.setQuery(query).limit(1000).find().then(res => {
      if (res.data.objects.length !== 0) {
        let userWalk = res.data.objects[0];
        that.setData({ userWalk }) // Saving User walk to local page data
      }
    })
  },

  unlikeUserWalk: function () {
    let that = this
    if ((that.data.user.id)) {

      let walk = that.data.walk // (1) decrease "people_liked" of Walk object
      let peopleLiked = walk.people_liked
      peopleLiked -= 1

      let Walk = new wx.BaaS.TableObject('walk') // (2) update 'people_liked' to Walk object in data base
      let dbWalk = Walk.getWithoutData(walk.id)
      dbWalk.set("people_liked", peopleLiked)
      dbWalk.update().then(res => {
        let walk = res.data
        that.setData({ walk }) // (4) set updated Walk object in local page data
      }, err => {
      })

      let userWalk = that.data.userWalk
      userWalk.liked = false // (5) change 'liked' attribute in UserWalk object

      let UserWalk = new wx.BaaS.TableObject('user_walk')
      let dbUserWalk = UserWalk.getWithoutData(userWalk.id)
      dbUserWalk.set("liked", userWalk.liked) // (6) update 'liked' to UserWalk object in data base
      dbUserWalk.update().then(res => {
        let userWalk = res.data
        that.setData({ userWalk }) // (7) set updated UserWalk object in local page data
        // that.getUserWalks(that.data.walk.id) // (8) get UserWalks --- for avatar display
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

  likeUserWalk: function () {
    let that = this
    if (!(that.data.user === undefined)) {

      let walk = that.data.walk // (1) increase "people_liked" of Walk object
      let peopleLiked = walk.people_liked
      peopleLiked += 1

      let Walk = new wx.BaaS.TableObject('walk') // (2) update 'people_liked' to Walk object in data base
      let dbWalk = Walk.getWithoutData(walk.id)
      dbWalk.set("people_liked", peopleLiked)
      dbWalk.update().then(res => {
        let walk = res.data
        that.setData({ walk }) // (4) set updated Walk object in local page data
      }, err => {
      })

      if (that.data.userWalk) { // (5a) updating "liked" to true in DB, if UserWalk already exists
        let userWalk = that.data.userWalk
        userWalk.liked = true

        let UserWalk = new wx.BaaS.TableObject('user_walk') // (6a) update 'liked' to UserWalk object in data base
        let dbUserWalk = UserWalk.getWithoutData(userWalk.id)
        dbUserWalk.set("liked", userWalk.liked)
        dbUserWalk.update().then(res => {
          let userWalk = res.data
          that.setData({ userWalk }) // (7a) set updated UserWalk Object in local page data
          // that.getUserWalks(that.data.walk.id) // (8a) get UserWalks --- for avatar display
        }, err => {
        })

      } else { // Creating new UserWalk and saving into DB, if User Walk does not exist yet

        let UserWalk = new wx.BaaS.TableObject('user_walk')
        let userWalk = UserWalk.create()
        let newUserWalk = { // (5b) creating new UserWalk object with 'liked' = true
          user: that.data.user.id,
          walk: that.data.walk.id,
          liked: true
        }
        userWalk.set(newUserWalk).save().then(res => { // (6b) saving new UserWalk object into DB
          let userWalk = res.data
          that.setData({ userWalk }) // (7b) setting UserWalk Object in local page data
          // that.getUserWalks(that.data.walk.id) // (8b) getting UserWalks --- for avatar display
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
        icon: 'none',
        success: function () {
          console.log('success!!!!!')
          that.setData({ btnShimmering: true }),
            setTimeout(function () {
              console.log("setting Timeout!!!!!!")
              that.setData({ btnShimmering: false })
            }, 1500)
        }
        
      })
    }
  },

  loginWithWechat: function (data) {
    let that = this
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      console.log("this is current user---->", user)
      user.custom_nickname = user.get("custom_nickname")
      user.bio = user.get("bio")
      wx.setStorage({
        key: 'user',
        data: user,
      })
      that.setData({ user })
    }, err => {
      console.log(err);
      // 登录失败
    })
  },

  markerTap: function (event) {
    let that = this
    
    if (!(that.data.current_story === undefined)) {
      if (event.markerId === that.data.current_story.id) {
      let markers = that.data.markers
      let index = that.data.walkStories.findIndex(story => story.id === that.data.current_story.id)
      markers[index].width = 40
      markers[index].height = 40
      that.setData({markers})
      let current_story = false
      that.setData({ current_story })
    } else {
      that.setMarkers(that.data.walkStories)
      let current_story = that.data.walkStories.find(story => story.id === event.markerId);
      that.setData({ current_story })

      let markers = that.data.markers
      let index = that.data.walkStories.findIndex(story => story.id === event.markerId);
      markers[index].width = 60
      markers[index].height = 60
      that.setData({ markers })
    }
    } else {
      that.setMarkers(that.data.walkStories)
      let current_story = that.data.walkStories.find(story => story.id === event.markerId);
      that.setData({ current_story })

      let markers = that.data.markers
      let index = that.data.walkStories.findIndex(story => story.id === event.markerId);
      markers[index].width = 60
      markers[index].height = 60
      that.setData({ markers })
    }
  },

  mapTap: function (event) {
    let that = this
    let markers = that.data.markers
    let index = that.data.walkStories.findIndex(story => story.id === that.data.current_story.id);
    markers[index].width = 40
    markers[index].height = 40
    that.setData({ markers })

    let current_story = false
    that.setData({ current_story })

  },

  openLocation: function () {
    let that = this
    let startStory = that.data.walkStories[0]
    let latitude = startStory.latitude
    let longitude = startStory.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this
    let walkId = options.id // Setting walkId from Page properties
    that.setWalk(walkId) // setting Walk object by search with Walk ID in local page data
    let user = wx.getStorageSync('user')
    that.setPolyline(walkId)
    if (user) {
      that.setData({ user })  // Saving User object to local page data
      that.setUserWalk(walkId, user.id) // Setting UserWalk to local page data 
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