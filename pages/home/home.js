// pages/home/home.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * Page initial data
   */
  data: {
    storiesWithDistance: [],
    items: undefined,
    current_story: false,
    current: 0,
    currentMap: 0,
    scale: 16,
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [],
    subkey: undefined,
    polyline: [{
      points: [],
      color: "#0091ff",
      width: 6
    }]
  },

  navigateToShow(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  navigateToPost() {
    wx.navigateTo({
      url: `/pages/post/post`
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

  setApple: function () {
    let tableName = 'apple'
    let recordID = '5df70bc6d69d0e122d89a3f0'

    let Product = new wx.BaaS.TableObject(tableName)

    Product.get(recordID).then(res => {
      console.log("this is controller", res)
      this.setData({
        "apple": res.data.controller
      })
      this.setItems()
      // success
    }, err => {
      // err
    })
  },

  setItems: function () {
    if (this.data.apple) {
      let items = [
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
               label: '建筑',
               value: '建筑',
               checked: true,
             },
             {
               label: '游览',
               value: '游览',
               checked: true,
             },
             {
               label: '历史',
               value: '历史',
               checked: true,
             },
             {
               label: '感想',
               value: '感想',
               checked: true,
             },
             {
               label: '故事',
               value: '故事',
               checked: true,
             },
             {
               label: '摄影',
               value: '摄影',
               checked: true,
             },
             ],
           },
         ],
         groups: ['001', '002', '003'],
       },
     ]
     this.setData({items})
  } else {
     let items = [
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
         type: 'filter',
         label: '筛选',
         value: 'filter',
         checked: true,
         children: [
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
               label: '建筑',
               value: '建筑',
               checked: true,
             },
             {
               label: '艺术',
               value: '艺术',
               checked: true,
             },
             {
               label: '风景',
               value: '风景',
               checked: true,
             },
             {
               label: '文学',
               value: '文学',
               checked: true,
             },
             {
               label: '音乐',
               value: '音乐',
               checked: true,
             },
             {
               label: '摄影',
               value: '摄影',
               checked: true,
             },
             ],
           },
         ],
         groups: ['001', '002'],
       },
     ]
      this.setData({ items })
  }
  console.log("items", this.data.items)
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
     

      // this.setRoute(['5dfa30a3d69d0e2f684527e0', '5dfa323fd69d0e084b899dfb', '5dfa22f4ea947d41e9068083', '5dfa35d0d69d0e5fe0453b21', '5def30c710897c591a33d']) // Calculating Routes
    })
  },

  savePolylineToBackend: function() {
    let that = this
    let polyline = that.data.polyline
    let polylineLatitudeArr = polyline[0].points.map(point => {return point.latitude}) // !!! SWITCH (1)
    // let polylineLatitudeArr = [] // !!! SWITCH (2)
    console.log('polylineLatitudeArr ------>', polylineLatitudeArr)
    let polylineLongitudeArr = polyline[0].points.map(point => { return point.longitude }) // !!! SWITCH (1)
    // let polylineLongitudeArr = [] // !!! SWITCH (2)
    console.log('polylineLongitudeArr ------>', polylineLongitudeArr)
    console.log('typeof polylineLongitudeArrayElement ------->', typeof(polylineLongitudeArr[5]))

    let Walk = new wx.BaaS.TableObject('walk')
    let dbWalk = Walk.getWithoutData('5dfa2f46ea947d41a9067cfc') // CAREFUL!!! TO BE CHANGED MANUALLY

    dbWalk.set("polyline_latitude", polylineLatitudeArr)
    dbWalk.set("polyline_longitude", polylineLongitudeArr)
    dbWalk.update().then(res => {
      console.log('result of polyline DB Save ---------->', res)
    }, err => {
    })
  },


  jumpToCurrentLocation: function() {
    this.mapCtx.moveToLocation()
    // let scale = 16
    // this.setData({scale: scale})
    // this.savePolylineToBackend()
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
        // get stories for recommendation
        if (!(that.data.topTags === undefined)) {
          let filteredByTopTags = storiesWithDistance.filter(function (item) {
            if (item.tags === undefined) {
              return false
            } else {
            return (that.data.topTags.some(t => item.tags.indexOf(t) !== -1))
            }
          })
          console.log("filteredByTopTags ---->", filteredByTopTags)
          let filteredByProximity = filteredByTopTags.filter(function (item) {
            return (item.distance < 20000)
          })
          console.log("filteredByProximity ---->", filteredByProximity)
          let filteredForRecommendation = filteredByProximity.filter(function (item) {
            return (item.people_liked > 5)
          })
          console.log("filteredForRecommendation pre sort---->", filteredForRecommendation)
          filteredForRecommendation.sort((a, b) => b.people_liked - a.people_liked)
          console.log("filteredForRecommendation post sort---->", filteredForRecommendation)
          that.setData({ filteredForRecommendation: filteredForRecommendation })
        }
        // get stories for default recommendation
        let defaultByProximity = storiesWithDistance.filter(function (item) {
          return true
          // return (item.distance < 10000)
        })

        let defaultRecommendation = defaultByProximity.filter(function (item) {
          return (item.people_liked > 5)
        })
        defaultRecommendation.sort((a, b) => b.people_liked - a.people_liked)
        that.setData({defaultRecommendation: defaultRecommendation})
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
        { name: '建筑', occurrence: this.getOccurrence(userTagsArray, "建筑") },
        { name: '游览', occurrence: this.getOccurrence(userTagsArray, "游览") },
        { name: '历史', occurrence: this.getOccurrence(userTagsArray, "历史") },
        { name: '感想', occurrence: this.getOccurrence(userTagsArray, "感想") },
        { name: '故事', occurrence: this.getOccurrence(userTagsArray, "故事") },
        { name: '摄影', occurrence: this.getOccurrence(userTagsArray, "摄影") },
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
        let topTags = userPrefs.slice(0, 1).map((item) => item.name)
        this.setData({ topTags: topTags })
      } else {
        let topTags = undefined
        this.setData({ topTags: topTags })
      }
      this.setStories() // added here to avoid asynchronous errors
    })
  },

  getOccurrence: function (array, value) {
    let filteredArray = array.filter(function (item) {
      return item === value
    })
    return filteredArray.length
  },

  setRouteSnippet: function(startStory, endStory) {
    let that = this
    qqmapsdk.direction({
      mode: 'walking',
      from: { latitude: startStory.latitude, longitude: startStory.longitude},
      to: { latitude: endStory.latitude, longitude: endStory.longitude},
      success: function (res) {
        console.log('DIRECTION ------->', res)
        let ret = res;
        let coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        let polylinePoints = that.data.polyline[0].points
        if (polylinePoints === undefined) {
          polylinePoints = pl
        } else {
          polylinePoints = polylinePoints.concat(pl)
        }
        that.setData({
          polyline: [{
            points: polylinePoints,
            color: "#0091ff",
            width: 6
          }]
        })
      },
      fail: function(error) {
        console.error(error)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },

  setRoute(storiesIdArray) {
    let that = this
    for (let i = 0; i < (storiesIdArray.length - 1); i += 1) {
      let startStoryId = storiesIdArray[i]
      let endStoryId = storiesIdArray[i + 1]
      let stories = that.data.stories
      console.log('storiesArray ----->', storiesIdArray[i + 1])
      let startStory = stories.find(story => story.id === startStoryId)
      let endStory = stories.find(story => story.id === endStoryId)
      that.setRouteSnippet(startStory, endStory)
    }
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'SI4BZ-ELA6U-Z3DVD-4TDCV-UHXHV-P7B4Z'
    });
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
      this.setData({ flag: true })
    } else {
      this.setStories()
    }
    this.setApple()
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

  // 遮罩层显示
  show: function () {
    this.setData({ flag: false })
  },
  // 遮罩层隐藏
  conceal: function () {
    this.setData({ flag: true })
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

  onChangeMap(e){
    let currentMap = e.detail.key
    this.setData({currentMap})
    this.setSubkey(currentMap)
  },

  setSubkey: function (currentMap) {
    if (currentMap === 0) {
      let subkey = "SI4BZ-ELA6U-Z3DVD-4TDCV-UHXHV-P7B4Z"
      this.setData({subkey})
    } else {
      let subkey = "BOABZ-NEO6W-NRXR3-RZ4NV-Q42R7-VQF4F"
      this.setData({ subkey })
    }
  },

  onChange(e) {
    console.log('event', e)
    if (e.currentTarget.id === "segmented-control"){
    // this.setStories()
    this.setData({
      current: e.detail.key,
      current_story: false 
    })
    } else if(this.data.apple){
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
    let filteredByTags = filteredByDistance.filter(function(item) { // check if there is any overlap in the two arrays (chosen filter and story tags)
      console.log(item.tags)
      if (item.tags === undefined) {
        return false
      } else {
        return filter.some(f => item.tags.indexOf(f) !== -1)
      }
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
    } else {
      let distanceChoice = Number.parseInt(e.detail.checkedValues[2][0])
      let filter = e.detail.checkedValues[2][1]
      let distanceSorter = e.detail.checkedValues[0]
      let likesSorter = e.detail.checkedValues[1]
      this.setData({ filter })
      console.log("distanceSorter", distanceSorter)
      console.log("likesSorter", likesSorter)
      console.log("distanceChoice ---->", distanceChoice)
      console.log("filter ---->", filter)
      let storiesWithDistance = this.data.storiesWithDistance
      let filteredByDistance = storiesWithDistance.filter(function (item) {
        return item.distance < distanceChoice
      });
      let filteredByTags = filteredByDistance.filter(function (item) {
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
      } else if (likesSorter === (1 || -1)) {
        if (likesSorter === -1) {
          filteredByTags.sort((a, b) => a.people_liked - b.people_liked)
        } else {
          filteredByTags.sort((a, b) => b.people_liked - a.people_liked)
        }
      } else {
        filteredByTags.sort((a, b) => a.distance - b.distance)
      }
      this.setDisplayDistance(filteredByTags)
      this.setData({ filteredByTags: filteredByTags })
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