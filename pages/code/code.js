//code.js 扫描结果页面
var util = require('../../utils/util.js')

var app = getApp();
Page({
    data: {
        result: null,
        codeTypeName: '',
        code: '',
        addr: '',
        nodeId: '',
        curInfo: 0,
        scrollLeft: 0,
        offsetTop: 0,
        uri: '',
        screenWidth: 0,
        swiperHeight: '702rpx'
    },
    onLoad: function(e) {
        console.log(e)
        var _uri = 'code/code?code=' + e.code + '&nodeId=' + e.nodeId + '&addr=' + e.addr + '&scanType=' + e.scanType + '&nodeName=' + e.nodeName;
        this.setData({
            uri: _uri
        })
        console.log(_uri)
        this.reqCodeMsg(e);
        var that = this;
        app.getSystemInfo(function(systemInfo) {
            // console.log(systemInfo.screenWidth)
            that.setData({
                screenWidth: systemInfo.screenWidth
            })
        })
    },
    reqCodeMsg: function(datapath) {
        // console.log(datapath);
        var _nodeId = datapath.nodeId;
        var _nodeName = datapath.nodeName;
        var _scanType = datapath.scanType;
        var _code = datapath.code;
        var _supplierAddress = datapath.addr;
        var that = this
        var qrCodeUri = 'https://www.bjfxr.com/analyse/tracingchain/qrcodemore';
        var barCodeUri = 'https://www.bjfxr.com/analyse/tracingchain/barcode';

        this.setData({
            'addr': _supplierAddress
        })

        this.setData({
            'nodeId': _nodeId
        })

        this.setData({
            'nodeName': _nodeName
        })

        setTimeout(function() {
            that.setData({
                hiddenLoading: true
            })
        }, 2000)

        if (_scanType == 'QR_CODE') {

            that.setData({
                codeTypeName: '二维码'
            })

            wx.request({
                url: qrCodeUri,
                data: { 'trace_code': _code },
                header: {
                    'Content-Type': 'application/json'
                },
                success: function(res) {
                    var data = res.data[0];

                    if (data.result) {
                        // console.log("查询二维码成功");
                        var _res = !!data.data[0] || data.data.length > 1 ? data.data : null;
                        // console.log(res);
                        if (!!_res) {
                            for (var i = 0; i < _res.length; i++) {
                                if (!_res[i])
                                    _res[i] = ''

                            }
                        }
                        // console.log(_res);
                        that.setData({
                            result: _res
                        })
                        that.setSwiperHeight(_res);

                        if (!!data.data) {
                            // console.log(_nodeId + ',' + _nodeName + ',' + _supplierAddress)
                            that.setChooseSupplierSync(_nodeId, _nodeName, _supplierAddress);
                        }
                        that.setLogs();
                    } else {
                        that.setData({
                            result: null
                        })
                    }
                },
                fail: function(res) {
                    // console.log(res);
                    console.log("查询二维码失败");
                }
            })
        } else {

            that.setData({
                codeTypeName: '条形码'
            })

            wx.request({
                url: barCodeUri,
                data: { 'trace_code': _code, 'node_id': _nodeId },
                header: {
                    'Content-Type': 'application/json'
                },
                success: function(res) {
                    var data = res.data[0];
                    if (data.result) {
                        var _res = [];
                        if (!!data.data) {
                            _res.push(data.data);
                        } else {
                            _res = data.data;
                        }

                        that.setData({
                            result: _res
                        })
                        that.setSwiperHeight(_res);
                        // console.log("查询条形码成功");
                        // console.log(_res)
                        if (!!data.data) {
                            that.setChooseSupplierSync(_nodeId, _nodeName, _supplierAddress);
                        }
                        that.setLogs();
                    } else {
                        that.setData({
                            result: null
                        })
                    }
                },
                fail: function(res) {
                    console.log("查询条形码失败");
                }
            })
        }

        this.setData({
            'code': _code
        })

    },
    setSwiperHeight(data) { // 根据有没有供货商动态设置swiper高度
      if (data.length < 2) {
        return
      }

      var hasSuppliername = false

      for(var i = 0; i < data.length; i++) {
        if (data[i]['supplier_name']) {
          hasSuppliername = true;
          break
        }
      }
      this.setData({
        swiperHeight: hasSuppliername ? '940rpx' : '702rpx'
      })

    },
    callPhone() { //打电话
        wx.makePhoneCall({
            phoneNumber: '010-64849651'
        })
    },
    btnCode() {
        var that = this;
        // console.log(that.data.nodeId)
        wx.scanCode({
            success: function(res) {
                console.log('scancode success')
                var code = res.result;
                var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;;
                if (reg.test(res.result)) {
                    code = code.split('com/')[1].split('/')[0]
                }
                var url = '../code/code?code=' + code + '&scanType=' + res.scanType + '&nodeId=' + that.data.nodeId + '&addr=' + that.data.addr + '&nodeName=' + that.data.nodeName;
                wx.redirectTo({
                    url: url
                })
            },
            fail: function(res) {

            }
        })
    },
    chooseGoods(e) { //切换查询商品
        var cur = e.currentTarget.dataset.cur;
        var curLeft = e.currentTarget.offsetLeft - 80 <= 0 ? 0 : e.currentTarget.offsetLeft - 80;
        if (cur != this.data.curInfo) {
            this.setData({
                curInfo: cur
            })
            this.setData({
                scrollLeft: curLeft
            })
        }

    },
    bindChange(e) {
        var that = this;
        var index = e.detail.current;
        var curLeft = 80 * (index - 1) <= 0 ? 0 : 80 * (index - 1);

        this.setData({
            scrollLeft: curLeft
        })
        this.setData({ curInfo: e.detail.current });

    },
    setLogs() {
        let resArrays = this.data.result;
        let logs = wx.getStorageSync('logs') || [];
        let that = this;
        if (!!resArrays) {
            if (util.isArray(resArrays)) {
                // console.log(resArrays)
                var resitem = !!resArrays[0] ? resArrays[0] : {};

                resitem.timer = util.formatTime(new Date());
                resitem.code = that.data.code;
                resitem.uri = '../' + that.data.uri;
                if (resArrays.length > 1) {
                    resitem.goods_name = '多商品';
                }
                logs.unshift(resitem);
            }
            wx.setStorageSync('logs', logs);
        } else {
            return false;
        }
    },
    onShareAppMessage() {
        return {
            title: '北京E追溯',
            desc: '肉菜',
            path: 'pages/' + this.data.uri
        }
    },
    setChooseSupplierSync(nodeId, nodeName, addr) { //添加选择商家本地缓存
        var nearyChooses = wx.getStorageSync('nearyChooses') || [];
        for (var i = 0; i < nearyChooses.length; i++) {
            if (nodeId == nearyChooses[i].node_id) {
                nearyChooses.splice(i, 1);
            }
        }
        nearyChooses.unshift({ 'node_name': nodeName, 'node_id': nodeId, 'addr': addr })
        wx.setStorageSync('nearyChooses', nearyChooses);
    }
})
