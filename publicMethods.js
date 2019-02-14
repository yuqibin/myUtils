/**
 * 通用方法库
 * created by yqb 2018-10-17
 * */

/**
 * 拼装url
 * @param {String} url：基础url
 * @param {Object} params：要拼进url的参数对象
 * @return {String}
 * */
export const splicingUrl = (url, params) => {
  params = params || {}

  if (!url.indexOf('/')) {
    url = '/' + url;
  }
  if (url.indexOf('?') < 0) {
    url += '?'
  }
  for (let i in params) {
    if (typeof params[i] !== 'function') {
      url +=  `&${i}=${params[i]}`
    }
  }
  return url.replace('?&', '?');
}

/**
 * 获取url指定参数
 * @param {String} url: 目标url
 * @param {String} keyName: 需要从url获取到的参数key
 * @return {String} string || null
 * */
export const getUrlOneParam = (url, keyName) => {
  let reg = new RegExp('(^|&)' + keyName + '=([^&]*)(&|$)');
  let r = url.search.substr(1).match(reg);
  if (r !== null) return decodeURIComponent(r[2]);
  return null;
}

/**
 * 获取url全部参数
 * @param {String} url:目标url
 * @return {Object} 全部参数对象
 * */
export const getUrlAllParams = (url) => {
  let qs = (url.search.length > 0 ? url.search.substring(1) : '')
  let args = {}
  let items = qs.length > 0 ? qs.split('&') : []
  for (let data of items) {
    let item = data.split('=')
    let name = decodeURIComponent(item[0])
    let value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  return args
}

/**
 * 三非判断，（非空字符串、非null，非undefined）
 * @param {any} target:需要判断的值
 * @return boolean
 * */
export const checkThreeType = (target) => {
  if (target !== '' && target !== null && target !== undefined) {
    return true
  }
  return false
}

/**
 * 非空对象
 * @param {Object} target
 * @return {Boolean} 空对象：true 非空对象：false
 */
export const nonEmptyObject = (target) => {
  if (JSON.stringify(target) === '{}') {
    return true
  }
  return false
}

/**
 * 接口数据过滤
 * @param {Object} data: 数据（格式：非空对象）
 * @param {Array} keyLists 要保留字段名的集合
 * @return {Object} result 数据（对象）
 * */
export const DataFiltering = (data, keyLists) => {
  if (JSON.stringify(data) === '{}' || !(keyLists instanceof Array) || !keyLists.length) {
    throwError('TypeError', '参数类型错误', 'DataFiltering')
  }
  let result = {}
  for (let val of keyLists) {
    if (checkThreeType(val) && data.hasOwnProperty(val)) {
      result[val] = data[val]
    }
  }
  return result
}

/**
 * 抛错
 * @param {String} errorType: 错误类型--可选值:SyntaxError(语法)/ReferenceError(引用)/RangeError(范围)/TypeError(类型)/URLError(URL错误)/EvalError(eval错误)
 * @param {String} errortips: 提示内容(string)
 * @param {String} funcName: 提示错误出现在哪个方法
 * */
const throwError = function (errorType, errortips, funcName) {
  let tips = `Uncaught(in ${funcName})${errortips}`
  switch (errorType) {
    case 'SyntaxError':
      throw new SyntaxError(tips)
    case 'ReferenceError':
      throw new ReferenceError(tips)
    case 'RangeError':
      throw new RangeError(tips)
    case 'TypeError':
      throw new SyntTypeErroraxError(tips)
    case 'URLError':
      throw new URLError(tips)
    case 'EvalError':
      throw new EvalError(tips)
    default:
      throw new Error(tips)
  }
}

/**
 * js双精度计算保留x位小数
 * @param {String} calcuType 计算类型--add/reduce/ride/except  加减乘除
 * @param {String} decPlace 保留小数位
 * @param {Number} operaNum 操作数字
 * @param {Number} operatedNum 被操作数字
 * */
export const addDoublePrecision = (operaNum, operatedNum, calcuType, decPlace) => {
  if (typeof operaNum !== 'number' || typeof operatedNum !== 'number' || typeof calcuType !== 'string') {
    throwError('TypeError', '参数类型错误', 'addDoublePrecision')
  }
  // 去ab的最大小数位
  let result
  let pow
  if (decPlace) {
    pow = Math.pow(10, decPlace)
    // 10的x倍数
    operaNum = operaNum.toFixed(decPlace)
    operatedNum = operatedNum.toFixed(decPlace)
  } else if (decPlace === 0) {
    pow = 1
  } else {
    let operaArr = operaNum.toString().split('.')
    let operatedArr = operatedNum.toString().split('.')
    let numMaxDec = Math.max(operaArr[1] ? operaArr[1].toString().length : 0, operatedArr[1] ? operatedArr[1].toString().length : 0)
    pow = Math.pow(10, numMaxDec)
    decPlace = numMaxDec
  }
  let pOperaNum = operaNum * pow
  let pOperatedNum = operatedNum * pow
  switch (calcuType) {
    case 'add':
      result = (pOperaNum + pOperatedNum) / pow
      break;
    case 'reduce':
      result = (pOperaNum - pOperatedNum) / pow
      break;
    case 'ride':
      result = (pOperaNum * pOperatedNum) / (pow * pow)
      break;
    case 'except':
      result = (operaNum / operatedNum).toFixed(decPlace)
      break;
    default:
      throwError('RangeError', '计算类型参数错误', 'addDoublePrecision')
      break;
  }
  return result
}

/**
 * 格式化日期
 * @param {Number | String} dateMsec 时间
 * @param {String} fmt 时间格式，例如： yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (dateMsec, fmt) => {
  let date = new Date(dateMsec)
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}
