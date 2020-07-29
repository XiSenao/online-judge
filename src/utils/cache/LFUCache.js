import storage from './../storage'
import utils from './../utils'
class Node {
	constructor (key, val, weight = 1) {
		this.key = key
		this.val = val
		this.freq = weight
		this.pre = null
		this.post = null
	}
}
class DoublyLinkedList {
	constructor () {
		this.head = new Node()
		this.tail = new Node()
		this.head.post = this.tail
		this.tail.pre = this.head
	}
	removeNode = function (node) {
		node.pre.post = node.post
		node.post.pre = node.pre
	}
	addNode = function (node) {
		node.post = this.head.post
		this.head.post.pre = node
		this.head.post = node
		node.pre = this.head
	}
}
class LFUCache {
	constructor (capacity = CAPACITY) {
		this.capacity = capacity
		this.size = 0
		this.minFreq = 0
		this.cacheMap = new Map()
		this.freqMap = new Map()
		this.running = true
		this.hitTimes = 0
	}
	get = function (key) {
		key = 'LFU$_' + key
		if (!this.cacheMap.has(key)) {
			return null
		}
		const node = this.cacheMap.get(key)
		this.incFreq(node)
		return JSON.parse(node.val)
	}
	set = function (key, value) {
		if (this.capacity === 0 || key === undefined || value === undefined || !this.running) {
			return
		}
		key = typeof key === 'object' ? JSON.stringify(key) : key
		key = 'LFU$_' + key
		value = typeof value === 'object' ? JSON.stringify(value) : '' + value
		const node = this.cacheMap.get(key), weight = utils.weight(key, value)
		if (!weight || !this.trySet(key, value)) {
			return
		}
		this.running = true
		if (node) {
			node.val = value
			this.incFreq(node)
		} else {
			if (this.capacity <= this.size) {
				const minFreqLinkedList = this.freqMap.get(this.minFreq)
				this.cacheMap.delete(minFreqLinkedList.tail.pre.key)
				storage.remove(minFreqLinkedList.tail.pre.key)
				minFreqLinkedList.removeNode(minFreqLinkedList.tail.pre)
				this.size--
			}
			const newNode = new Node(key, value, weight)
			this.cacheMap.set(key, newNode)
			let linkedList = this.freqMap.get(weight)
			if (!linkedList) {
				linkedList = new DoublyLinkedList()
				this.freqMap.set(weight, linkedList)
			}
			linkedList.addNode(newNode)
			this.size++
			this.minFreq = Math.min(weight, this.minFreq) || weight
		}
	}
	incFreq = function (node) {
		let freq = node.freq
		let linkedList = this.freqMap.get(freq)
		linkedList.removeNode(node)
		if (freq === this.minFreq && linkedList.head.post === linkedList.tail) {
			this.minFreq = freq + 1
		}
		node.freq++
		linkedList = this.freqMap.get(freq + 1)
		if (!linkedList) {
			linkedList = new DoublyLinkedList()
			this.freqMap.set(freq + 1, linkedList)
		}
		linkedList.addNode(node)
	}
	trySet = function (key, value) {
		if (this.size === -1) {
			return false
		}
		try {
			storage.set(key, value)
		} catch (e) {
			const minFreqLinkedList = this.freqMap.get(this.minFreq)
			this.cacheMap.delete(minFreqLinkedList.tail.pre.key)
			storage.remove(minFreqLinkedList.tail.pre.key)
			minFreqLinkedList.removeNode(minFreqLinkedList.tail.pre)
			this.size--
			if (++this.hitTimes > CAPACITY) {
				this.running = false
				this.hitTimes = 0
				return false
			}
			return this.trySet(key, value)
		}
		return true
	}
	clearCache = function () {
		storage.clearCache('LFU')
	}
	getDuplicate = function () {
		return storage.getDuplicate('LFU')
	}
}
const CAPACITY = 8
const Cache = new LFUCache()

export default Cache