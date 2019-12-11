//app.js
App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('3906a5fa391292059abe', { autoLogin: false })
  },

  
  globalData: {
    userInfo: null
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
})