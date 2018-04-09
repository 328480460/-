var app = getApp();
Page({
  data: {
    chooseSupplier: [],
    nearyChooses: [],
    nodeId: '',
    currentTab: 0,
    winHeight: 0,
    inputValue: '',
    key: '',
    hiddenLoading: false,
    searchLoading: true,
    code: '',
    currentShop: ''
  },
  onLoad: function (e) {
    this.searchInBounds(e);
    this.getLocation();
    this.getData();
    this.setData({
      code: e.code,
      changeFlag: e.changeFlag ?  true : false
    })

  },
  searchInBounds: function (e) {
    var that = this;
    this.setData({
      'nodeId': e.nodeId
    })
    this.clearInput();
  },
  getLocation() { //获取定位
    var that = this;
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
        that.searchData(latitude, longitude); //获取附近合作商家
      },
      fail: (res) => {
        console.log(res)
        wx.openSetting({
          success: (res) => {
            console.log(res);
            if (res.authSetting['scope.userLocation']) {
              this.getLocation()
            }
          }
        })
      }
    })
  },
  searchData: function (longitude, latitude, nodeId) { //查询附近商家接口
    var url = 'https://www.bjfxr.com/analyse/tracingchain/nodeDistanceByTrace';
    var that = this;
    var params = !!nodeId ? { 'x_coordinate': latitude, 'y_coordinate': longitude, 'node_id': nodeId, 'type': '', 'area_id': '' } : { 'x_coordinate': latitude, 'y_coordinate': longitude, 'type': '', 'area_id': '', 'page': 1 };
    wx.request({
      url: url,
      data: params,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data[0].data)
        that.setData({
          chooseSupplier: res.data[0].data,
          hiddenLoading: true,
          currentShop: res.data[0].data[0]
        })
      }
    })
  },
  getData: function () {
    let that = this;
    //调用应用实例的方法获取全局数据 系统信息
    app.getSystemInfo(function (systemInfo) {
      that.setData({
        winHeight: systemInfo.windowHeight
      })
    })
    var nearyChooses = wx.getStorageSync('nearyChooses') || [];
    that.setData({
      nearyChooses: nearyChooses
    })
  },
  funChooseSupplier: function (event) {
    var nodeId = event.currentTarget.dataset.nodeid,
      nodeName = event.currentTarget.dataset.nodename,
      addr = event.currentTarget.dataset.addr,
      distance = event.currentTarget.dataset.distance,
      goodsType = event.currentTarget.dataset.goodstype,
      subtype = event.currentTarget.dataset.subtype;
    var nearyChooses = wx.getStorageSync('nearyChooses') || [];
    for (var i = 0; i < nearyChooses.length; i++) {
      if (nodeId == nearyChooses[i].node_id) {
        nearyChooses.splice(i, 1);
      }
    }
    nearyChooses.unshift({ 'node_name': nodeName, 'node_id': nodeId, 'addr': addr, 'traceability_type': goodsType, 'node_type': subtype, 'distance': distance })
    wx.setStorageSync('nearyChooses', nearyChooses);

    this.changeCurrentShop({ 'node_name': nodeName, 'node_id': nodeId, 'addr': addr, 'traceability_type': goodsType, 'node_type': subtype, 'distance': distance })

    if (this.data.changeFlag) {
      wx.scanCode({
        success: (res) => {
          var url = '';
          if (res.scanType === 'QR_CODE') {
            url = '../code/code?code=' + res.result;
          } else {
            url = '../code/code?code=' + res.result + '&scanType=' + res.scanType + '&nodeId=' + nodeId + '&addr=' + addr + '&nodeName=' + nodeName;
          }

          wx.redirectTo({
            url: url
          })
        }
      })

      return
      
    }  

    var url = '../code/code?code=' + this.data.code + '&nodeId=' + nodeId + '&nodeName=' + nodeName;
    wx.navigateTo({
      url: url
    })

  },
  funChooseCurrent() {
    var nodeId = this.data.currentShop.node_id,
      nodeName = this.data.currentShop.node_name,
      addr = this.data.currentShop.addr,
      distance = this.data.currentShop.distance,
      goodsType = this.data.currentShop.traceability_type,
      subtype = this.data.currentShop.node_type;
    var nearyChooses = wx.getStorageSync('nearyChooses') || [];
    for (var i = 0; i < nearyChooses.length; i++) {
      if (nodeId == nearyChooses[i].node_id) {
        nearyChooses.splice(i, 1);
      }
    }
    nearyChooses.unshift({ 'node_name': nodeName, 'node_id': nodeId, 'addr': addr, 'traceability_type': goodsType, 'node_type': subtype, 'distance': distance })
    wx.setStorageSync('nearyChooses', nearyChooses);

    this.changeCurrentShop({ 'node_name': nodeName, 'node_id': nodeId, 'addr': addr, 'traceability_type': goodsType, 'node_type': subtype, 'distance': distance })

    if (this.data.changeFlag) {
      wx.scanCode({
        success: (res) => {
          var url = '';
          if (res.scanType === 'QR_CODE') {
            url = '../code/code?code=' + res.result;
          } else {
            url = '../code/code?code=' + res.result + '&scanType=' + res.scanType + '&nodeId=' + nodeId + '&addr=' + addr + '&nodeName=' + nodeName;
          }

          wx.redirectTo({
            url: url
          })
        }
      })

      return

    }

    var url = '../code/code?code=' + this.data.code + '&nodeId=' + nodeId + '&nodeName=' + nodeName;
    wx.navigateTo({
      url: url
    })
  },
  searchNearySuppliers: function (value) {
    var that = this;
    that.setData({
      searchLoading: false
    })
    var url = 'https://www.bjfxr.com/analyse/tracingchain/nodeDistanceByTrace';
    var that = this;
    var page = that.data.inputValue ? '' : 1;
    var params = { 'x_coordinate': that.data.location.longitude, 'y_coordinate': that.data.location.latitude, 'type': '', 'area_id': '', 'page': page, 'node_name': value };
    wx.request({
      url: url,
      data: params,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // console.log('模糊查询成功')
        // console.log(res.data[0].data);
        that.setData({
          'currentTab': 0
        })
        that.setData({
          'chooseSupplier': that.notifyKeyword(res.data[0].data),
          'searchLoading': true
        })
      }
    })
  },
  bindSearch: function (e) {
    var inputValue = e.detail.value;
    this.setData({ key: inputValue })
    this.searchNearySuppliers(inputValue);
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  swichNav: function (e) { //点击切换
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  clearInput: function () { //原始数据
    var that = this;
    this.setData({
      inputValue: ''
    })
    wx.getStorage({
      key: 'chooseSuppliers',
      success: function (res) {
        console.log(res);
        that.setData({
          'chooseSupplier': res.data
        })
      }
    })
  },
  notifyKeyword(data) {
    console.log(data)
    data.forEach((item, index) => {
      item.keyword = this.data.inputValue;
      item.firstPart = item.node_name.split(this.data.inputValue)[0];
      item.lastPart = item.node_name.split(this.data.inputValue)[1];
    })
    return data;
  },
  changeCurrentShop(shop) {
    this.setData({ currentShop: shop })
  }
})
