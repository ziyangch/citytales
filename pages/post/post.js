Page({
  data: {
    story: {
      title: undefined,
      location: undefined,
      time: undefined,
      date: undefined,
      content: undefined,
      image: undefined,
      address: undefined,
      latitude: undefined,
      longitude: undefined,
      posted_date: undefined
    },
    dateNow: undefined,
    // items: [
    //   { name: '娱乐', value: '娱乐' },
    //   { name: '运动', value: '运动' },
    //   { name: '学习', value: '学习' },
    //   { name: '约饭', value: '约饭' },
    //   { name: '购物', value: '购物' },
    // ]
  },

  // checkboxChange: function (e) {
  //   this.setData({
  //     "event.tag": e.detail.value
  //   })
  //   console.log(this.data.event.tag)
  // },



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
    let formatDate = year + '-' + month + '-' + day;
    console.log(formatDate)
    this.setData({
      "dateNow": formatDate
    })
  },

  uploadImage: function () {
    let self = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: 'SDK' }

        MyFile.upload(fileParams, metaData).then(res => {
          console.log('MyFile Result ----->', res)
          let path = res.data.path
          self.setData({
            [`story.image`]: path
          })
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  // bindDateChange: function (e) {
  //   this.setData({
  //     "event.date": e.detail.value
  //   })
  // },

  // bindTimeChange: function (e) {
  //   this.setData({
  //     "event.time": e.detail.value
  //   })
  // },

  onChangeName: function (e) {
    console.log(e)
    this.setData({
      "story.title": e.detail.value,
    })
  },

  onChangeContent: function (e) {
    console.log(e)
    this.setData({
      "story.content": e.detail.value,
    })
  },

  eventStorySubmit: function (e) {
    let tableName = 'story'
    let Story = new wx.BaaS.TableObject(tableName)
    let story = Story.create()
    // let eventDate = new Date(this.data.event.date.concat(" ", this.data.event.time))
    // this.setData({
    //   "event.date": (eventDate.toISOString()).toString(),
    // })
    let newStory = {
      title: this.data.story.title,
      address: this.data.story.address,
      longitude: this.data.story.longitude,
      latitude: this.data.story.latitude,
      content: this.data.story.content,
      creator: this.data.user.id, 
      image: this.data.story.image,
      avatar: this.data.user.avatar,
      nickname:this.data.user.nickname,
      posted_date:this.data.dateNow
      // tag: this.data.event.tag
    }
    console.log('My event package ----->', newStory)

    story.set(newStory).save().then(res => {
      // success
      console.log("My upload package----->", res)
      wx.showToast({
        title: 'Posted',
        icon: 'success',
      })
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }, err => {
      //err 为 HError 对象
    })
  },


  getMapLocation: function () {
    let page = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        page.setData({
          "story.address": res.address,
          "story.latitude": res.latitude,
          "story.longitude": res.longitude
        })
      }
    })
  },

  onLoad: function (options) {
    let user = wx.getStorageSync('user')
    if (user) {
      this.setData({ user }) 
    }
  },

  onShow: function () {
    this.dateToday()
  }
})