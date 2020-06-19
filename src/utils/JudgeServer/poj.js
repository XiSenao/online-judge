export function exFormatText (str) {
    // 兼容POJ图片及其他链接
    // 匹配图片链接
    let imgReg = /<img.*?(?:>|\/>)/gi
    let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
    // 匹配a链接
    let hrefReg = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/gi
    let divideReg = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/i
    let generateReg = /^data:image\//i
    let supportURL = ['http://poj.org/']
    if (!str) {
      return str
    }
    // 图片链接处理
    var arr = str.match(imgReg);
    if (arr) {
      for (var i = 0; i < arr.length; i++) {
        var src = arr[i].match(srcReg);
        if (!generateReg.test(src[1]) && src[1] && !supportURL.some(res => src[1].indexOf(res) > -1)) {
          str = str.replace(src[0], `src=http://poj.org/${ src[1] }`)	
        }
      }
    }
    // a链接处理
    let hrefMatch = str.match(hrefReg)
    if (hrefMatch) {
      for (let matchStr of hrefMatch) {
        let op = matchStr.match(divideReg)
        let attr = RegExp.$1 
        if (/^searchproblem\?/.test(attr)) {
          str = str.replace(matchStr, `<a href="http://poj.org/${ attr }" target="_blank">${ op[2] }</a>`)
        }
      }
    }
    return str 
  }