import Vue from 'vue'
import { TIME_TIME_OUT, THEME_MAP } from '@/utils/constants'

function submissionMemoryFormat (memory) {
  if (memory === null || memory === '') return '--'
  memory = memory.replace(/k/, '')
  // 1048576 = 1024 * 1024
  const t = parseInt(memory) / 1024
  return String(t.toFixed(0)) + 'MB'
}

function submissionTimeFormat (time) {
  if (time === null || time === '') return '--'
  return time
}

function getACRate (acCount, totalCount) {
  const rate = acCount === 0 || totalCount === 0 ? 0.00 : (acCount / totalCount * 100).toFixed(2)
  return String(rate) + '%'
}

// 去掉值为null的项，返回object
function filterEmptyValue (object) {
  const query = {}
  Object.keys(object).forEach(key => {
    if (object[key] || object[key] === 0 || object[key] === false) {
      query[key] = object[key]
    }
  })
  return query
}

// 按指定字符数截断添加换行，非英文字符按指定字符的半数截断
function breakLongWords (value, length = 16) {
  let re
  if (escape(value).indexOf('%u') === -1) {
    // 没有中文
    re = new RegExp('(.{' + length + '})', 'g')
  } else {
    // 中文字符
    re = new RegExp('(.{' + (length / 2 + 1) + '})', 'g')
  }
  return value.replace(re, '$1\n')
}

function formatTen (num) {
  return num > 9 ? (num + '') : ('0' + num)
}

function formatDate (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return year + '-' + formatTen(month) + '-' + formatTen(day) + ' ' + formatTen(hour) + ':' + formatTen(minute) + ':' + formatTen(second)
}

function downloadFile (url) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http.get(url, { responseType: 'blob' }).then(resp => {
      const headers = resp.headers
      if (headers['content-type'].indexOf('json') !== -1) {
        const fr = new window.FileReader()
        if (resp.data.error) {
          Vue.prototype.$error(resp.data.error)
        } else {
          Vue.prototype.$error('Invalid file format')
        }
        fr.onload = (event) => {
          const data = JSON.parse(event.target.result)
          if (data.error) {
            Vue.prototype.$error(data.data)
          } else {
            Vue.prototype.$error('Invalid file format')
          }
        }
        const b = new window.Blob([resp.data], { type: 'application/json' })
        fr.readAsText(b)
        return
      }
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(new window.Blob([resp.data], { type: headers['content-type'] }))
      link.download = (headers['content-disposition'] || '').split('filename=')[1]
      document.body.appendChild(link)
      link.click()
      link.remove()
      resolve()
    }).catch(() => {})
  })
}

function timeOut (time = TIME_TIME_OUT) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ status: 200, data: { message: 'Time Out!' }})
    }, time)
  })
}

function ratingColor (ratingValue) {
  let color = null
  if (!(typeof ratingValue === 'number' && !isNaN(ratingValue))) {
    return
  }
  if (ratingValue < 1000) {
    color = '#2c2c2c'
  } else if (ratingValue < 1100) {
    color = '#c177e7'
  } else if (ratingValue < 1300) {
    color = '#2693c6'
  } else if (ratingValue < 1500) {
    color = '#5ea1f4'
  } else if (ratingValue < 1700) {
    color = '#00FF00'
  } else if (ratingValue < 1900) {
    color = '#fef958'
  } else if (ratingValue < 2300) {
    color = '#ff8523'
  } else {
    color = '#f42e2e'
  }
  return color
}

function serializationDFS (obj, arr, method) {
  for (const i in obj) {
    const now = obj[i]
    if (typeof now === 'object') {
      serializationDFS(now, arr, method)
    } else {
      if (i === method && obj[i]) {
        arr.add(obj[i])
      }
    }
  }
}

function comparePath (obj, point) {
  const flag = false
  obj = obj.split(/\//g)
  point = point.split(/\//g)
  if (obj.length !== point.length) {
    return flag
  }
  const length = obj.length
  for (let i = 0; i < length; ++i) {
    const currentNow = obj[i]
    const currentPoint = point[i]
    if (currentPoint !== currentNow) {
      if (currentNow[0] !== ':') {
        return false
      }
    }
  }
  return true
}

function serializationAdminDFS (obj, nowArr, res) {
  if (!obj) {
    res.push(nowArr.join('').substring(1))
    return
  }
  for (const item in obj) {
    const value = obj[item]
    const { name, children } = value
    let { path } = value
    if (path === '/') path = ''
    if (name === 'Redirect') continue
    nowArr.push('/' + path)
    serializationAdminDFS(children, nowArr, res)
    nowArr.pop()
  }
}

function createWorker (f) {
  let worker = null
  let url = null
  let blob = null
  if (window.Worker) {
    try {
      blob = new Blob(['(' + f.toString() + ')()'])
      url = window.URL.createObjectURL(blob)
      worker = new Worker(url)
    } catch (_) {
      console.log(_)
    }
  }
  return worker
}

function changeTheme (themeKey = 'white') {
  Promise.resolve().then(() => {
    const theme = THEME_MAP[themeKey].file
    Object.keys(theme).forEach(key => {
      const value = theme[key]
      document.documentElement.style.setProperty(key, value)
    })
  })
}

function weight (key, value) {
  let kb = 0
  const str = '' + key + value
  let byte = 0
  for (var i = 0; i < length; i++) {
    var iCode = str.charCodeAt(i)
    if (iCode >= 0 && iCode <= 255 || iCode >= 0xff61 && iCode <= 0xff9f) {
      byte++
    } else {
      byte += 2
    }
  }
  kb = Math.ceil(byte / 1024)
  if (kb < 50) {
    return 1
  } else if (kb < 100) {
    return 2
  } else if (kb < 200) {
    return 3
  } else if (kb < 500) {
    return 4
  } else if (kb < 600) {
    return 3
  } else if (kb < 800) {
    return 2
  } else if (kb < 2048) {
    return 1
  } else {
    return 0
  }
}

function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export default {
  submissionMemoryFormat: submissionMemoryFormat,
  submissionTimeFormat: submissionTimeFormat,
  getACRate: getACRate,
  filterEmptyValue: filterEmptyValue,
  breakLongWords: breakLongWords,
  downloadFile: downloadFile,
  formatDate: formatDate,
  timeOut: timeOut,
  ratingColor: ratingColor,
  serializationDFS: serializationDFS,
  comparePath: comparePath,
  serializationAdminDFS: serializationAdminDFS,
  createWorker: createWorker,
  changeTheme: changeTheme,
  weight: weight,
  isExternal: isExternal
}
