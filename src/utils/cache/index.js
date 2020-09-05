import LFUCache from './LFUCache'
import LRUCache from './LRUCache'
import Vue from 'vue'
const TIME = 2 * 60 * 1000
let cache = LFUCache
let timer = null
function exchangeInfomation (oldCache, newCache) {
  const localCacheArr = oldCache.getDuplicate()
  newCache.init()
  newCache.running = true
  for (const param of localCacheArr) {
    const { key, value } = param
    newCache.set(key, value)
    newCache.size++
  }
}
const cycleRun = function () {
  if (timer) {
    return
  }
  timer = setTimeout(() => {
    if (!cache.running) {
      console.log('%c Cache Changed!', 'color: #73c9e5; font-weight:600')
      const anotherCache = caches === LFUCache ? LFUCache : LRUCache
      exchangeInfomation(cache, anotherCache)
      cache = anotherCache
    } else {
      cache.hitTimes = 0
    }
    Vue.prototype.cache = cache
    timer = null
    cycleRun()
  }, TIME)
}
cycleRun()

Vue.prototype.cache = cache
