export default {
  data () {
    return {}
  },
  methods: {
    signUpRuleName (value) {
      if (value === '公开') {
        return this.$t('m.Public')
      } else if (value === '认证') {
        return this.$t('m.Proof')
      } else if (value === '密码') {
        return this.$t('m.Key')
      } 
      return this.$t('m.Registration_Rules')
    },
    ruleTypeName (value) {
      if (value === '练习') {
        return this.$t('m.Warm_Up')
      } else if (value === '积分') {
        return this.$t('m.Integral')
      } else if (value === 'ACM/ICPC') {
        return this.$t('m.ACM')
      } 
      return this.$t('m.Rule')
    },
    statusName (value) {
      if (value === '未开始') {
        return this.$t('m.Not_Started')
      } else if (value === '进行中') {
        return this.$t('m.Underway')
      } else if (value === '已结束') {
        return this.$t('m.Ended')
      } 
      return this.$t('m.Status')
    }
  }
}