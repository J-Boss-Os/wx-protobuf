# wx-protobuf

微信小程序使用的 protobuf 协议开发工具

## 使用教程

* 全局安装 `protobufjs` 对`.proto`文件进行转换成`json`

``` cmd
$ npm install -g protobufjs
```

* 检测是否安装成功

``` cmd
 $ pbjs
```

* 先创建一个 `test.proto` 文件
``` proto
// awesome.proto
 syntax = "proto3";

 message Test {
 	number userId = 1;
 	staring userName = 2;
 }
```

* 接下来我们来转换 `test.proto` 文件;

``` cmd
$ pbjs -t json test.proto > test.json
```
* 这时我们就会得到一个 test.json 文件

``` json
 {
  "nested": {
  	"Test": {
   		"fields": {
     	  "userId": {
       	   "type": "number",
       	   "id": 1
     	  },
     	  "userName": {
       	   "type": "string",
       	   "id": 2
     	  }
   	   }
     }
   }
 }
```

* 由于Json 文件不能直接在微信小程序内使用，所以我们需要用js把协议配置导出来

``` js
export default {
  "nested": {
  	"Test": {
   		"fields": {
     	  "userId": {
       	   "type": "number",
       	   "id": 1
     	  },
     	  "userName": {
       	   "type": "string",
       	   "id": 2
     	  }
   	   }
     }
   }
 }
```

* 直接下载全部文件到你的微信制定的目录地址中，然后使用SE6语法
``` js
import wxProtobuf from '你放置的地址/wxProtobuf/index' 
```

## 初始化 wxProtobuf 程序

由于使用的是单例模式，所以不要多次初始化，初始化后的配置全局获取到的都是同一个实例.

``` js
import wxProtobuf from '你放置的地址/wxProtobuf/index';
import textRoot from '你放置的地址/test.json';

wxProtobuf.init({
  roots:{ // roots 的 key 会变成 存在 this._rootArray 里 的 key
    textRoot: textRoot,
    ...
  }
})

// 如果在init 的时候 传入了 root ，就会自动 执行 root.lookupType 这个方法 挂载 json 文件内的所有的 message

```

## 加密

``` js
import wxProtobuf from '你放置的地址/wxProtobuf/index';

const buffer = wxProtobuf.encode('Test',{userId:1,userName:'user'});

console.log(buffer) // 这个就是我们要传给后台的 二进制流

```

## 解密

``` js
import wxProtobuf from '你放置的地址/wxProtobuf/index';

const buffer = wxProtobuf.encode('Test',{userId:1,userName:'user'});

console.log(buffer) // 这个就是我们要传给后台的 二进制流

const loginData = wxProtobuf.decode('Test',buffer);

console.log(loginData) // 这个就是 讲 二进制 转换成 可以用的 obj 数据
```