<template>
  <Panel shadow>
    <div slot="title">{{ contest.title }}</div>
    <div slot="extra">
      <screen-full :height="18" :width="18" class="screen-full" />
      <Poptip trigger="hover" placement="left-start">
        <Icon type="android-settings" size="20" />
        <div id="switches" slot="content">
          <p>
            <span>{{ $t('m.Menu') }}</span>
            <i-switch v-model="showMenu" />
            <span>{{ $t('m.Chart') }}</span>
            <i-switch v-model="showChart" />
          </p>
          <p>
            <span>{{ $t('m.Auto_Refresh') }}(10s)</span>
            <i-switch :disabled="refreshDisabled" @on-change="handleAutoRefresh" />
          </p>
          <template v-if="isContestAdmin">
            <p>
              <span>{{ $t('m.RealName') }}</span>
              <i-switch v-model="showRealName" />
            </p>
            <p>
              <span>{{ $t('m.Force_Update') }}</span>
              <i-switch v-model="forceUpdate" :disabled="refreshDisabled" />
            </p>
          </template>
          <template>
            <Button type="primary" size="small" disabled @click="downloadRankCSV">{{ $t('m.download_csv') }}</Button>
          </template>
        </div>
      </Poptip>
    </div>
    <div v-show="showChart" class="echarts">
      <ECharts ref="chart" :options="options" auto-resize />
    </div>
    <Table ref="tableRank" :columns="columns" :data="dataRank" disabled-hover width="1600" height="600" />
    <Pagination
      :total="total"
      :page-size.sync="limit"
      :current.sync="page"
      show-sizer
      @on-change="getContestRankData"
      @on-page-size-change="getContestRankData(1)"
    />
  </Panel>
