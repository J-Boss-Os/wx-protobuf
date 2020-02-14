import { Root } from './protobufjs/index.js';
export * from './protobufjs/index.js';
class WxProto {
  constructor() {
    this._rootArray = {};
    this._messageArray = {};
    this._init = null;
  }
  /**
   * 初始化
   * @param {*} param0 
   */
  init({ roots, setRootHook } = { roots: {} }) {
    try {
      if (this._init) throw Error(`WxProto.init已初始化，请不要重复初始化`);
      this._init = true;
      if (roots.constructor.name === 'Object') {
        for (let rootName in roots) {
          this.setRoot(rootName, roots[rootName], setRootHook)
        }
      }
    }
    catch (e) {
      console.error(e)
    }
  }
  /**
   * 设置主体
   * @param {*} rootName 
   * @param {*} config 
   * @param {*} setRootHook 
   */
  setRoot(rootName, config, setRootHook) {
    let root = null
    try {
      if (this._rootArray[rootName]) throw Error(`【${rootName}】Root已存在，请不要重复注入！`);
      if (!config) throw Error(`请传入【${rootName}】的json配置信息！`);
      const that = this
      root = Root.fromJSON(config)
      if (root) this._rootArray[rootName] = root;
      root && analyzeNested(root.nestedArray);
      return root
      /**
       * 递归注入
       */
      function analyzeNested(nestedArray) {
        nestedArray.map(nested => {
          if (nested.constructor.name === 'Type') that.setLookupType(root, nested.name)
          if (setRootHook) setRootHook(that, rootName, nested)
          if (nested.nestedArray && nested.nestedArray.length) analyzeNested(nested.nestedArray)
        })
      }
    }
    catch (e) {
      console.log(e.constructor.name)
      if (e.constructor.name === 'Error') console.error(e)
      else console.warn(e)
      return root
    }
  }
  /**
   * 获取协议
   * @param {*} lookupType 
   */
  getLookupType(lookupType) {
    let message = null;
    try {
      if (!lookupType) throw Error(`没有查到【${lookupType}】lookupType！`)
      message = this._messageArray[lookupType]
      return message
    }
    catch (e) {
      console.error(e)
      return message
    }
  }
  /**
   * 设置协议
   * @param {*} root 
   * @param {*} lookupType 
   */
  setLookupType(root, lookupType) {
    let message = null
    try {
      message = this._messageArray[lookupType];
      if (message) throw Error(`【${lookupType}】lookupType已存在，请不要重复注入！`)
      message = root && root.lookupType(lookupType);
      if (message) this._messageArray[lookupType] = message
      return message
    } catch (e) {
      console.error(e)
      return message
    }
  }
  /**
   * 加密
   * @param {*} lookupType 
   * @param {*} params 
   */
  encode(lookupType, params = {}) {
    let buffer = null
    try {
      const Type = this.getLookupType(lookupType);
      if (!Type) return buffer
      buffer = Type.encode(Type.create(params)).finish()
      return buffer
    } catch (e) {
      console.error(e)
      return buffer
    }
  }
  /**
   * 解密
   * @param {*} lookupType 
   * @param {*} buffer 
   */
  decode(lookupType, buffer) {
    let message = null
    try {
      const Type = this.getLookupType(lookupType);
      if (!Type) return buffer
      message = Type.decode(buffer)
      return message
    } catch (e) {
      console.error(e)
      return message
    }
  }
}

const wxProto = (function () {
  let _proto = null
  return function () {
    if (!_proto) _proto = new WxProto
    return _proto
  }
})()();

export default wxProto;