// pages/home/home.js
Page({

  /**
   * Page initial data
   */
  data: {
    items: [
    // {
    //   type: 'sort',
    //   label: 'Likes',
    //   value: 'people_liked',
    //   groups: ['001'],
    // },
    // {
    //   type: 'sort',
    //   label: 'Comments',
    //   value: 'people_commented',
    //   groups: ['002'],
    // },
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
      // {
      //   type: 'radio',
      //   label: 'Location',
      //   value: 'location',
      //   children: [{
      //     label: '500m',
      //     value: '500',
      //   },
      //   {
      //     label: '1km',
      //     value: '1000',
      //   },
      //   {
      //     label: '2km',
      //     value: '2000',
      //   },
      //   {
      //     label: '5km',
      //     value: '5000',
      //   },
      //   {
      //     label: '10km',
      //     value: '10000',
      //   },
      //   {
      //     label: '100km',
      //     value: '100000',
      //   },
      //   {
      //     label: '全国',
      //     value: 'everywhere',
      //   },
      //   ],
      // },
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
        },
        {
          label: 'Literature',
          value: 'literature',
        },
        {
          label: 'Landscape',
          value: 'landscape',
        },
        {
          label: 'Music',
          value: 'music',
        },
        ],
      },
      ],
      groups: ['001', '002'],
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
    console.log("this is show id", id)
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  markerTap: function(event) {
    this.setMarkers(this.data.stories)

    console.log('marker id --------> ', event.markerId)
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
        iconPath: '/image/red_pin.png',
        width: 40,
        height: 40
      }
      });
    console.log('markersarray', markers)
    this.setData({markers})
  },

  setStories: function() {
    console.log("fetching stories....")
    let query = new wx.BaaS.Query()
    let Story = new wx.BaaS.TableObject('story')

    query.compare('created_at', '>', 0)
    query.compare('visible', '=', true)
    Story.setQuery(query).find().then(res => {
      console.log('stories.....', res.data.objects)
      let stories = res.data.objects
      this.setData({stories})
      this.setMarkers(res.data.objects)
      this.setData({stories})
    })
  },

  jumpToCurrentLocation: function() {
    this.mapCtx.moveToLocation()
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
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.BaaS.auth.getCurrentUser().then(user => {
      this.setData({ user })
    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
    this.setStories()
    this.mapCtx = wx.createMapContext('myMap')
    const that = this
    wx.getLocation({
      type: 'wgs84', // **1
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log('wgs84', latitude, longitude)
        that.setData({ latitude, longitude })
        console.log(latitude, longitude)
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
    let filter = e.detail.checkedValues[0][0]
    this.setData({ filter })
    console.log("filter ---->", filter)
    let query = new wx.BaaS.Query()
    query.in('tags', filter)
    let Product = new wx.BaaS.TableObject("story")
    Product.setQuery(query).find().then(res => {
      // success
      console.log('result --->',  res)
      let stories = res.data.objects
      this.setData({ stories })
    }, err => {
      // err
    })
    }
  }
})