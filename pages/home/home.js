// pages/home/home.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * Page initial data
   */
  data: {
    storiesWithDistance: [],
    items: [
    {
      type: 'sort',
      label: '距离',
      value: 'distance',
      groups: ['001'],
    },
    {
      type: 'sort',
      label: '喜欢',
      value: 'people_liked',
      groups: ['002'],
    },
    {
      type: 'sort',
      label: '评论',
      value: 'people_commented',
      groups: ['003'],
    },
    {
      type: 'filter',
      label: '筛选',
      value: 'filter',
      checked: true,
      children: [
      // {
      //   type: 'radio',
      //   label: 'TimePeriod',
      //   value: 'timeperiod',
      //   children: [{
      //     label: 'LastDay',
      //     value: 'lastday',
      //   },
      //   {
      //     label: 'LastThreeDays',
      //     value: 'lastthreedays',
      //   },
      //   {
      //     label: 'LastWeek',
      //     value: 'lastweek',
      //   },
      //   {
      //     label: 'LastMonth',
      //     value: 'lastmonth',
      //   },
      //   {
      //     label: 'LastYear',
      //     value: 'lastyear',
      //   },
      //   {
      //     label: 'AllTime',
      //     value: 'alltime',
      //   },
      //   ],
      // },
      {
        type: 'radio',
        label: '距离',
        value: '距离',
        children: [{
          label: '500米',
          value: '500',
        },
        {
          label: '1000米',
          value: '1000',
        },
        {
          label: '2000米',
          value: '2000',
        },
        {
          label: '5000米',
          value: '4999_999',
        },
        {
          label: '10公里',
          value: '9999_999',
        },
        {
          label: '100公里',
          value: '99999_998',
        },
        {
          label: '全国',
          value: '3000000000000',
          checked: true,
        },
        ],
      },
      {
        type: 'checkbox',
        label: 'Tags',
        value: 'tags',
        children: [{
          label: 'Architecture',
          value: 'architecture',
          checked: true,
        },
        {
          label: 'Art',
          value: 'art',
          checked: true,
        },
        {
          label: 'Landscape',
          value: 'landscape',
          checked: true,
        },
        {
          label: 'Literature',
          value: 'literature',
          checked: true,
        },
        {
          label: 'Music',
          value: 'music',
          checked: true,
        },
        {
          label: 'Photography',
          value: 'photography',
          checked: true,
        },
        ],
      },
      ],
      groups: ['001', '002', '003'],
    },
    ],
    current_story: false,
    current: 0,
    scale: 16,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: []
  },

  navigateToShow(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  markerTap: function(event) {
    this.setMarkers(this.data.stories)
    let current_story = this.data.stories.find(story => story.id == event.markerId);
    this.setData({ current_story })

    let markers = this.data.markers
    let index = this.data.stories.findIndex(story => story.id == event.markerId);
    markers[index].width = 60
    markers[index].height = 60
    this.setData({markers})

    // let latitude = markers[index].latitude
    // let longitude = markers[index].longitude
    // this.setData({latitude})
    // this.setData({longitude})
    // console.log('markertap', latitude, longitude)
    // this.mapCtx = wx.createMapContext('myMap')
    // this.mapCtx.moveToLocation()
    
    // wx.chooseLocation({
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
  },

  mapTap: function(event) {
    let markers = this.data.markers
    let index = this.data.stories.findIndex(story => story.id == this.data.current_story.id);
    markers[index].width = 40
    markers[index].height = 40
    this.setData({ markers })
    
    let current_story = false
    this.setData({ current_story })

  },

  setMarkers: function (stories) {
    let markers = stories.map(story => { 
      return {
        id: story.id,
        latitude: story.latitude,
        longitude: story.longitude,
        name: story.title,
        iconPath: 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifOM5c01ybmL4zj.png',
        width: 40,
        height: 40
      }
      });
    this.setData({markers})
  },

  setStories: function() {
    let query = new wx.BaaS.Query()
    let Story = new wx.BaaS.TableObject('story')

    query.compare('created_at', '>', 0)
    query.compare('visible', '=', true)
    Story.setQuery(query).find().then(res => {
      let stories = res.data.objects
      this.setData({stories})
      this.setMarkers(res.data.objects)
      this.setData({stories})
      this.getStoriesWithDistance(stories) // for dealing with distances
    })
  },

  jumpToCurrentLocation: function() {
    this.mapCtx.moveToLocation()
    let scale = 16
    this.setData({scale: scale})
  },
  
  zoomIn: function () {
    if ((this.data.scale) === 18) {

    }
    else {
      let scale = this.data.scale
      scale +=1
      this.setData({scale})
    }
  },

  zoomOut: function () {
    if ((this.data.scale) === 3) {

    }
    else {
      let scale = this.data.scale
      scale -= 1
      this.setData({ scale })
    }
  },

  getStoriesWithDistance: function(stories){
    const that = this
    let storiesWithDistance = that.data.stories
    let locationArray = stories.map(story => { return { latitude: story.latitude, longitude: story.longitude } })
    
    qqmapsdk.calculateDistance({
      mode: 'walking', //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: {latitude: that.data.latitude, longitude: that.data.longitude}, //若起点有数据则采用起点坐标，若为空默认当前地址
      to: locationArray, //终点坐标
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        that.setData({ //设置并更新distance数据
          distance: dis
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
        console.log('stories ---->', stories)
        storiesWithDistance.forEach((storyWithDistance, index) => { storyWithDistance['distance'] = res.result.elements[index].distance})
        storiesWithDistance.sort((a, b) => a.distance - b.distance)
        that.setDisplayDistance(storiesWithDistance)
        that.setData({storiesWithDistance: storiesWithDistance})
      }
    })
    
  },

  setDisplayDistance: function (stories) {
    stories.forEach((story) => {
      let distance = story.distance
      if (distance < 1000){
        story.display_distance = `${distance} m`
      } else if (distance < 10000) {
        story.display_distance = `${(Math.round(distance/100))/10} km`
      } else if (distance < 100000) {
        story.display_distance = `${(Math.round(distance / 1000))} km`
      } else {
        story.display_distance = '100 km+'
      }
    })
  },

  getUserPreferences: function (userId) {
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')
    query.compare('user', '=', userId)
    query.compare('visible', '=', true)
    UserStory.setQuery(query).expand(['story']).find().then(res => {
      let userTagsArray = [] // (1) creating a huge array for all tags of user, weighted double for saved stories
      let specUserStories = res.data.objects;
      let filteredSpecUserStories = specUserStories.filter(function (item) {
        return ((item.saved === true) || (item.liked === true))
      })

      let specStories = filteredSpecUserStories.map(filteredSpecUserStory => filteredSpecUserStory.story)
      specStories.forEach((specStory) => { userTagsArray = userTagsArray.concat(specStory.tags) })
      console.log('specStories ------>', specStories)
      console.log('userTagsArray ----->', userTagsArray)

      let userPrefs = [ // (2) counting occurrence of tags within storiesSaved array
        { name: 'architecture', occurrence: this.getOccurrence(userTagsArray, "architecture") },
        { name: 'art', occurrence: this.getOccurrence(userTagsArray, "art") },
        { name: 'landscape', occurrence: this.getOccurrence(userTagsArray, "landscape") },
        { name: 'literature', occurrence: this.getOccurrence(userTagsArray, "literature") },
        { name: 'music', occurrence: this.getOccurrence(userTagsArray, "music") },
        { name: 'photography', occurrence: this.getOccurrence(userTagsArray, "photography") },
      ] 
    
      userPrefs.sort(function (a, b) {
        return b.occurrence - a.occurrence
      })
      console.log("userPrefs ---->", userPrefs)

      if (userPrefs[2].occurrence > 0) {
        let topTags = userPrefs.slice(0, 3).map((item) => item.name)
        this.setData({topTags: topTags})
      } else if (userPrefs[1].occurrence > 0) {
        let topTags = userPrefs.slice(0, 2).map((item) => item.name)
        this.setData({ topTags: topTags })
      } else if (userPrefs[0].occurrence > 0) {
        let topTags = userPrefs[0].name
        this.setData({ topTags: topTags })
      } else {
        let topTags = undefined
        this.setData({ topTags: topTags })
      }
    })
  },

  getOccurrence: function (array, value) {
    let filteredArray = array.filter(function (item) {
      return item === value
    })
    return filteredArray.length
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '2RTBZ-TCOW4-O2VUZ-X2QBG-BEV5V-3TBVX'
    });
    this.mapCtx = wx.createMapContext('myMap')
    const that = this
    wx.getLocation({
      type: 'wgs84', // **1
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({ latitude, longitude })
        that.setStories()
      }
    })
    // wx.getLocation({
    //   type: 'gcj02', //Returns the latitude and longitude that can be used for wx.openLocation
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     console.log('gcj02', latitude, longitude)
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     })
    //   }
    // })
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
    let user = wx.getStorageSync('user')
    if (user) {
      this.setData({ user })
    this.getUserPreferences(user.id)
    }
    // this.setStories()
    // this.mapCtx = wx.createMapContext('myMap')
    // const that = this
    // wx.getLocation({
    //   type: 'wgs84', // **1
    //   success: function (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     that.setData({ latitude, longitude })
    //     console.log(latitude, longitude)
    //   }
    // })
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
    console.log('event', e)
    if (e.currentTarget.id === "segmented-control"){
    this.setStories()
    this.setData({
      current: e.detail.key,
    })
    } else {
    let distanceChoice = Number.parseInt(e.detail.checkedValues[3][0])
    let filter = e.detail.checkedValues[3][1]
    let distanceSorter = e.detail.checkedValues[0]
    let likesSorter = e.detail.checkedValues[1]
    let commentsSorter = e.detail.checkedValues[2]
    this.setData({ filter })
    console.log("distanceSorter", distanceSorter)
    console.log("likesSorter", likesSorter)
    console.log("commentsSorter", commentsSorter)
    console.log("distanceChoice ---->", distanceChoice)
    console.log("filter ---->", filter)
    let storiesWithDistance = this.data.storiesWithDistance
    let filteredByDistance = storiesWithDistance.filter(function (item) {
      return item.distance < distanceChoice
    });
    let filteredByTags = filteredByDistance.filter(function(item) {
      console.log(item.tags)
      return filter.some(f => item.tags.indexOf(f) !== -1)
    });
    console.log("filteredByDistance ---->", filteredByDistance)
    console.log("filteredByTags ---->", filteredByTags)
    
    
    if (distanceSorter === (1 || -1)) {
      if (distanceSorter === -1) {
        filteredByTags.sort((a, b) => a.distance - b.distance)
      } else {
        filteredByTags.sort((a, b) => b.distance - a.distance)
      }
    } else if (likesSorter === (1||-1)) {
      if (likesSorter === -1){
        filteredByTags.sort((a, b) => a.people_liked - b.people_liked)
      } else {
        filteredByTags.sort((a, b) => b.people_liked - a.people_liked)
      }
    } else if (commentsSorter === (1||-1)) {
      if (commentsSorter === -1) {
        filteredByTags.sort((a, b) => a.people_commented - b.people_commented)
      } else {
        filteredByTags.sort((a, b) => b.people_commented - a.people_commented)
      }
    } else {
      filteredByTags.sort((a, b) => a.distance - b.distance)
    }
    this.setDisplayDistance(filteredByTags)
    this.setData({filteredByTags: filteredByTags})
    // let query = new wx.BaaS.Query()
    // query.in('tags', filter)
    // let Product = new wx.BaaS.TableObject("story")
    // Product.setQuery(query).find().then(res => {
    //   // success
    //   console.log('result --->',  res)
    //   let filteredStories = res.data.objects
    //   this.setData({ filteredStories })
    // }, err => {
    //   // err
    // })
    }
  }
})