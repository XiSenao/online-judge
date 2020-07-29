import Cookies from 'js-cookie'
let storage = null, available = true
if (window.localStorage) {
  storage = window.localStorage
} else {
  available = false
  storage = Cookies
}
export default {
  name: 'storage',

  /**
   * save value(Object) to key
   * @param {string} key 键
   * @param {Object} value 值
   */
  set (key, value) {
    if (available) {
      storage.setItem(key, JSON.stringify(value))
    } else {
      storage.set(key, value)
    }
  },

  /**
   * get value(Object) by key
   * @param {string} key 键
   * @return {Object}
   */
  get (key) {
    if (available) {
      return JSON.parse(storage.getItem(key)) || null
    } else {
      return storage.get(key)
    }
  },

  /**
   * remove key from localStorage
   * @param {string} key 键
   */
  remove (key) {
    if (available) {
      storage.removeItem(key)
    } else {
      storage.remove(key)
    }
  },
  /**
   * clear all
   */
  clear () {
    if (available) {
      storage.clear()
    }
  },
  
  clearCache (name) {
    if (available) {
      for (let param in storage) {
        if (storage.hasOwnProperty(param) && !param.indexOf(`${ name }$_`)) {
          storage.removeItem(param)
        }
      }
    }
  },

  getDuplicate (name) {
    let duplicateArr = []
    for (let param in storage) {
      if (storage.hasOwnProperty(param) && !param.indexOf(`${ name }$_`)) {
        duplicateArr.push({
          key: param.slice(name.length + 2),
          value: storage.getItem(param)
        })
        storage.removeItem(param)
      }
    }
    return duplicateArr
  }
}
