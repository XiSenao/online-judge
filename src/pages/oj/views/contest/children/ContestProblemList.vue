<template>
  <div>
    <Panel>
      <div slot="title">{{ $t('m.Problems_List') }}</div>
      <Table
        v-if="contestRuleType == 'ACM/ICPC' || OIContestRealTimePermission"
        :columns="ACMTableColumns"
        :data="problems"
        :no-data-text="$t('m.No_Problems')"
        @on-row-click="goContestProblem"
      />
      <Table
        v-else
        :data="problems"
        :columns="OITableColumns"
        :no-data-text="$t('m.No_Problems')"
        @on-row-click="goContestProblem"
      />
    </Panel>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { ProblemMixin } from '@oj/components/mixins'

  export default {
    name: 'ContestProblemList',
    mixins: [ProblemMixin],
    data () {
      return {
        ACMTableColumns: [
          {
            title: '#',
            key: 'id',
            sortType: 'asc',
            width: 150
          },
          {
            title: this.$i18n.t('m.Title'),
            key: 'title'
          },
          {
            title: this.$i18n.t('m.Total'),
            key: 'submitCount'
          },
          {
            title: this.$i18n.t('m.AC_Rate'),
            key: 'acRate'
          }
        ],
        OITableColumns: [
          {
            title: '#',
            key: 'id',
            width: 150
          },
          {
            title: this.$i18n.t('m.Title'),
            key: 'title'
          }
        ]
      }
    },
    computed: {
      ...mapState({
        problems: state => state.contest.contestProblems
      }),
      ...mapGetters({
        isAuthenticated: 'user/isAuthenticated',
        contestRuleType: 'contest/contestRuleType',
        OIContestRealTimePermission: 'contest/OIContestRealTimePermission'
      })
    },
    mounted () {
      this.getContestProblems()
    },
    methods: {
      getContestProblems () {
        this.$store.dispatch('contest/getContestProblems').then(res => {
          if (this.isAuthenticated) {
            if (this.contestRuleType === 'ACM/ICPC') {
              this.addStatusColumn(this.ACMTableColumns, res.data.data)
            } else if (this.OIContestRealTimePermission) {
              this.addStatusColumn(this.ACMTableColumns, res.data.data)
            }
          }
        })
      },
      goContestProblem (row) {
        this.$router.push({
          name: 'contest-problem-details',
          params: {
            contestID: this.$route.params.contestID,
            problemID: row.id
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
</style>
