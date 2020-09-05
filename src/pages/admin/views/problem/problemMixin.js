import api from '@/pages/admin/api'

export default {
  data () {
    return {
      cacheJudgeType: {
        funcMap: {
          getSpiderServer: 'spider',
          getJudgeUniqueStyleLists: 'judge'
        },
        spider: {
          value: null,
          time: 0
        },
        judge: {
          value: null,
          time: 0
        },
        cacheTime: 1 / 2 * 60 * 1000 // 30s
      },
      cacheTagList: {
        items: {
          value: null,
          time: 0
        },
        cacheTime: 1 / 4 * 60 * 1000 // 15s
      }
    }
  },
  methods: {
    querySearch (queryString, cb, cp) {
      const doTagList = curTagList => {
        let tagList = []
        let flag = false
        const backupTagList = []
        for (const tag of curTagList) {
          if ((queryString && !queryString.replace(/(^\s*)|(\s*$)/g, '')) || tag.name.indexOf(queryString) !== -1) {
            flag = true
            tagList.push({ id: tag.id, value: tag.name, status: tag.status })
          }
          backupTagList.push({ id: tag.id, value: tag.name, status: tag.status })
        }
        if (!flag) {
          tagList = backupTagList
        }
        cb && cb(tagList)
        cp && cp(tagList)
        return tagList
      }
      const { items: { value, time }, cacheTime } = this.cacheTagList
      if (time) {
        const current = new Date().getTime()
        if (current - time <= cacheTime) {
          return doTagList(value)
        }
      }
      api.getProblemTagList().then(res => {
        const curTagList = res.data.data
        this.cacheTagList.items = { value: curTagList, time: new Date().getTime() }
        doTagList(curTagList)
      }).catch((_) => {
        console.log(_)
        this.error('Error!')
      })
    },
    queryjudgeType (queryString, cb, cp) {
      const funcName = this.spiderFlag ? 'getSpiderServer' : 'getJudgeUniqueStyleLists'
      const cacheName = this.cacheJudgeType.funcMap[funcName]
      const { value, time } = this.cacheJudgeType[cacheName]
      let finalResult = null
      if (time) {
        const current = new Date().getTime()
        const limitTime = this.cacheJudgeType['cacheTime']
        if (current - time <= limitTime) {
          cp && cp(value)
          finalResult = queryString ? value.filter(res => res.value.indexOf(queryString) > -1) : value
          cb && cb(finalResult)
          return
        }
      }
      api[funcName]().then(res => {
        const judgeStyleLists = res.data.data
        const judgeAvailableStyleLists = []
        Object.keys(judgeStyleLists).forEach(item => {
          const now = judgeStyleLists[item]
          if (now.status) {
            judgeAvailableStyleLists.push({
              id: now.id,
              value: now.name,
              hostname: now.hostname
            })
          }
        })
        cp && cp(judgeAvailableStyleLists)
        finalResult = queryString ? judgeAvailableStyleLists.filter(res => res.value.indexOf(queryString) > -1)
				: judgeAvailableStyleLists
        this.judgeAvailableStyleLists = judgeAvailableStyleLists
        this.cacheJudgeType[cacheName] = { value: judgeAvailableStyleLists, time: new Date().getTime() }
        cb && cb(finalResult)
      })
    },
    closeTag (tag, obj) {
      obj.tags.splice(obj.tags.indexOf(tag), 1)
    },
    addTag (tagValue, obj) {
      tagValue = tagValue && tagValue.replace(/\s+/g, '')
      if (!tagValue) { return }
      const exitValue = !!obj.tags.find(res => res.value === tagValue)
      if (exitValue) {
        this.$Message.error('题目标签中已经存在')
        return
      }
      obj.tags.push({ id: null, value: tagValue })
      this.inputVisible = false
      this.tagInput = ''
    },
    handleJudgeTypeSelect (obj) {
      const judgeTypeValue = obj.judgeType
      if (!judgeTypeValue || !judgeTypeValue.replace(/\s+/g, '')) {
        return
      }
      this.queryjudgeType(null, null, judgeAvailableStyleLists => {
        const nowValue = judgeAvailableStyleLists
        const now = nowValue.find(res => res.value === judgeTypeValue)
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
