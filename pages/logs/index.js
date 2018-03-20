// pages/leftSwiperDel/index.js
Page({
    data: {
        list: []
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.tempData();
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    //测试临时数据
    tempData: function() {
        var logs = wx.getStorageSync('logs');
        console.log(logs);
        this.setData({
            list: logs
        });
    },
    

})
