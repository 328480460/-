/**
 * api接口
 */
import Promise from '../libs/es6-promise';
const nearySupplierUri = 'https://www.bjfxr.com/analyse/tracingchain/distance'; //附近商家定位url



var extendPromise = function(promise) {
    promise.success = function(fn) {
        promise.then((response) => {
            fn(response);
        });
        return promise;
    };
    promise.error = function(fn) {
        promise.then(null, (error) => {
            fn(error);
        });
        return promise;
    }
};


var requestApi = function(url, params) {
    let promise = new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: Object.assign({}, params),
            header: { 'Content-Type': 'json' },
            success: (response) => {
                resolve(response);
            },
            fail: (error) => {
                reject(error);
            }
        });
    });
    extendPromise(promise);
    return promise;
};

var getNearySuppliers = function(x, y) {
    return requestApi(nearySupplierUri, { 'x_coordinate': x, 'y_coordinate': y })
}



//查询条形码接口
var barUri = 'https://www.bjfxr.com/analyse/tracingchain/barcode';

function searchBarCode(nodeId, code) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: barUri,
            data: { 'node_id': nodeId, 'trace_code': code },
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log("查询条形维码成功");
                resolve(res)
            },
            fail: function(res) {
                reject(res)
                console.log("查询条形维码失败");
            }
        })
    })
}


//查询二维码接口
var qrcodeUri = 'https://www.bjfxr.com/analyse/tracingchain/qrcode'

function searchQrCode(code) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: qrcodeUri,
            data: { 'trace_code': code },
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log("查询二维码成功");
                resolve(res)
            },
            fail: function(res) {
                console.log("查询二维码失败");
                reject(res)
            }
        })
    })
}


function helloWorld() {
    console.log('1111');
}

// module.exports.helloWorld = helloWorld;
// // exports.helloWorld = helloWorld;
// module.exports.locateNearySuppliers = locateNearySuppliers; //定位附近商家
// module.exports.searchBarCode = searchBarCode;
// module.exports.searchQrCode = searchQrCode;

module.exports = {
    getNearySuppliers: getNearySuppliers
}


