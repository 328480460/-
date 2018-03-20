//logs.js
//
var app = getApp();
Page({
    data: {
        chooseSupplier: [],
        nearyChooses: [],
        nodeId: '',
        currentTab: 0,
        winHeight: 0,
        inputValue: '',
        hiddenLoading: false,
        searchLoading: true,
    },
    onLoad: function(e) {
        console.log('onload切换商家页面')
        this.searchInBounds(e);
        this.getData();

    },
    searchInBounds: function(e) {
        var that = this;
        this.setData({
            'nodeId': e.nodeId
        })

        this.clearInput();

        setTimeout(function() {
            that.setData({
                hiddenLoading: true
            })
        }, 1000)
    },
    getData: function() {
        let that = this;
        //调用应用实例的方法获取全局数据 系统信息
        app.getSystemInfo(function(systemInfo) {
            console.log(systemInfo)
            that.setData({
                winHeight: systemInfo.windowHeight
            })
        })
        var nearyChooses = wx.getStorageSync('nearyChooses') || [];

        that.setData({
            nearyChooses: nearyChooses
        })

    },
    funChooseSupplier: function(event) {
        var nodeId = event.currentTarget.dataset.nodeid,
            nodeName = event.currentTarget.dataset.nodename,
            addr = event.currentTarget.dataset.addr,
            url = '../index/index?nodeId=' + nodeId + '&nodeName=' + nodeName + '&nodeAddr=' + addr;
        var nearyChooses = wx.getStorageSync('nearyChooses') || [];
        for (var i = 0; i < nearyChooses.length; i++) {
            if (nodeId == nearyChooses[i].node_id) {
                nearyChooses.splice(i, 1);
            }
        }
        nearyChooses.unshift({ 'node_name': nodeName, 'node_id': nodeId, 'addr': addr })
        wx.setStorageSync('nearyChooses', nearyChooses);
        wx.redirectTo({
            url: url
        })
    },
    searchNearySuppliers: function(value) {
        var that = this;
        var url = 'https://www.bjfxr.com/analyse/tracingchain/nodebase?';
        that.setData({
            searchLoading: false
        })
        setTimeout(function() {
            that.setData({
                searchLoading: true
            })
        }, 1000)
        wx.request({
            url: url,
            data: { 'node_name': value },
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log('模糊查询成功')
                console.log(res.data[0].data);
                that.setData({
                    'currentTab': 0
                })
                that.setData({
                    'chooseSupplier': res.data[0].data
                })
            }
        })
    },
    bindSearch: function(e) {
        var inputValue = e.detail.value;
        this.searchNearySuppliers(inputValue);
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    swichNav: function(e) { //点击切换
        var that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    clearInput: function() { //原始数据
        var that = this;
        this.setData({
            inputValue: ''
        })
        wx.getStorage({
            key: 'chooseSuppliers',
            success: function(res) {
                console.log(res);
                that.setData({
                    'chooseSupplier': res.data
                })
            }
        })
    }
})
