import api from '@/pages/admin/api'

export default {
  methods: {
		querySearch (queryString, cb, cp) {
			api.getProblemTagList().then(res => {
				let tagList = [], flag = false, backupTagList = []
				for (let tag of res.data.data) {
					if (!this.tagInput.replace(/(^\s*)|(\s*$)/g, '') || tag.name.indexOf(this.tagInput) !== -1) {
						flag = true
						tagList.push({id: tag.id, value: tag.name, status: tag.status})
					}
					backupTagList.push({id: tag.id, value: tag.name, status: tag.status})
				}
				if (!flag) {
					tagList = backupTagList
				}
				cb && cb(tagList)
				cp && cp(tagList) 
			}).catch(() => {
				this.error('Error!')
			})
		},
		queryjudgeType (queryString, cb, cp) {
			let funcName = this.spiderFlag ? 'getSpiderServer' : 'getJudgeUniqueStyleLists'
			api[funcName]().then(res => {
				let judgeStyleLists = res.data.data, judgeAvailableStyleLists = [], finalResult
				Object.keys(judgeStyleLists).forEach(item => {
					let now = judgeStyleLists[item]
					if (now.status) {
						judgeAvailableStyleLists.push({
							id: now.id,
							value: now.name,
							hostname: now.hostname
						})
					}
				})
				cp && cp(judgeAvailableStyleLists)
				finalResult = queryString ? judgeAvailableStyleLists.filter(res => res.value.indexOf(queryString) > -1) :
				judgeAvailableStyleLists
				this.judgeAvailableStyleLists = judgeAvailableStyleLists
				cb && cb(judgeAvailableStyleLists)
			})
		},
		closeTag (tag, obj) {
			obj.tags.splice(obj.tags.indexOf(tag), 1)
		},
		addTag (tagValue, obj) {
			tagValue = tagValue && tagValue.replace(/\s+/g, '')
			if (!tagValue) { return }
			let exitValue = !!obj.tags.find(res => res.value === tagValue)
			if (exitValue) {
				this.$Message.error('题目标签中已经存在')
				return
			}
			obj.tags.push({ id: null, value: tagValue })
			this.inputVisible = false
			this.tagInput = ''
		},
		handleJudgeTypeSelect (obj) {
			let judgeTypeValue = obj.judgeType
			if (!judgeTypeValue || !judgeTypeValue.replace(/\s+/g, '')) {
				return
			}
			this.queryjudgeType(null, null, judgeAvailableStyleLists => {
				let nowValue = judgeAvailableStyleLists
				let now = nowValue.find(res => res.value === judgeTypeValue)
				if (!now) {
					obj.judgeType = ''
					this.$Message.error('所填写的评测机不存在')
					return
				}
				this.inputJudgeTypeVisible = false
				obj.judgeTypeId = now.id
			})
		}
	}
}