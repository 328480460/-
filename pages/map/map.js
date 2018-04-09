const basePath = 'https://www.bjfxr.com/analyse/';
const EARTH_RADIUS = 6378137.0;    //单位M
const PI = Math.PI;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: '',
    latitude: '',
    longitude: '',
    scale: 14,
    infoH: 100,
    markers: [],
    currentMark: {}
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
          mapH: wh - _this.data.infoH,
          // controls: [{
          //   id: 1,
          //   iconPath: '../../images/current-icon.png',
          //   position: {
          //     left: res.windowWidth / 2 - 20,
          //     top: (wh - _this.data.infoH) / 2 - 40,
          //     width: 40,
          //     height: 40
          //   },
          //   clickable: true
          // }]
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
        _this.getCompanyList(res.longitude, res.latitude, '', '', '', '');
        setTimeout(function () {
          _this.mapCtx.moveToLocation();
        }, 300)
      }
    })
  },
  openMap() {
    wx.openLocation({
      latitude: this.data.currentMark.latitude,
      longitude: this.data.currentMark.longitude,
      scale: 14,
      name: this.data.currentMark.shopName,
      address: this.data.currentMark.address
    })
  },
  regionchange(e) {
    if (e.type == 'end') {
      this.getMapCenter()
    }
  },
  markertap(e) {
    // console.log(e)
    let currentMark = [];
    this.data.markers.forEach((item, index) => {
      item.iconPath = "../../images/company-icon.png";
      if (item.id === e.markerId) {
        item.iconPath = '../../images/current-select-icon.png';
        currentMark = item;
      }
    })
    this.setData({
      currentMark: currentMark,
      markers: this.data.markers
    })
  },
  getMapCenter() {
    var _this = this;
    _this.mapCtx.getCenterLocation({
      success(res) {
        var distance = _this.getFlatternDistance(res.latitude, res.longitude, _this.data.latitude, _this.data.longitude)
        console.log(distance)
        if (distance > 5000) {
          _this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
          _this.getCompanyList(res.longitude, res.latitude, '', '', '', '');
        }
      }
    })
  },
  getMarkList(data) {
    let list = [];
    data.forEach((item, index) => {
      let coordinate = this.BdmapEncryptToMapabc(item.Y_COORDINATE, item.X_COORDINATE);
      list.push({
        iconPath: "../../images/company-icon.png",
        id: item.node_id,
        shopName: item.node_name,
        address: item.addr,
        distance: item.distance,
        latitude: coordinate.lat,
        longitude: coordinate.lng,
        width: 30,
        height: 30,
      })
    })
    if (!Object.keys(this.data.currentMark).length) {
      list[0].iconPath = '../../images/current-select-icon.png';
      this.setData({
        currentMark: list[0]
      })
      return list
    } else {
      let flag = false;
      list.forEach((item, index) => {
        if (item.id === this.data.currentMark.id) {
          flag = true;
        }
      });
      if (!flag) {
        return [this.data.currentMark, ...list];
      } else {
        list.find((item, index) => {
          return item.id === this.data.currentMark.id
        }).iconPath = '../../images/current-select-icon.png';
        return list
      }
    }
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
  },
  BdmapEncryptToMapabc(bd_lat, bd_lon) {
    var point = new Object();
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = new Number(bd_lon - 0.0065);
    var y = new Number(bd_lat - 0.006);
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var Mars_lon = z * Math.cos(theta);
    var Mars_lat = z * Math.sin(theta);
    point.lng = Mars_lon;
    point.lat = Mars_lat;
    return point;
  },
  // 距离换算
  getRad(d) {
    return d * PI / 180.0;
  },
  getFlatternDistance(lat1, lng1, lat2, lng2) {
    var f = this.getRad((lat1 + lat2) / 2);
    var g = this.getRad((lat1 - lat2) / 2);
    var l = this.getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  }
})