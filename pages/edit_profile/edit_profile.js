// pages/edit_profile/edit_profile.js
Page({

  /**
   * Page initial data
   */
  data: {
    user: {
    },
  },

  eventPackageSubmit: function (e) {
    let user = this.data.user
    wx.setStorage({
      key: 'user',
      data: user,
    })
    wx.BaaS.auth.getCurrentUser()
      .then(user => {
        // age 为自定义字段
        return user.set({
          "custom_nickname": this.data.user.custom_nickname,
          "custom_city": this.data.user.custom_city,
          "bio": this.data.user.bio
        }).update()
      }).then(user => {
        // success
        console.log("My upload package----->", user)
        wx.showToast({
          title: 'Edited',
          icon: 'success',
        })
        wx.reLaunch({
          url: '/pages/profile/profile',
        })
      }).catch(err => {
        // err 为 HError 对象
      })
  },

  onChangeName: function (e) {
    console.log(e)
    this.setData({
      "user.custom_nickname": e.detail.value
    })
  },

  onChangeCity: function (e) {
    console.log(e)
    this.setData({
      "user.custom_city": e.detail.value
    })
  },

  onChangeBio: function (e) {
    console.log(e)
    this.setData({
      "user.bio": e.detail.value
    })
  },

  fetchEventData: function () {
    let user = wx.getStorageSync('user')
    if (user) {
      this.setData({ user })
    }
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.fetchEventData()
  }

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  
})