<template>
  <Row type="flex" justify="space-around">
    <Col :span="22">
    <panel v-if="contests.length" shadow class="contest">
      <div slot="title">
        <Button type="text" class="contest-title" @click="goContest">{{ contests[index].title }}</Button>
      </div>
      <Carousel v-model="index" trigger="hover" autoplay :autoplay-speed="6000" class="contest">
        <CarouselItem v-for="contest of contests" :key="contest">
          <div class="contest-content">
            <div class="contest-content-tags">
              <Button type="info" shape="circle" size="small" icon="calendar">
                {{ contest.startTime }}
              </Button>
              <Button type="success" shape="circle" size="small" icon="android-time">
                {{ getDuration(contest.startTime, contest.endTime) }}
              </Button>
              <Button type="error" shape="circle" size="small" icon="ribbon-a">
                {{ contest.signUpRule }}
              </Button>
              <Button type="warning" shape="circle" size="small" icon="trophy">
                {{ contest.rankModel }}
              </Button>
            </div>
            <div class="contest-content-description">
              <blockquote v-html="'--'"></blockquote>
            </div>
          </div>
        </CarouselItem>
      </Carousel>
    </panel>
    <Announcements class="announcement" />
    </Col>
  </Row>
</template>

<script>
  import Announcements from './Announcements.vue'
  import api from '@oj/api'
  import time from '@/utils/time'

  export default {
    name: 'Home',
    components: {
      Announcements
    },
    data () {
      return {
        contests: [],
        index: 0
      }
    },
    mounted () {
      api.getContestList(this.buildQuery()).then(res => {
        this.contests = res.data.data.records
      })
    },
    methods: {
      buildQuery () {
        return {
          contestRunningStatus: '未开始',
          pageModel: {
            limit: 5,
            offset: 1,
            paramData: null
          },
          rankModel: null,
          signUpRule: null,
          titleKey: null
        }
      },
      getDuration (startTime, endTime) {
        return time.duration(startTime, endTime)
      },
      goContest () {
        this.$router.push({
          name: 'contest-details',
          params: { contestID: this.contests[this.index].id }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .contest {
    &-title {
      font-style: italic;
      font-size: 21px;
    }
    &-content {
      padding: 0 70px 40px 70px;
      &-description {
        margin-top: 25px;
      }
    }
  }

  .announcement {
    margin-top: 20px;
  }
</style>
