//index.js

var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js'); //腾讯地图组件
var utils = require('../../utils/util.js');

var app = getApp();
const global = app.globalData;
Page({
  data: {
    userInfo: null,
    location: {
      latitude: 0,
      longitude: 0,
      address: '',
      city: ''
    },
    node: {
      name: '',
      id: '',
      address: ''
    },
    chooseSuppliers: [],
    hiddenLoading: true,
    dialog: {
      title: '',
      content: '',
      hidden: true
    },
    homeType: 0,
    locatFlag: false,
  },
  onLoad: function (e) {
    console.log(e);
    var that = this
    this.getGlobalData(); // 获取全局变量

    that.getLocation();

  },
  getGlobalData() { //获取全局变量
    let that = this;
    //调用应用实例的方法获取全局数据 个人信息
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
      // console.log(userInfo);
    })

    this.setData({
      'homeType': app.homeType
    })
  },
  getLocation() { //获取定位
    // console.log('getLocation')
    var that = this;
    setTimeout(function () {
      that.setData({
        hiddenLoading: true
      })
    }, 1000);

    wx.getLocation({ //定位获取地理坐标
      type: 'gcj02',
      success: function (res) {
        // console.log(res);
        var latitude = res.latitude //x
        var longitude = res.longitude //y
        that.setData({
          'location.latitude': latitude
        });
        that.setData({
          'location.longitude': longitude
        })

        that.reverseGeocoder(latitude, longitude); //点击切换商家链接
      },
      fail: function (res) {
        // console.log(res);
        that.setData({
          'node.address': '无法获取商家位置'
        })

        that.setData({
          'location.city': '北京市'
        })

        // console.log(that.data.location.city)
        that.setData({
          'locatFlag': false
        })
      },
      complete: function (res) {
        // console.log('111');
      }
    })
  },
  reverseGeocoder(latitude, longitude) { //根据坐标转换具体地址
    // console.log('reverseGeocoder');
    var that = this;
    // 实例划API核心类
    var demo = new QQMapWX({
      key: 'BQOBZ-FIUCJ-QQFF4-KS546-W2BR3-UKFE4' // 腾讯地图key值
    });
    // 调用接口
    demo.reverseGeocoder({
      location: {
        latitude: latitude, //x
        longitude: longitude //y
      },
      success: function (res) {
        // console.log(res.result)
        that.setData({
          'node.address': res.result.address
        })

        that.setData({
          'location.city': res.result.address_component.city
        })
      },
      fail: function (res) {
        console.log('根据坐标转换具体地址失败');
      }
    });
  },
  searchInBounds: function (longitude, latitude, nodeId) { //查询附近商家接口
    var url = 'https://www.bjfxr.com/analyse/tracingchain/distance';
    var that = this;
    var params = !!nodeId ? { 'x_coordinate': latitude, 'y_coordinate': longitude, 'node_id': nodeId } : { 'x_coordinate': latitude, 'y_coordinate': longitude };
    wx.request({
      url: url,
      data: params,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //添加选择商家缓存
        wx.setStorageSync("chooseSuppliers", res.data[0].data);

        // setTimeout(function () {
        //   that.setData({
        //     loadingHidden: true
        //   })
        // }, 1500)
        // console.log(res)

        that.setData({
          'chooseSuppliers': res.data[0].data
        })

        that.setData({
          'node.id': res.data[0].data[0].node_id
        })

        that.setData({
          'node.name': res.data[0].data[0].node_name
        })

        that.setData({
          'node.address': res.data[0].data[0].addr
        })


        // console.log("查询切换商家接口成功");
      },
      fail: function (res) {
        wx.removeStorage({
          key: 'chooseSuppliers',
          success: function (res) {
            console.log('清除缓存chooseSuppliers');
          }
        })
        console.log("查询切换商家接口失败");
      }
    })
  },
  bindViewCode: function () { //扫码查询
    var that = this;
    that.setData({
      'locatFlag': true
    })
    if (this.data.location.city == '北京市') {
      wx.scanCode({
        success: function (res) {
          // 二维码
          console.log(res.result)
          if (res.scanType === 'QR_CODE') {
            var url = '../code/code?code=' + that.getCorrectCode(res.result) + '&scanType=' + res.scanType
            wx.navigateTo({
              url: url
            })
            return
          } else {
            wx.navigateTo({
              url: '../chooseLocation/chooseLocation?code=' + res.result
            })
          }
        },
        fail: function (res) {
          console.info(res);
        }
      })
    }
  },
  judgeCity() {
    var that = this;
    that.setData({
      'locatFlag': true
    })
    if (this.data.location.city !== '北京市') {
      that.showModal('小程序目前只支持查询北京市范围内的追溯企业')
    }
  },
  showModal: function (content) { //弹窗显示
    this.setData({
      'dialog.hidden': false,
      'dialog.title': '温馨提示',
      'dialog.content': content
    })
  },

  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
    var that = this;
    wx.openSetting({
      success: (res) => {
        // console.log(res.authSetting["scope.userLocation"])
        if (res.authSetting["scope.userLocation"]) {
          that.getLocation();
        }
      }
    })

  },

  onShareAppMessage: function () {
    return {
      title: '北京E追溯',
      desc: '肉菜',
      path: 'pages/index/index'
    }
  },
  bindChange(e) { //滑动切换
    var that = this;
    that.setData({ homeType: e.detail.current });
    that.changeGlobalHomeType(e.detail.current);
  },
  swichHome(e) { //点击切换
    var that = this;
    var cur = e.currentTarget.dataset.current;
    if (this.data.homeType === cur) {
      return false;
    } else {
      that.setData({
        homeType: cur
      })
      that.changeGlobalHomeType(cur);
    }
  },
  changeGlobalHomeType(cur) { //改变全局变量
    app.globalData.homeType = cur;
  },
  callPhone: function () { //打电话
    wx.makePhoneCall({
      phoneNumber: '010-64849651'
    })
  },
  getCorrectCode(code) {
    if (/t.bjfxr.com/.test(code)) {
      return code.split('com/')[1];
    }
    return code
  }

})
