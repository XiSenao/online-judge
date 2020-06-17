<template>
  <Row type="flex" :gutter="18">
    <Col :span=19>
    <Panel shadow>
      <div slot="title">{{$t('m.Problem_List')}}</div>
      <div slot="extra">
        <ul class="filter">
          <li>
            <Dropdown @on-click="filterByDifficulty">
              <span>{{!query.difficulty ? this.$i18n.t('m.Difficulty') : this.$i18n.t('m.' + query.difficulty.charAt(0).toUpperCase() + query.difficulty.slice(1))}}
                <Icon type="arrow-down-b"></Icon>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item name="">{{$t('m.All')}}</Dropdown-item>
                <Dropdown-item name="easy">{{$t('m.Easy')}}</Dropdown-item>
                <Dropdown-item name="medium" >{{$t('m.Medium')}}</Dropdown-item>
                <Dropdown-item name="hard">{{$t('m.Hard')}}</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </li>
          <!-- 后端未提供合适API 
          <li> 
            <i-switch size="large" @on-change="handleTagsVisible">
              <span slot="open">{{$t('m.Tags')}}</span>
              <span slot="close">{{$t('m.Tags')}}</span>
            </i-switch>
          </li> -->
          <li>
            <Input v-model="query.keyword"
              @on-enter="filterByKeyword"
              @on-click="filterByKeyword"
              placeholder="keyword"
              icon="ios-search-strong"/>
          </li>
          <li>
            <Button type="info" @click="onReset">
              <Icon type="refresh"></Icon>
              {{$t('m.Reset')}}
            </Button>
          </li>
        </ul>
      </div>
      <Table style="width: 100%; font-size: 16px;"
             :columns="problemTableColumns"
             :data="problemList"
             :loading="loadings.table"
             disabled-hover></Table>
    </Panel>
    <Pagination :total="total" :page-size="limit" @on-change="pushRouter" :current.sync="query.page"></Pagination>

    </Col>

    <Col :span="5">
    <Panel :padding="10">
      <div slot="title" class="taglist-title">{{$t('m.Tags')}}</div>
      <Button v-for="tag in tagList"
              :key="tag.name"
              @click="filterByTag(tag.id)"
              type="ghost"
              :disabled="query.tag === tag.id"
              shape="circle"
              class="tag-btn">{{tag.name}}
      </Button>

      <Button long id="pick-one" @click="pickone">
        <Icon type="shuffle"></Icon>
        {{$t('m.Pick_One')}}
      </Button>
    </Panel>
    <Spin v-if="loadings.tag" fix size="large"></Spin>
    </Col>
  </Row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '@oj/api'
  import utils from '@/utils/utils'
  import { ProblemMixin } from '@oj/components/mixins'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'ProblemList',
    mixins: [ProblemMixin],
    components: {
      Pagination
    },
    data () {
      return {
        tagList: [],
        difficulty: '',
        problemTableColumns: [
          {
            title: '#',
            key: 'id',
            width: 80,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row.id}})
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row.id)
            }
          },
          {
            title: this.$i18n.t('m.Title'),
            width: 400,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row.id}})
                  }
                },
                style: {
                  padding: '2px 0',
                  overflowX: 'auto',
                  textAlign: 'left',
                  width: '100%'
                }
              }, params.row.title)
            }
          },
          {
            title: this.$i18n.t('m.Level'),
            render: (h, params) => {
              let t = params.row.level
              let color = 'blue'
              if (t === 'easy') color = 'green'
              else if (t === 'hard') color = 'yellow'
              return h('Tag', {
                props: {
                  color: color
                }
              }, this.$i18n.t('m.' + params.row.level.charAt(0).toUpperCase() + params.row.level.slice(1)))
            }
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
        problemList: [],
        limit: 20,
        total: 0,
        loadings: {
          table: true,
          tag: true
        },
        routeName: '',
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init (simulate = false) {
        this.routeName = this.$route.name
        let query = this.$route.query
        this.query.difficulty = query.difficulty || null
        this.query.keyword = query.keyword || null
        this.query.tag = query.tag 
        this.query.page = parseInt(query.page) || 1
        if (!simulate) {
          this.getTagList()
        }
        this.getProblemList()
      },
      pushRouter () {
        this.$router.push({
          name: 'problem-list',
          query: this.query
        })
      },
      getProblemList () {
        let offset = this.query.page
        this.loadings.table = true
        let query = {
          level: this.query.difficulty,
          pageModel: {
            limit: this.limit,
            offset: offset,
            paramData: null
          },
          tagId: this.query.tag,
	        titleKey: this.query.keyword
        }
        api.getProblemList(query).then(res => {
          this.loadings.table = false
          this.total = res.data.data.total
          this.problemList = res.data.data.records
          if (this.isAuthenticated) {
            this.addStatusColumn(this.problemTableColumns, res.data.data.records)
          }
        }, res => {
          this.loadings.table = false
        })
      },
      getTagList () {
        api.getProblemTagList().then(res => {
          this.tagList = res.data.data
          this.loadings.tag = false
        }, res => {
          this.loadings.tag = false
        })
      },
      filterByTag (tagName) {
        this.query.tag = tagName
        this.query.page = 1
        this.pushRouter()
      },
      filterByDifficulty (difficulty) {
        this.query.difficulty = difficulty
        this.query.page = 1
        this.pushRouter()
      },
      filterByKeyword () {
        this.query.page = 1
        this.pushRouter()
      },
      handleTagsVisible (value) {
        if (value) {
          this.problemTableColumns.push(
            {
              title: this.$i18n.t('m.Tags'),
              align: 'center',
              render: (h, params) => {
                let tags = []
                params.row.tags.forEach(tag => {
                  tags.push(h('Tag', {}, tag))
                })
                return h('div', {
                  style: {
                    margin: '8px 0'
                  }
                }, tags)
              }
            })
        } else {
          this.problemTableColumns.splice(this.problemTableColumns.length - 1, 1)
        }
      },
      onReset () {
        this.$router.push({name: 'problem-list'})
      },
      pickone () {
        let total = this.total
        let randomNum = Math.floor(Math.random() * total) + 1
        let consult = Math.floor(randomNum / this.limit)
        let remainder = randomNum % this.limit
        let page = consult, limit = remainder
        if (!consult) {
          page = 1
        }
        if (!remainder) {
          page -= 1
          limit = this.limit
        }
        let query = {
          level: null,
          pageModel: {
            limit: this.limit,
            offset: page,
            paramData: null
          },
          tagId: null,
	        titleKey: null
        }
        api.getProblemList(query).then(res => {
          this.$success('Good Luck')
          let current = res.data.data.records[limit - 1]
          this.$router.push({name: 'problem-details', params: {problemID: current.id}})
        })
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'user/isAuthenticated'
      })
    },
    watch: {
      '$route' (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init(true)
        }
      },
      'isAuthenticated' (newVal) {
        if (newVal === true) {
          this.init()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .taglist-title {
    margin-left: -10px;
    margin-bottom: -10px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #pick-one {
    margin-top: 10px;
  }
</style>