</template>
<script>
  import moment from 'moment'
  import { mapActions, mapGetters } from 'vuex'

  import Pagination from '@oj/components/Pagination'
  import ContestRankMixin from './contestRankMixin'
  import time from '@/utils/time'
  import utils from '@/utils/utils'

  export default {
    name: 'AcmContestRank',
    components: {
      Pagination
    },
    mixins: [ContestRankMixin],
    data () {
      return {
        total: 0,
        page: 1,
        contestID: '',
        columns: [
          {
            align: 'center',
            width: 50,
            fixed: 'left',
            render: (h, params) => {
              return h('span', {}, params.index + (this.page - 1) * this.limit + 1)
            }
          },
          {
            title: this.$i18n.t('m.User_User'),
            align: 'center',
            fixed: 'left',
            width: 150,
            render: (h, params) => {
              return h('a', {
                style: {
                  display: 'inline-block',
                  'max-width': '150px'
                },
                on: {
                  click: () => {
                    this.$router.push(
                      {
                        name: 'user-home',
                        query: { id: params.row.userId }
                      })
                  }
                }
              }, params.row.username)
            }
          },
          {
            title: 'AC / ' + this.$i18n.t('m.Total'),
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', {}, [
                h('span', {}, params.row.acNum + ' / '),
                h('a', {
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'contest-submission-list',
                        // todo: 查询比赛用户个人提交记录
                        query: { username: params.row.username }
                      })
                    }
                  }
                }, params.row.submitCount)
              ])
            }
          },
          {
            title: this.$i18n.t('m.TotalTime'),
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span', this.parseTotalTime(params.row.totalTime))
            }
          }
        ],
        dataRank: [],
        options: {
          title: {
            text: this.$i18n.t('m.Top_10_Teams'),
            left: 'center'
          },
          dataZoom: [
            {
              type: 'inside',
              filterMode: 'none',
              xAxisIndex: [0],
              start: 0,
              end: 100
            }
          ],
          toolbox: {
            show: true,
            feature: {
              saveAsImage: { show: true, title: this.$i18n.t('m.save_as_image') }
            },
            right: '5%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              axis: 'x'
            }
          },
          legend: {
            orient: 'vertical',
            y: 'center',
            right: 0,
            data: [],
            formatter: (value) => {
              return utils.breakLongWords(value, 16)
            },
            textStyle: {
              fontSize: 12
            }
          },
          grid: {
            x: 80,
            x2: 200
          },
          xAxis: [{
            type: 'time',
            splitLine: false,
            axisPointer: {
              show: true,
              snap: true
            }
          }],
          yAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [0]
            }],
          series: []
        }
      }
    },
    computed: {
      ...mapGetters({
        isContestAdmin: 'contest/isContestAdmin',
        profile: 'user/profile'
      })
    },
    mounted () {
      this.contestID = this.$route.params.contestID
      this.getContestRankData(1)
      if (this.contestProblems.length === 0) {
        this.getContestProblems().then((res) => {
          this.addTableColumns(res.data.data)
          this.addChartCategory(res.data.data)
        })
      } else {
        this.addTableColumns(this.contestProblems)
        this.addChartCategory(this.contestProblems)
      }
    },
    methods: {
      ...mapActions({
        getContestProblems: 'contest/getContestProblems'
      }),
      addChartCategory (contestProblems) {
        const category = []
        for (let i = 0; i <= contestProblems.length; ++i) {
          category.push(i)
        }
        this.options.yAxis[0].data = category
      },
      applyToChart (rankData) {
        const [users, seriesData] = [[], []]
        rankData.forEach(rank => {
          users.push(rank.username)
          const info = rank.submitMap
          // 提取已AC题目的时间
          const timeData = []
          Object.keys(info || []).forEach(problemID => {
            if (info[problemID].accept) {
              timeData.push(info[problemID].acceptTime)
            }
          })
          timeData.sort((a, b) => {
            return a - b
          })
          const data = []
          data.push([this.contest.startTime, 0])
          // index here can be regarded as stacked accepted number count.
          let index = 0
          for (const value of timeData) {
            // 将后端不标准时间(0:6:52, date对象无法识别)转化成秒s
            const currentTime = value.split(':')
            const hour = currentTime[0]
            const min = currentTime[1]
            const sec = currentTime[2]
            const s = Number(hour * 3600) + Number(min * 60) + Number(sec)

            const realTime = moment(this.contest.startTime).add(s, 'seconds').format()
            data.push([realTime, index++ + 1])
          }
          seriesData.push({
            name: rank.username,
            type: 'line',
            data
          })
        })
        this.options.legend.data = users
        this.options.series = seriesData
      },
      applyToTable (data) {
        // deepcopy
        // let dataRank = JSON.parse(JSON.stringify(data))
        const dataRank = data
        // 从submission_info中取出相应的problem_id 放入到父object中,这么做主要是为了适应iview table的data格式
        // 见https://www.iviewui.com/components/table
        dataRank.forEach((rank, i) => {
          const info = rank.submitMap
          const cellClass = {}
          Object.keys(info).forEach(problemID => {
            dataRank[i][problemID] = info[problemID]
            dataRank[i][problemID].acceptTime = time.secondFormat(dataRank[i][problemID].acceptTime)
            const status = info[problemID]
            if (status.firstBlood) {
              cellClass[problemID] = 'first-ac'
            } else if (status.accept) {
              cellClass[problemID] = 'ac'
            } else if (status.errorCount) {
              cellClass[problemID] = 'wa'
            }
          })
          dataRank[i].cellClassName = cellClass
        })
        this.dataRank = dataRank
      },
      addTableColumns (problems) {
        // 根据题目添加table column
        problems.forEach(problem => {
          this.columns.push({
            align: 'center',
            key: problem.id,
            width: problems.length > 15 ? 80 : null,
            renderHeader: (h, params) => {
              return h('a', {
                'class': {
                  'emphasis': true
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'contest-problem-details',
                      params: {
                        contestID: this.contestID,
                        problemID: problem.id,
                        creatorKey: this.profile.username
                      }
                    })
                  }
                }
              }, problem.id)
            },
            render: (h, params) => {
              if (params.row[problem.id]) {
                const status = params.row[problem.id]
                let acTime, errorNumber
                if (status.accept) {
                  acTime = h('span', status.acceptTime)
                }
                if (status.errorCount !== 0) {
                  errorNumber = h('p', '(-' + status.errorCount + ')')
                }
                return h('div', [acTime, errorNumber])
              }
            }
          })
        })
      },
      parseTotalTime (totalTime) {
        var m = moment.duration(totalTime, 's')
        return [Math.floor(m.asHours()), m.minutes(), m.seconds()].join(':')
      },
      downloadRankCSV () {
        // todo:
        // utils.downloadFile(`contest_rank?download_csv=1&contest_id=${this.$route.params.contestID}&force_refrash=${this.forceUpdate ? '1' : '0'}`)
      }
    }
  }
</script>
<style scoped lang="less">
  .echarts {
    margin: 20px auto;
    height: 400px;
    width: 98%;
  }

  .screen-full {
    margin-right: 8px;
  }

  #switches {
    p {
      margin-top: 5px;
      &:first-child {
        margin-top: 0;
      }
      span {
        margin-left: 8px;
      }
    }
  }
</style>
