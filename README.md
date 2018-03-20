## 北京E追溯小程序lite

* [微信小程序官方接口文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)
* [github 地址](https://github.com/oneBythree/xiaochengxu)

### 目录结构
<pre>
|—— images 								#图片
|							  
|—— libs 			   					#静态js
| 	|__ qqmap-wx-jssdk.min.js 			#腾讯地图sdk		
|    
|——	pages								#存放相关项目文件
|   |__	about							#关于我们view
|   |	|__  about.js                 	
|   |   |__  about.json   
|   |   |__  about.wxml 
|   |   |__  about.wxss
|   |
|   |__ chooseLocation 					#选择附近商家view
|   |   |__  chooseLoaction.js
|   |   |__  chooseLoaction.json 
|   |   |__  chooseLoaction.wxml
|   |   |__  chooseLoaction.wxss
|   |
|   |__  code 							#查询结果view
|   |    |__  code.js
|   |    |__  code.json
|   |    |__  code.wxml
|   |    |__  code.wxss
|   |
|   |__  index  						#首页view 
|   |    |__  index.js
|   |    |__  index.json
|   |    |__  index.wxml
|   |    |__  index.wxss
|   | 
|   |__  logs							#查询记录view
|     	 |__  logs.js
|        |__  logs.json
|        |__  logs.wxml
|        |__  logs.wxss 
|   
|—— app.js 								#小程序逻辑
|
|—— app.json 							#小程序配置
|
|—— app.wxss 							#小程序公用样式 
</pre> 

### 逻辑页面 【首页】
#### 入口分为两种
##### 线下门店
**门店二维码参数说明**
* nodeId 	节点id
* latitude 	节点x坐标
* longitude 节点y坐标
* **[生成带参二维码](https://weixin.hotapp.cn/)**
#### 定位门店
**根据定位地理，匹配数据库合作门店**
* 小程序定位接口 [wx.getlocation](https://mp.weixin.qq.com/debug/wxadoc/dev/api/location.html#wxgetlocationobject)
* [定位附近商户](https://www.bjfxr.com/analyse/tracingchain/distance?x_coordinate=39.98848&y_coordinate=116.3314)  详情查看接口文档[e追溯查询接口文档1.6.docx]
#### 扫一扫
* 小程序扫一扫接口 [wx.scanCode](https://mp.weixin.qq.com/debug/wxadoc/dev/api/scancode.html#wxscancodeobject)
* **跳转查询结果页面参数说明**
1. code 	#扫描结果值
2. scanType #扫描码质类型（二维码、条形码）
3. nodeId  	#节点ID
4. addr 	#节点详细地址
5. nodeName #节点名称
#### 切换附近商家
**跳转附近商家参数说明**
1. latitude		#定位或带参二维码 x坐标
2. longitude	#定位或带参二维码 y坐标
3. nodeId 		#定位或带参二维码 节点ID
#### 我的
**获取个人信息**
* 小程序接口登录接口 [wx.login](https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html#wxloginobject)
* 小程序获取个人信息接口 [wx.getUserInfo](https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html#wxgetuserinfoobject)
---------------------------------------
**小程序获取地理位置和个人信息权限**
* 兼容处理 [wx.openSetting](https://mp.weixin.qq.com/debug/wxadoc/dev/api/setting.html#opensettingobject)
---------------------------------------
### 查询结果页面 code
#### 获取结果页面参数两种情况
1. 二维码（scanType === QR_CODE）
* [查询二维码](https://www.bjfxr.com/analyse/tracingchain/qrcodemore) 详情查看接口文档[e追溯查询接口文档1.6.docx]
2. 条形码 (scanType === bar_CODE)
* [查询条形码](https://www.bjfxr.com/analyse/tracingchain/barcode) 详情查看接口文档[e追溯查询接口文档1.6.docx]
#### 查询成功添加本地缓存
* 小程序添加本地缓存接口 [wx.setStorageSync](https://mp.weixin.qq.com/debug/wxadoc/dev/api/data.html#wxsetstoragesynckeydata)
### 选择附近商家 chooseLocation 
#### 获取本地缓存附近商家
* 小程序获取本地缓存接口 [wx.setStorageSync](https://mp.weixin.qq.com/debug/wxadoc/dev/api/data.html#wxgetstoragesynckey)
---------------------------------------
