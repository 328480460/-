## 北京E追溯小程序lite

* [微信小程序官方接口文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)

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
|   | 	 |__  logs.js
|   |    |__  logs.json
|   |    |__  logs.wxml
|   |    |__  logs.wxss 
|   |
|   |__  company
|   |    |__  company.js                #追溯企业列表view
|   |    |__  company.json
|   |    |__  company.wxml
|   |    |__  company.wxss
|   |
|   |__  map
|   |    |__  map.js                    #地图view
|   |    |__  map.json
|   |    |__  map.wxml
|   |    |__  map.wxss
|   |
|   | 
|—— app.js 								#小程序逻辑
|
|—— app.json 							#小程序配置
|
|—— app.wxss 							#小程序公用样式 
</pre> 

