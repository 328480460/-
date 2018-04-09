Page({
  onLoad: function () {
    var that = this;
    setTimeout(() => {
      wx.scanCode({
        success: (res) => {
          // console.log(res)
          // 二维码
          if (res.scanType === 'QR_CODE') {
            var url = '../code/code?code=' + that.getCorrectCode(res.result) + '&scanType=' + res.scanType
            wx.redirectTo({
              url: url
            })
            return
          }
          // 一维码
          var url = '../chooseLocation/chooseLocation?code=' + res.result + '&scanType=' + res.scanType
          wx.redirectTo({
            url: url
          })

        }
      })
    }, 300)
  },
  getCorrectCode(code) {
    if (/t.bjfxr.com/.test(code)) {
      return code.split('com/')[1]
    }
    return code
  }

})