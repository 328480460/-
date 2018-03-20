function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function getUrlParam(key) {
    var reg = new RegExp(key + '=([^&]*)');
    var results = location.href.match(reg);
    return results ? results[1] : null;
}


/**
 * [newGuid 生成guid]
 * @return {[type]} [description]
 */
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}


function isJson(obj) {
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}


var parseParam = function(param) {
    var str = '',
        lastStr = '';
    each(param, function(key, value) {
        str += key + '=' + value + '&';
    })
    var arrayStr = str.split('&');
    for (var i = 0; i < arrayStr.length - 1; i++) {
        if (i == arrayStr.length - 2) {
            lastStr += arrayStr[i];
        } else {
            lastStr += arrayStr[i] + '&';
        }
    }
    return lastStr;
};



function isArray(object) {
    return object && typeof object === 'object' &&
        Array == object.constructor;
}

// 通过字面量方式实现的函数each
var each = function(object, callback) {
    var type = (function() {
        switch (object.constructor) {
            case Object:
                return 'Object';
                break;
            case Array:
                return 'Array';
                break;
            case NodeList:
                return 'NodeList';
                break;
            default:
                return 'null';
                break;
        }
    })();
    // 为数组或类数组时, 返回: index, value
    if (type === 'Array' || type === 'NodeList') {
        // 由于存在类数组NodeList, 所以不能直接调用every方法
        [].every.call(object, function(v, i) {
            return callback.call(v, i, v) === false ? false : true;
        });
    }
    // 为对象格式时,返回:key, value
    else if (type === 'Object') {
        for (var i in object) {
            if (callback.call(object[i], i, object[i]) === false) {
                break;
            }
        }
    }
}


module.exports = {
    formatTime: formatTime,
    newGuid: newGuid,
    isJson: isJson,
    parseParam: parseParam,
    isArray: isArray
}
