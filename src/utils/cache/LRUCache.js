import storage from './../storage'
import utils from './../utils'
class Node {
	constructor (key, value) {
		this.key = key
	    this.value = value
	    this.head = null
	    this.next = null
	}
} 
class LRUCache {
	constructor (capacity = CAPACITY) {
		this.init(capacity)
	}
	init = function (capacity = CAPACITY) {
		this.map = new Map()
	    this.capacity = capacity
	    this.header = null
	    this.ender = null
		this.size = 0
		this.running = false
		this.hitTimes = 0
	}
	get = function (key) {
        key = 'LRU$_' + key
		let node = this.map[key]
	    if (node) {
	        if (node === this.header && this.size > 1) {
	            let next = this.header.next
	            next.head = null
	            this.header = next
	            node.next = null
		        this.ender.next = node
		        node.head = this.ender
		        this.ender = node
	        } else if (node !== this.ender && this.size > 1) {
	            let go = node.head, to = node.next
	            go.next = to
	            to.head = go
	            node.next = null
		        this.ender.next = node
		        node.head = this.ender
		        this.ender = node
	        }
	        return JSON.parse(node.value)
	    }
	    return null
	}
	set = function (key, value) {
        if (this.capacity === 0 || key === undefined || value === undefined || !this.running) {
			return
        }
        key = typeof key === 'object' ? JSON.stringify(key) : key
		key = 'LRU$_' + key
        value = typeof value === 'object' ? JSON.stringify(value) : '' + value
        if (!utils.weight(key, value) || !this.trySet(key, value)) {
            return 
		}
		this.running = true
	    if (this.map[key]) {
	        let node = this.map[key]
	        node.value = value
	        if (node === this.header && this.size > 1) {
	            let nextNode = node.next
	            this.header = nextNode
	            nextNode.head = null
	            node.next = null
	            node.head = this.ender
	            this.ender.next = node
	            this.ender = node
	        } else if (this.ender !== node && this.size > 1) {
	            let go = node.head, to = node.next
	            go.next = to
	            to.head = go
	            node.next = null
	            this.ender.next = node
	            node.head = this.ender
	            this.ender = node
	        } 
	    } else {
	        let newNode = new Node(key, value)
	        if (this.size < this.capacity) {
	            if (this.header === null) {
	                this.header = newNode
	                this.ender = newNode
	            } else {
	                this.ender.next = newNode
	                newNode.head = this.ender
	                this.ender = newNode
	            }
	            this.size++
	        } else {
	            if (this.header) {
	                if (this.header !== this.ender) {
	                    let remove = this.header
	                    let back = this.header.next
	                    back.head = null  
	                    this.header = back
                        this.map[remove.key] = null
                        storage.remove(remove.key)
	                    this.ender.next = newNode
	                    newNode.head = this.ender
	                    this.ender = newNode
	                } else {
                        this.map[this.header.key] = null
                        storage.remove(this.header.key)
	                    this.header = newNode
	                    this.ender = newNode 
	                }
	            }
	        }
            this.map[key] = newNode
	    }
    }
    trySet = function (key, value) {
        try {
            storage.set(key, value)
        } catch (e) {
            if (this.header) {
				if (++this.hitTimes > CAPACITY) {
					this.running = false
					this.hitTimes = 0
					return false
				}
                if (this.header !== this.ender) {
                    let remove = this.header
                    let back = this.header.next
                    back.head = null  
                    this.header = back
                    this.map[remove.key] = null
                    storage.remove(remove.key)
                    this.ender.next = newNode
                    newNode.head = this.ender
                    this.ender = newNode
                } else {
                    this.map[this.header.key] = null
                    storage.remove(this.header.key)
                    this.header = newNode
                    this.ender = newNode 
                }
            } else {
                return false
            }
            return this.trySet(key, value)
        } 
        return true
	}
	clearCache = function () {
		storage.clearCache('LRU')
	}
	getDuplicate = function () {
		return storage.getDuplicate('LRU')
	}
}
const CAPACITY = 8
const cache = new LRUCache()

export default cache