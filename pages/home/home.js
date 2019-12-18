// pages/home/home.js
import Poster from '../../miniprogram_npm/wxa-plugin-canvas/poster/poster';

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

var app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    //Map data
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
    // Quotes data
    moto: []
  },

  user: {
    id: undefined
  },

  posterConfig: {
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
    texts: [{}, ],
    images: [{
      width: 750,
      height: 1624,
      x: 0,
      y: 0,
      url:
        'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifIFkVh2efgacEF.png'
    },
      {
        width: 700,
        height: 525,
        x: 25,
        y: 350,
        url: 'https://source.unsplash.com/collection/1771834/175x131.25'
      },
      {
        width: 200,
        height: 200,
        x: 525,
        y: 40,
        url: 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifh3hlco9fcu01w.PNG'
        //邮票二维码
      }]
  },

  setStory(id) {
    console.log(id)
    let Story = new wx.BaaS.TableObject('story')
    Story.get(id.toString()).then(res => {
      let story = res.data;
      story = this.setDisplayDate(story)
      // story = this.setDisplayDate(story)
      this.setData({
        story
      })

    }, err => {})
  },

  // const storyId = options.id // Setting storyId from Page properties
  //   this.setStory(storyId) // setting Story object by search with Story ID in local page data


  //   console.log(this.data)
  //   wx.BaaS.auth.getCurrentUser().then(user => { // Getting current_user information
  //   this.setData({ user })  // Saving User object to local page data
  //   this.getUserStory(storyId, user.id)

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
    this.setData({
      current_story
    })

    let markers = this.data.markers
    let index = this.data.stories.findIndex(story => story.id == event.markerId);
    markers[index].width = 60
    markers[index].height = 60
    this.setData({
      markers
    })

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
    this.setData({
      markers
    })

    let current_story = false
    this.setData({
      current_story
    })

  },

  setMarkers: function(stories) {
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
    this.setData({
      markers
    })
  },

  setApple: function() {
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

  setItems: function() {
    if (this.data.apple) {
      let items = [{
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
          children: [{
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
          groups: ['001', '002', '003'],
        },
      ]
      this.setData({
        items
      })
    } else {
      let items = [{
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
          children: [{
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
      this.setData({
        items
      })
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
      this.setData({
        stories
      })
      this.setMarkers(res.data.objects)
      this.setData({
        stories
      })
      this.getStoriesWithDistance(stories) // for dealing with distances
    })
  },

  jumpToCurrentLocation: function() {
    this.mapCtx.moveToLocation()
    let scale = 16
    this.setData({
      scale: scale
    })
  },

  zoomIn: function() {
    if ((this.data.scale) === 18) {

    } else {
      let scale = this.data.scale
      scale += 1
      this.setData({
        scale
      })
    }
  },

  zoomOut: function() {
    if ((this.data.scale) === 3) {

    } else {
      let scale = this.data.scale
      scale -= 1
      this.setData({
        scale
      })
    }
  },

  getStoriesWithDistance: function(stories) {
    const that = this
    let storiesWithDistance = that.data.stories
    let locationArray = stories.map(story => {
      return {
        latitude: story.latitude,
        longitude: story.longitude
      }
    })

    qqmapsdk.calculateDistance({
      mode: 'walking', //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: {
        latitude: that.data.latitude,
        longitude: that.data.longitude
      }, //若起点有数据则采用起点坐标，若为空默认当前地址
      to: locationArray, //终点坐标
      success: function(res) { //成功后的回调
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
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
        console.log('stories ---->', stories)
        storiesWithDistance.forEach((storyWithDistance, index) => {
          storyWithDistance['distance'] = res.result.elements[index].distance
        })
        storiesWithDistance.sort((a, b) => a.distance - b.distance)
        that.setDisplayDistance(storiesWithDistance)
        that.setData({
          storiesWithDistance: storiesWithDistance
        })
        // get stories for recommendation
        let filteredByTopTags = storiesWithDistance.filter(function(item) {
          if (item.tags === undefined) {
            return false
          } else {
            return (that.data.topTags.some(t => item.tags.indexOf(t) !== -1))
          }
        })
        console.log("filteredByTopTags ---->", filteredByTopTags)
        let filteredByProximity = filteredByTopTags.filter(function(item) {
          return (item.distance < 20000)
        })
        console.log("filteredByProximity ---->", filteredByProximity)
        let filteredForRecommendation = filteredByProximity.filter(function(item) {
          return (item.people_liked > 5)
        })
        console.log("filteredForRecommendation pre sort---->", filteredForRecommendation)
        filteredForRecommendation.sort((a, b) => b.people_liked - a.people_liked)
        console.log("filteredForRecommendation post sort---->", filteredForRecommendation)
        that.setData({
          filteredForRecommendation: filteredForRecommendation
        })

        // get stories for default recommendation
        let defaultByProximity = storiesWithDistance.filter(function(item) {
          return (item.distance < 10000)
        })

        let defaultRecommendation = defaultByProximity.filter(function(item) {
          return (item.people_liked > 5)
        })
        defaultRecommendation.sort((a, b) => b.people_liked - a.people_liked)
        that.setData({
          defaultRecommendation: defaultRecommendation
        })
      }
    })
  },

  setDisplayDistance: function(stories) {
    stories.forEach((story) => {
      let distance = story.distance
      if (distance < 1000) {
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

  getUserPreferences: function(userId) {
    let query = new wx.BaaS.Query()
    let UserStory = new wx.BaaS.TableObject('user_story')
    query.compare('user', '=', userId)
    query.compare('visible', '=', true)
    UserStory.setQuery(query).expand(['story']).find().then(res => {
      let userTagsArray = [] // (1) creating a huge array for all tags of user, weighted double for saved stories
      let specUserStories = res.data.objects;
      let filteredSpecUserStories = specUserStories.filter(function(item) {
        return ((item.saved === true) || (item.liked === true))
      })

      let specStories = filteredSpecUserStories.map(filteredSpecUserStory => filteredSpecUserStory.story)
      specStories.forEach((specStory) => {
        userTagsArray = userTagsArray.concat(specStory.tags)
      })
      console.log('specStories ------>', specStories)
      console.log('userTagsArray ----->', userTagsArray)

      let userPrefs = [ // (2) counting occurrence of tags within storiesSaved array
        {
          name: '建筑',
          occurrence: this.getOccurrence(userTagsArray, "建筑")
        },
        {
          name: '艺术',
          occurrence: this.getOccurrence(userTagsArray, "艺术")
        },
        {
          name: '风景',
          occurrence: this.getOccurrence(userTagsArray, "风景")
        },
        {
          name: '文学',
          occurrence: this.getOccurrence(userTagsArray, "文学")
        },
        {
          name: '音乐',
          occurrence: this.getOccurrence(userTagsArray, "音乐")
        },
        {
          name: '摄影',
          occurrence: this.getOccurrence(userTagsArray, "摄影")
        },
      ]

      userPrefs.sort(function(a, b) {
        return b.occurrence - a.occurrence
      })
      console.log("userPrefs ---->", userPrefs)

      if (userPrefs[2].occurrence > 0) {
        let topTags = userPrefs.slice(0, 3).map((item) => item.name)
        this.setData({
          topTags: topTags
        })
      } else if (userPrefs[1].occurrence > 0) {
        let topTags = userPrefs.slice(0, 2).map((item) => item.name)
        this.setData({
          topTags: topTags
        })
      } else if (userPrefs[0].occurrence > 0) {
        let topTags = userPrefs.slice(0, 1).map((item) => item.name)
        this.setData({
          topTags: topTags
        })
      } else {
        let topTags = undefined
        this.setData({
          topTags: topTags
        })
      }
      this.setStories() // added here to avoid asynchronous errors
    })
  },

  getOccurrence: function(array, value) {
    let filteredArray = array.filter(function(item) {
      return item === value
    })
    return filteredArray.length
  },

  getRoute: function() {
    let that = this
    qqmapsdk.direction({
      mode: 'walking',
      from: {
        latitude: 22.522807,
        longitude: 113.935338
      },
      to: {
        latitude: 22.528342,
        longitude: 113.94541
      },
      success: function(res) {
        console.log('DIRECTION ------->', res)
        let ret = res;
        let coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        console.log(pl)
        that.setData({
          polyline: [{
            points: pl,
            color: "#0091ff",
            width: 6
          }]
        })
      },
      fail: function(error) {
        console.error(error)
      },
      complete: function(res) {
        console.log(res)
      }
    })
  },

  show: function() {
    this.setData({
      flag: false
    })
  },

  // 遮罩层隐藏
  conceal: function() {
    this.setData({
      flag: true
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: '2RTBZ-TCOW4-O2VUZ-X2QBG-BEV5V-3TBVX'
    });
    this.mapCtx = wx.createMapContext('myMap')
    const that = this
    wx.getLocation({
      type: 'wgs84', // **1
      success: function(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          latitude,
          longitude
        })
      }
    })
    this.getRoute()
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
    this.setApple()
  },

  getdata: function() {
    var that = this;
    wx.request({
      url: 'https://v1.hitokoto.cn/',
      method: 'GET',
      dataType: 'json',

      success: function(res) {
        that.setData({
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
            // {
            //   x: 25,
            //   y: 325,
            //   text: 'this.data.story.title',
            //   fontFamily: 'STFangsong',
            //   fontSize: 40,
            //   color: '#484E5C',
            //   width: 600,
            //   marginLeft: 50,
            //   marginRight: 50
            // },
            {
              x: 25,
              y: 1100,
              text: res.data.hitokoto,
              //随机生成语料库
              fontFamily: 'STFangsong',
              fontSize: 50,
              color: '#484E5C',
              opacity: 0.85,
              // textAlign: 'center',
              lineHeight: 80,
              lineNum: 13,
              width: 600,
              fontStyle: 'italic',
            },
            {
              x: 25,
              y: 1000,
              text: res.data.from + ' :',
              fontFamily: 'STFangsong',
              fontSize: 40,
              color: '#484E5C',
              marginLeft: 50,
              marginRight: 50,
              lineNum: 3,
              width: 675
            },
            {
              x: 355,
              y: 1570,
              text: 'From: 城事Official Account',
              fontFamily: 'STFangsong',
              fontSize: 30,
              color: '#484E5C'
            },
            ],
            images: [{
              width: 750,
              height: 1624,
              x: 0,
              y: 0,
              url:
  'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifIFkVh2efgacEF.png'
},
            {
              width: 700,
              height: 525,
              x: 25,
              y: 350,
              url: 
              // 'https://cloud-minapp-32027.cloud.ifanrusercontent.com/1ifGHSfOd8uiHaZG.JPG'
              'https://source.unsplash.com/collection/1771834/175x131.25'
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
        })

      console.log(res)
      },
      fail: function(err) {
        console.log(err)
      }, //请求失败
      complete: function() {
        console.log(123)
      } //请求完成后执行的函数
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function(e) {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    let user = wx.getStorageSync('user')
    if (user) {
      this.setData({
        user
      })
      this.getUserPreferences(user.id)
    }
    this.setItems()

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
  show: function() {
    this.setData({
      flag: false
    })
  },

  // 遮罩层隐藏
  conceal: function() {
    this.setData({
      flag: true
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {
    return {
      title: '城事CityTales',
      path: 'pages/home/home',
      imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576076902204&di=3976f55fd2511190201063cb611dbfc1&imgtype=0&src=http%3A%2F%2Fpic5.997788.com%2Fpic_search%2F00%2F16%2F10%2F15%2Fse16101588a.jpg'
    }
  },

  //Create Poster Function
  onCreatePoster() {
    console.log(e)

  },
  onPosterSuccess(e) {
    let {
      detail
    } = e
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },

  onPosterFail(e) {
    console.log(e)
  },

  setConfig() {
    this.getdata();
  },

  onChangeMap(e) {
    let currentMap = e.detail.key
    this.setData({
      currentMap
    })
    this.setSubkey(currentMap)
  },

  setSubkey: function(currentMap) {
    if (currentMap === 0) {
      let subkey = "SI4BZ-ELA6U-Z3DVD-4TDCV-UHXHV-P7B4Z"
      this.setData({
        subkey
      })
    } else {
      let subkey = "BOABZ-NEO6W-NRXR3-RZ4NV-Q42R7-VQF4F"
      this.setData({
        subkey
      })
    }
  },

  onChange(e) {
    console.log('event', e)
    if (e.currentTarget.id === "segmented-control") {
      // this.setStories()
      this.setData({
        current: e.detail.key,
      })
    } else if (this.data.apple) {
      let distanceChoice = Number.parseInt(e.detail.checkedValues[3][0])
      let filter = e.detail.checkedValues[3][1]
      let distanceSorter = e.detail.checkedValues[0]
      let likesSorter = e.detail.checkedValues[1]
      let commentsSorter = e.detail.checkedValues[2]
      this.setData({
        filter
      })
      console.log("distanceSorter", distanceSorter)
      console.log("likesSorter", likesSorter)
      console.log("commentsSorter", commentsSorter)
      console.log("distanceChoice ---->", distanceChoice)
      console.log("filter ---->", filter)
      let storiesWithDistance = this.data.storiesWithDistance
      let filteredByDistance = storiesWithDistance.filter(function(item) {
        return item.distance < distanceChoice
      });
      let filteredByTags = filteredByDistance.filter(function(item) { // check if there is any overlap in the two arrays (chosen filter and story tags)
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
      } else if (commentsSorter === (1 || -1)) {
        if (commentsSorter === -1) {
          filteredByTags.sort((a, b) => a.people_commented - b.people_commented)
        } else {
          filteredByTags.sort((a, b) => b.people_commented - a.people_commented)
        }
      } else {
        filteredByTags.sort((a, b) => a.distance - b.distance)
      }
      this.setDisplayDistance(filteredByTags)
      this.setData({
        filteredByTags: filteredByTags
      })
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
      this.setData({
        filter
      })
      console.log("distanceSorter", distanceSorter)
      console.log("likesSorter", likesSorter)
      console.log("distanceChoice ---->", distanceChoice)
      console.log("filter ---->", filter)
      let storiesWithDistance = this.data.storiesWithDistance
      let filteredByDistance = storiesWithDistance.filter(function(item) {
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
      this.setData({
        filteredByTags: filteredByTags
      })
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