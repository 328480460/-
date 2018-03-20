const basePath = 'https://www.bjfxr.com/analyse/';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: '',
    latitude: '',
    longitude: '',
    scale: 16,
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.mapCtx = wx.createMapContext('map');
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          screen: wh,
          controls: [{
            id: 1,
            iconPath: '../../images/current-icon.png',
            position: {
              left: res.windowWidth / 2 - 20,
              top: res.windowHeight / 2 - 40,
              width: 40,
              height: 40
            },
            clickable: true
          }]
        });
      }
    })
    wx.getLocation({
      success(res) {
        type: 'gcj02',
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          })
        _this.getCompanyList(res.longitude, res.latitude, '', 1, '', '');
        setTimeout(function() {
          _this.mapCtx.moveToLocation();
        },300)
      }
    })
  },
  
  regionchange(e) {
    if (e.type == 'end') {
      this.getMapCenter()
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  getMapCenter() {
    var _this = this;
    _this.mapCtx.getCenterLocation({
      success(res) {
        _this.getCompanyList(res.longitude, res.latitude, '', 1, '', '');
      }
    })
  },
  getMarkList(data) {
    let list = [];
    data.forEach((item,index) => {
      list.push({
        iconPath: "../../images/logo.png",
        id: index,
        latitude: item.Y_COORDINATE,
        longitude: item.X_COORDINATE,
        width: 30,
        height: 30
      })
    })
    // for(let i = 0; i < 100; i ++)  {
    //   list.push({
    //     iconPath: "../../images/logo.png",
    //     id: i++,
    //     latitude: data[i].Y_COORDINATE,
    //     longitude: data[i].X_COORDINATE,
    //     width: 30,
    //     height: 30
    //   })
    // }
    return list;
  },
  getCompanyList(lat, lon, node_name, page, companyType, area_id) {
    var _this = this;
    wx.request({
      url: basePath + "tracingchain/nodeDistance",
      method: 'GET',
      data: {
        x_coordinate: lat,
        y_coordinate: lon,
        node_name: node_name,
        page: page,
        type: companyType,
        area_id: area_id
      },
      success(res) {
        _this.setData({
          dataList: res.data[0].data,
          markers: _this.getMarkList(res.data[0].data),
        })
       
        // _this.getMapCenter();
        
      },
      fail() {
        console.log('网络连接超时')
        _this.setData({
          isFail: true,
          isLoading: false,
          initeLoading: false,
        })
      }
    })
  }
})