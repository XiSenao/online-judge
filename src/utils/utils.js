import Vue from 'vue'
import storage from '@/utils/storage'
import { STORAGE_KEY, TIME_TIME_OUT } from '@/utils/constants'

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
  console.log(url);
  
  return new Promise((resolve, reject) => {
    Vue.prototype.$http.get(url, {responseType: 'blob'}).then(resp => {
      console.log(resp)
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

function getLanguages () {
  return new Promise((resolve, reject) => {
    let languages = storage.get(STORAGE_KEY.languages)
    if (languages) {
      resolve(languages)
    }
    languages = [
      {
          "spj": {
              "config": {
                  "command": "{exe_path} {in_file_path} {user_out_file_path}",
                  "exe_name": "spj-{spj_version}",
                  "seccomp_rule": "c_cpp"
              },
              "compile": {
                  "exe_name": "spj-{spj_version}",
                  "src_name": "spj-{spj_version}.c",
                  "max_memory": 1073741824,
                  "max_cpu_time": 3000,
                  "max_real_time": 10000,
                  "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}"
              }
          },
          "name": "C",
          "config": {
              "run": {
                  "env": [
                      "LANG=en_US.UTF-8",
                      "LANGUAGE=en_US:en",
                      "LC_ALL=en_US.UTF-8"
                  ],
                  "command": "{exe_path}",
                  "seccomp_rule": {
                      "File IO": "c_cpp_file_io",
                      "Standard IO": "c_cpp"
                  }
              },
              "compile": {
                  "exe_name": "main",
                  "src_name": "main.c",
                  "max_memory": 268435456,
                  "max_cpu_time": 3000,
                  "max_real_time": 10000,
                  "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}"
              },
              "template": "//PREPEND BEGIN\n#include <stdio.h>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  printf(\"%d\", add(1, 2));\n  return 0;\n}\n//APPEND END"
          },
          "description": "GCC 5.4",
          "content_type": "text/x-csrc"
      },
      {
          "spj": {
              "config": {
                  "command": "{exe_path} {in_file_path} {user_out_file_path}",
                  "exe_name": "spj-{spj_version}",
                  "seccomp_rule": "c_cpp"
              },
              "compile": {
                  "exe_name": "spj-{spj_version}",
                  "src_name": "spj-{spj_version}.cpp",
                  "max_memory": 1073741824,
                  "max_cpu_time": 3000,
                  "max_real_time": 5000,
                  "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}"
              }
          },
          "name": "C++",
          "config": {
              "run": {
                  "env": [
                      "LANG=en_US.UTF-8",
                      "LANGUAGE=en_US:en",
                      "LC_ALL=en_US.UTF-8"
                  ],
                  "command": "{exe_path}",
                  "seccomp_rule": "c_cpp"
              },
              "compile": {
                  "exe_name": "main",
                  "src_name": "main.cpp",
                  "max_memory": 536870912,
                  "max_cpu_time": 3000,
                  "max_real_time": 10000,
                  "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++14 {src_path} -lm -o {exe_path}"
              },
              "template": "//PREPEND BEGIN\n#include <iostream>\n//PREPEND END\n\n//TEMPLATE BEGIN\nint add(int a, int b) {\n  // Please fill this blank\n  return ___________;\n}\n//TEMPLATE END\n\n//APPEND BEGIN\nint main() {\n  std::cout << add(1, 2);\n  return 0;\n}\n//APPEND END"
          },
          "description": "G++ 5.4",
          "content_type": "text/x-c++src"
      },
      {
          "name": "Java",
          "config": {
              "run": {
                  "env": [
                      "LANG=en_US.UTF-8",
                      "LANGUAGE=en_US:en",
                      "LC_ALL=en_US.UTF-8"
                  ],
                  "command": "/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k -Djava.security.manager -Dfile.encoding=UTF-8 -Djava.security.policy==/etc/java_policy -Djava.awt.headless=true Main",
                  "seccomp_rule": null,
                  "memory_limit_check_only": 1
              },
              "compile": {
                  "exe_name": "Main",
                  "src_name": "Main.java",
                  "max_memory": -1,
                  "max_cpu_time": 3000,
                  "max_real_time": 5000,
                  "compile_command": "/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8"
              },
              "template": "//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END"
          },
          "description": "OpenJDK 1.8",
          "content_type": "text/x-java"
      },
      {
          "name": "Python2",
          "config": {
              "run": {
                  "env": [
                      "LANG=en_US.UTF-8",
                      "LANGUAGE=en_US:en",
                      "LC_ALL=en_US.UTF-8"
                  ],
                  "command": "/usr/bin/python {exe_path}",
                  "seccomp_rule": "general"
              },
              "compile": {
                  "exe_name": "solution.pyc",
                  "src_name": "solution.py",
                  "max_memory": 134217728,
                  "max_cpu_time": 3000,
                  "max_real_time": 10000,
                  "compile_command": "/usr/bin/python -m py_compile {src_path}"
              },
              "template": "//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END"
          },
          "description": "Python 2.7",
          "content_type": "text/x-python"
      },
      {
          "name": "Python3",
          "config": {
              "run": {
                  "env": [
                      "LANG=en_US.UTF-8",
                      "LANGUAGE=en_US:en",
                      "LC_ALL=en_US.UTF-8",
                      "PYTHONIOENCODING=utf-8",
                      "PYTHONIOENCODING=utf-8"
                  ],
                  "command": "/usr/bin/python3 {exe_path}",
                  "seccomp_rule": "general"
              },
              "compile": {
                  "exe_name": "__pycache__/solution.cpython-35.pyc",
                  "src_name": "solution.py",
                  "max_memory": 134217728,
                  "max_cpu_time": 3000,
                  "max_real_time": 10000,
                  "compile_command": "/usr/bin/python3 -m py_compile {src_path}"
              },
              "template": "//PREPEND BEGIN\n//PREPEND END\n\n//TEMPLATE BEGIN\n//TEMPLATE END\n\n//APPEND BEGIN\n//APPEND END"
          },
          "description": "Python 3.5",
          "content_type": "text/x-python"
      }
    ]
    storage.set(STORAGE_KEY.languages, languages)
    resolve(languages)
    // ojAPI.getLanguages().then(res => {
    //   let languages = res.data.data.languages
    //   storage.set(STORAGE_KEY.languages, languages)
    //   resolve(languages)
    // }, err => {
    //   reject(err)
    // })
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

export default {
  submissionMemoryFormat: submissionMemoryFormat,
  submissionTimeFormat: submissionTimeFormat,
  getACRate: getACRate,
  filterEmptyValue: filterEmptyValue,
  breakLongWords: breakLongWords,
  downloadFile: downloadFile,
  getLanguages: getLanguages,
  formatDate: formatDate,
  timeOut: timeOut,
  ratingColor: ratingColor,
  serializationDFS: serializationDFS,
  comparePath: comparePath
}
