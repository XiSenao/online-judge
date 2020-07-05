import utils from '@/utils/utils'

export default {
  data () {
    return {
      statusColumn: false
    }
  },
  methods: {
    getACRate (ACCount, TotalCount) {
      return utils.getACRate(ACCount, TotalCount)
    },
    addStatusColumn (tableColumns, dataProblems) {
      // 已添加过直接返回
      if (this.statusColumn) return
      // 只在有做题记录时才添加column
      // 在前面添加做题标记
      let sumMap = this.problemMap.ac.concat(this.problemMap.error)
      if (!sumMap.length) {
        return
      }
      let needAdd = dataProblems.some(item => sumMap.includes(item.id))
      if (!needAdd) {
        return
      }
      tableColumns.splice(0, 0, {
        width: 60,
        title: ' ',
        render: (h, params) => {
          let id = params.row.id, status = null
          if (!sumMap.includes(id)) {
            return 
          }
          status = this.problemMap.ac.includes(id)
          return h('Icon', {
            props: {
              type: status ? 'checkmark-round' : 'minus-round',
              size: '16'
            },
            style: {
              color: status ? '#19be6b' : '#ed3f14'
            }
          })
        }
      })
      this.statusColumn = true
    }
  }
}
