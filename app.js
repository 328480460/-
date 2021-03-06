//app.js
App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || [];
        wx.setStorageSync('logs', logs);
        console.log('onlaunch')
    },
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    getSystemInfo: function(cb) {
        var that = this;
        if (this.globalData.systemInfo) {
            typeof cb == "function" && cb(this.globalData.systemInfo)
        } else {
            wx.getSystemInfo({
                success: function(res) {
                    that.globalData.systemInfo = res;
                    typeof cb == "function" && cb(that.globalData.systemInfo)
                }
            })
        }
    },
    globalData: {
        userInfo: null,
        homeType: 0,
        systemInfo: null
    },
    
})
