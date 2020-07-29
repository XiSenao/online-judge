
const storage = window.sessionStorage

export default {
  name: 'sessionStorage',

  /**
   * save value(Object) to key
   * @param {string} key 键
   * @param {Object} value 值
   */
  set (key, value) {
    storage.setItem(key, JSON.stringify(value))
  },

  /**
   * get value(Object) by key
   * @param {string} key 键
   * @return {Object}
   */
  get (key) {
    return JSON.parse(storage.getItem(key)) || null
  },

  /**
   * remove key from sessionStorage
   * @param {string} key 键
   */
  remove (key) {
    storage.removeItem(key)
  },
  /**
   * clear all
   */
  clear () {
    storage.clear()
  }
}
