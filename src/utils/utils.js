import Vue from 'vue'
import { TIME_TIME_OUT } from '@/utils/constants'

function submissionMemoryFormat (memory) {
  if (memory === null || memory === '') return '--'
  memory = memory.replace(/k/, '')
  // 1048576 = 1024 * 1024
  let t = parseInt(memory) / 1024
  return String(t.toFixed(0)) + 'MB'
}

function submissionTimeFormat (time) {
  if (time === null || time === '') return '--'
  return time
}

function getACRate (acCount, totalCount) {
  let rate = acCount === 0 || totalCount === 0 ? 0.00 : (acCount / totalCount * 100).toFixed(2)
  return String(rate) + '%'
}

// 去掉值为null的项，返回object
function filterEmptyValue (object) {
  let query = {}
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

function formatTen(num) {
  return num > 9 ? (num + "") : ("0" + num);
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return year + "-" + formatTen(month) + "-" + formatTen(day) + ' ' + formatTen(hour) + ':' + formatTen(minute) + ':' + formatTen(second);
}

function downloadFile (url) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http.get(url, {responseType: 'blob'}).then(resp => {
      let headers = resp.headers
      if (headers['content-type'].indexOf('json') !== -1) {
        let fr = new window.FileReader()
        if (resp.data.error) {
          Vue.prototype.$error(resp.data.error)
        } else {
          Vue.prototype.$error('Invalid file format')
        }
        fr.onload = (event) => {
          let data = JSON.parse(event.target.result)
          if (data.error) {
            Vue.prototype.$error(data.data)
          } else {
            Vue.prototype.$error('Invalid file format')
          }
        }
        let b = new window.Blob([resp.data], {type: 'application/json'})
        fr.readAsText(b)
        return
      }
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(new window.Blob([resp.data], {type: headers['content-type']}))
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
      reject(new Error('Time Out'))
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
  for (let i in obj) {
    let now = obj[i]
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
  let flag = false
  obj = obj.split(/\//g)
  point = point.split(/\//g)
  if (obj.length !== point.length) {
    return flag
  }
  let length = obj.length
  for (let i = 0; i < length; ++i) {
    let currentNow = obj[i]
    let currentPoint = point[i]
    if (currentPoint !== currentNow) {
      if (currentNow[0] !== ':') {
        return false
      }
    }
  }
  return true
}	

function createWorker(f) {
  let worker = null, url = null, blob = null
  if (window.Worker) {
    try {
      blob = new Blob(['(' + f.toString() +')()'])
      url = window.URL.createObjectURL(blob)
      worker = new Worker(url)
    } catch (_) {}
  }
  return worker
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
  createWorker: createWorker
}
