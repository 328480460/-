//index.js
var app = getApp()
Page({
    data: {

    },
    onLoad: function(e) {

    },
    callPhone: function() { //打电话
        wx.makePhoneCall({
            phoneNumber: '010-64849651'
        })
    },
})
