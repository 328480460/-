const areaList = require('../../utils/area.js');
const typeList = require('../../utils/type.js');
const basePath = 'https://www.bjfxr.com/analyse/';

Page({
  data: {
    areaList: areaList,
    typeList: typeList,
    dataList: [],
    latitude: '',
    longitude: '',
    areaId: '',
    areaName: '附近',
    companyTypeId: '',
    companyTypeName: '类型',
    nodeNameInterim: '',
    nodeName: '',
    page: 1,
    areaFlag: false,
    companyTypeFlag: false,
    scrollTop: 0,
    isLoading: false,
    isFinish: false,
    initeLoading: true,
    isFail: false,
    
  },
  onLoad() {
    let _this = this;
    let query = wx.createSelectorQuery();
    query.select('#static-content').boundingClientRect((rect) => {
      let staticH = rect.height;
      wx.getSystemInfo({
        success: (res) => {
          let ww = res.windowWidth;
          let wh = res.windowHeight;
          let scrollH = wh - staticH;
          this.setData({
            scrollH: scrollH,
          });
        }
      })
    }).exec();

    wx.getLocation({
      success(res) {
        type: 'gcj02',
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          // nodeName: res.latitude + '..' + res.longitude
        })
        // console.log(res.latitude, res.longitude)
        _this.getCompanyList(res.longitude, res.latitude, '', 1, '', '', '');
      }
    })
  },
  openMap(event) {
    let latitude = event.currentTarget.dataset.lat;
    let longitude = event.currentTarget.dataset.lon;
    let name = event.currentTarget.dataset.name;
    let address = event.currentTarget.dataset.address;
    let coordinate = this.BdmapEncryptToMapabc(latitude, longitude)
    wx.openLocation({
      latitude: coordinate.lat, //parseFloat(latitude), 
      longitude: coordinate.lng, //parseFloat(longitude), 
      scale: 14,
      name: name,
      address: address
    })
  },
  turnMap() {
    var _this = this;
    wx.navigateTo({
      url: `../map/map?latitude=${this.data.latitude}&longitude=${this.data.longitude}`
    })
  },
  toggleArea() {
    this.setData({
      areaFlag: !this.data.areaFlag,
      companyTypeFlag: false
    })
  },
  toggleType() {
    this.setData({
      areaFlag: false,
      companyTypeFlag: !this.data.companyTypeFlag
    })
  },
  closeModal() {
    this.setData({
      areaFlag: false,
      companyTypeFlag: false
    })
  },
  changeKey(event) {
    this.setData({
      nodeNameInterim: event.detail.value
    })
  },
  selectKey(event) {
    this.setData({
      nodeName: this.data.nodeNameInterim,
      isLoading: false,
      isFinish: false,
      page: 1,
      scrollTop: 0
    })
    this.getCompanyList(this.data.longitude, this.data.latitude, this.data.nodeName, 1, '', this.data.areaId, this.data.companyTypeId)
  },
  selectArea(event) {
    if (event.target.dataset.areaid) {
      this.setData({
        areaId: event.target.dataset.areaid,
        areaName: event.target.dataset.areaname,
        isLoading: false,
        isFinish: false,
        page: 1,
      })
    } else {
      this.setData({
        areaId: event.target.dataset.areaid,
        areaName: "附近",
        isLoading: false,
        isFinish: false,
        page: 1,
      })
    }
    this.toggleArea();
    this.setData({
      scrollTop: 0
    });
    this.getCompanyList(this.data.longitude, this.data.latitude, this.data.nodeName, 1, '', this.data.areaId, this.data.companyTypeId)
  },
  selectCompanyTypeId(event) {
    if (event.target.dataset.typeid) {
      this.setData({
        companyTypeId: event.target.dataset.typename,
        companyTypeName: event.target.dataset.typename,
        isLoading: false,
        isFinish: false,
        page: 1,
      })
    } else {
      this.setData({
        companyTypeId: '',
        companyTypeName: "类型",
        isLoading: false,
        isFinish: false,
        page: 1,
      })
    }
    this.toggleType();
    this.setData({
      scrollTop: 0
    });
    this.getCompanyList(this.data.longitude, this.data.latitude, this.data.nodeName, 1, '', this.data.areaId, this.data.companyTypeId)
  },
  loadMore(event) {
    if (this.data.isFinish) {
      return
    }
    if (this.data.isLoading) {
      return
    }
    this.setData({
      isLoading: true,
      page: ++this.data.page
    })
    this.getCompanyList(this.data.longitude, this.data.latitude, this.data.nodeName, 1, '', this.data.areaId, this.data.companyTypeId)
  },
  notifyKeyword(data) {
    data.forEach((item, index) => {
      item.keyword = this.data.nodeName;
      item.firstPart = item.node_name.split(this.data.nodeName)[0];
      item.lastPart = item.node_name.split(this.data.nodeName)[1];
    })
    this.setData({
      dataList: this.data.isLoading ? this.data.dataList.concat(data) : data,
      isLoading: false,
      initeLoading: false
    })
  },
  getCompanyList(lat, lon, node_name, page, companyType, area_id,node_type) {
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
        area_id: area_id,
        node_type: node_type
      },
      success(res) {
        // console.log(res)
        if (_this.data.nodeName) {
          _this.notifyKeyword(res.data[0].data)
        } else {
          _this.setData({
            dataList: _this.data.isLoading ? _this.data.dataList.concat(res.data[0].data) : res.data[0].data,
            isLoading: false,
            initeLoading: false,
            isFinish: false,
            isFail: false
          })
        }
        if (res.data[0].data.length < 15) {
          _this.setData({
            isFinish: true
          })
        }
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
  }
})