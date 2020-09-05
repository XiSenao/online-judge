<template>
  <div class="announcement view">
    <Panel :title="$t('m.General_Announcement')">
      <div class="list">
        <el-table
          ref="table"
          v-loading="loading"
          element-loading-text="loading"
          :data="announcementList"
          style="width: 100%">
          <el-table-column
            width="100"
            prop="id"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="title"
            label="Title">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="CreateTime">
            <template slot-scope="scope">
              {{ scope.row.crtTs | localtime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="last_update_time"
            label="LastUpdateTime">
            <template slot-scope="scope">
              {{ scope.row.lmTs | localtime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="created_by.username"
            label="Author">
            <template slot-scope="scope">
              {{ scope.row.creator }}
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            prop="status"
            label="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-text=""
                inactive-text=""
                @change="handleVisibleSwitch(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Option"
            width="200">
            <div slot-scope="scope">
              <icon-btn name="Edit" icon="edit" @click.native="openAnnouncementDialog(scope.row.id)"></icon-btn>
            </div>
          </el-table-column>
        </el-table>
        <div class="panel-options">
          <el-button icon="el-icon-plus" type="primary" size="small" @click="openAnnouncementDialog(null)">Create</el-button>
          <el-pagination
            v-if="!contestID"
            class="page"
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="currentChange">
          </el-pagination>
        </div>
      </div>
    </Panel>
    <!-- 编辑栏 -->
    <el-dialog :title="announcementDialogTitle"
               :visible.sync="showEditAnnouncementDialog"
               :close-on-click-modal="false"
               @open="onOpenEditDialog">
      <el-form label-position="top">
        <el-form-item :label="$t('m.Announcement_Title')" required>
          <el-input
            v-model="announcement.title"
            class="title-input"
            :placeholder="$t('m.Announcement_Title')">
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('m.Announcement_Content')" required>
          <Simditor v-model="announcement.content" />
        </el-form-item>
        <div class="visible-box">
          <span>{{ $t('m.Announcement_visible') }}</span>
          <el-switch
            v-model="announcement.status"
            active-text=""
            inactive-text="">
          </el-switch>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <cancel @click.native="showEditAnnouncementDialog = false"></cancel>
        <save type="primary" @click.native="submitAnnouncement"></save>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor.vue'
  import api from '../../api.js'

  export default {
    name: 'Announcement',
    components: {
      Simditor
    },
    data () {
      return {
        contestID: '',
        // 显示编辑公告对话框
        showEditAnnouncementDialog: false,
        // 公告列表
        announcementList: [],
        // 一页显示的公告数
        pageSize: 10,
        // 总公告数
        total: 0,
        // 当前公告id
        currentAnnouncementId: null,
        mode: 'create',
        // 公告 (new | edit) model
        announcement: {
          title: '',
          status: true,
          content: ''
        },
        // 对话框标题
        announcementDialogTitle: 'Edit Announcement',
        // 是否显示loading
        loading: true,
        // 当前页码
        currentPage: 0
      }
    },
    watch: {
      $route () {
        this.init()
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.contestID = this.$route.params.contestId
        this.currentPage = 1
        if (this.contestID) {
          this.getContestAnnouncementList()
        } else {
          this.getAnnouncementList()
        }
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getAnnouncementList(page)
      },
      // 对应接口: true 1 0 | 1 true false
      exchangeStatus (go, tol, tow) {
        Object.keys(this.announcementList).forEach(res => {
          const status = this.announcementList[res].status
          this.announcementList[res].status = status === go ? tol : tow
        })
      },
      getAnnouncementList () {
        this.loading = true
        api.getAnnouncementList(this.currentPage, this.pageSize).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.announcementList = res.data.data.records
          this.exchangeStatus(1, true, false)
        }, res => {
          this.loading = false
        })
      },
      getContestAnnouncementList () {
        this.loading = true
        api.getContestAnnouncementList(this.contestID).then(res => {
          this.loading = false
          this.announcementList = res.data.data
          this.exchangeStatus(1, true, false)
        }).catch(() => {
          this.loading = false
        })
      },
      // 打开编辑对话框的回调
      onOpenEditDialog () {
        // todo 优化
        // 暂时解决 文本编辑器显示异常bug
        setTimeout(() => {
          if (document.createEvent) {
            const event = document.createEvent('HTMLEvents')
            event.initEvent('resize', true, true)
            window.dispatchEvent(event)
          } else if (document.createEventObject) {
            window.fireEvent('onresize')
          }
        }, 0)
      },
      // 提交编辑
      // 默认传入MouseEvent
      submitAnnouncement (data = undefined) {
        let funcName = ''
        if (!data.title) {
          data = {
            id: this.currentAnnouncementId || null,
            title: this.announcement.title,
            content: this.announcement.content,
            status: this.announcement.status ? 1 : 0
          }
        }
        if (this.contestID) {
          data.contestId = this.contestID
          funcName = this.mode === 'edit' ? 'updateContestAnnouncement' : 'createContestAnnouncement'
        } else {
          funcName = this.mode === 'edit' ? 'updateAnnouncement' : 'createAnnouncement'
        }
        api[funcName](data).then(res => {
          this.showEditAnnouncementDialog = false
          this.init()
        }).catch()
      },
      openAnnouncementDialog (id) {
        this.showEditAnnouncementDialog = true
        if (id !== null) {
          this.currentAnnouncementId = id
          this.announcementDialogTitle = 'Edit Announcement'
          this.announcementList.find(item => {
            if (item.id === this.currentAnnouncementId) {
              this.announcement.title = item.title
              this.announcement.status = item.status
              this.announcement.content = item.content
              this.mode = 'edit'
            }
          })
        } else {
          this.announcementDialogTitle = 'Create Announcement'
          this.announcement.title = ''
          this.announcement.status = true
          this.announcement.content = ''
          this.mode = 'create'
        }
      },
      handleVisibleSwitch (row) {
        this.mode = 'edit'
        this.submitAnnouncement({
          id: row.id,
          title: row.title,
          content: row.content,
          status: row.status ? 1 : 0
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .title-input {
    margin-bottom: 20px;
  }

  .visible-box {
    margin-top: 10px;
    width: 205px;
    float: left;
  }
</style>
