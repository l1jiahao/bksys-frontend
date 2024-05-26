<template>
  <page-header-wrapper>
    <a-card
      :bordered="false"
      :title="displayName"
      :headStyle="{ 'text-align': 'center' }"
      :style="{ overflow: 'auto', width: cols * 250, height: '800px' }">
      <!-- <img
        slot="cover"
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        height="50px"
      /> -->
      <a-space size="large">
        <p>选择时间段:</p>
        <p>开始时间</p>
        <a-time-picker format="HH:mm" :minute-step="30" :value="startTime" @change="onStartChange" />
        <p>结束时间</p>
        <a-time-picker format="HH:mm" :minute-step="30" :value="endTime" @change="onEndChange" />
        <a-button type="primary" :disabled="isButtonDisabled" @click="handleQuery">查询</a-button>
      </a-space>
      <a-row v-for="i in rows" :key="i" :gutter="16">
        <a-space>
          <a-col v-for="j in cols" :key="j">
            <a-card
              :style="{ width: '150px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }">
              <template #title :style="{ align: 'center' }">
                <a-space>
                  <span>{{ i + '行' + j + '列' }}</span>
                  <a-tag v-if="isDeskAvali(i, j)" :color="getBonusTag(i, j)"> {{ getBonusContent(i, j) }}</a-tag>
                </a-space>
              </template>
              <a-button
                :type="isDeskAvali(i, j) ? 'primary' : 'disabled'"
                @click="doBooking(i, j)"
                :disabled="!isDeskAvali(i, j)">预约</a-button>
            </a-card>
          </a-col>
        </a-space>
      </a-row>
      <!-- <a-modal
        v-model="modalVisible"
        title="请选择预约时间段"
        centered
        @ok="handelBooking()"
      >
        <a-space>
          <p>开始时间</p>
          <a-time-picker format="HH:mm" :minute-step="30" :value="bookStartTime" @change="onBookStartChange" />
          <p>结束时间</p>
          <a-time-picker format="HH:mm" :minute-step="30" :value="bookEndTime" @change="onBookEndChange" />
        </a-space>
      </a-modal> -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { avaliDesk, bookDesk } from '@/api/classroom_mock'
export default {
  name: 'TestTable',
  data () {
    return {
      windowWidth: window.innerWidth,
      roomID: '',
      roomName: '',
      startTime: null,
      endTime: null,
      bookStartTime: null,
      bookEndTime: null,
      avaliDesks: [],
      modalVisible: false,
      selectCol: 0,
      selectRow: 0

    }
  },
  computed: {
    cardWidth () {
      return (this.windowWidth - 500) / (this.cols) + 'px'
    },
    displayName () {
      return '教室: ' + this.roomName + ' (' + this.rows + '行,' + this.cols + '列' + ')'
    },
    isButtonDisabled () {
      return !(this.startTime && this.endTime)
    }
  },
  created () {
    this.roomID = this.$route.query.room_id
    this.cols = Number(this.$route.query.col_count) || 0
    this.rows = Number(this.$route.query.row_count) || 0
    this.roomName = this.$route.query.room_name
    window.addEventListener('resize', this.updateWindowWidth)
  },
  destroyed () {
    window.removeEventListener('resize', this.updateWindowWidth)
  },
  methods: {
    updateWindowWidth () {
      this.windowWidth = window.innerWidth
    },
    onStartChange (time) {
      this.startTime = time
    },
    onEndChange (time) {
      this.endTime = time
    },
    onBookStartChange (time) {
      this.bookStartTime = time
    },
    onBookEndChange (time) {
      this.bookEndTime = time
    },
    getHourMinute (time) {
      const date = new Date(time)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    },
    async handleQuery () {
      var data = JSON.stringify({
        'room_id': this.roomID,
        'start_time': this.startTime.format('YYYY-MM-DD HH:mm:ss'),
        'end_time': this.endTime.format('YYYY-MM-DD HH:mm:ss')
      })
      const res = await avaliDesk(data).then(res => res.data.message.data)
      this.avaliDesks = res
    },
    isDeskAvali (row, col) {
      return this.avaliDesks.some(desk => desk.row_num === row && desk.col_num === col)
    },
    getDesk (row, col) {
      const selectDesk = this.avaliDesks.find(desk => desk.row_num === row && desk.col_num === col)
      if (!selectDesk) {
        return {
          bonus_id: 0
        }
      }
      return selectDesk
    },
    getBonusTag (row, col) {
      const bonusId = this.getDesk(row, col).bonus_id
      switch (bonusId) {
        case 1:
          return 'green'
        case 2:
          return 'blue'
        case 4:
          return 'yellow'
        default:
          return ''
      }
    },
    getBonusContent (row, col) {
      const bonusId = this.getDesk(row, col).bonus_id
      switch (bonusId) {
        case 1:
          return '电源'
        case 2:
          return '靠窗'
        case 3:
          return '普通'
        case 4:
          return '电源&靠窗'
        default:
          return ''
      }
    },
    doBooking (row, col) {
      // this.modalVisible = true
      this.selectCol = col
      this.selectRow = row
      this.handelBooking(row, col)
    },
    async handelBooking (row, col) {
      // 根据 row col 从 avaliDesk 中找到对应的 desk_id
      const selectDesk = this.getDesk(row, col)
      const param = JSON.stringify({
        'user_id': '4', // TODO: 从 store 中获取
        'seat_id': selectDesk.seat_id,
        'start_time': this.startTime.format('YYYY-MM-DD HH:mm:ss'),
        'end_time': this.endTime.format('YYYY-MM-DD HH:mm:ss')
      })
      const res = await bookDesk(param).then(res => {
        return res.data
      }).catch(err => {
        console.log(err)
        this.$message.error('预约失败, 请检查网络')
      })

      if (res.code === 1) {
        this.$message.success('预约成功')
        this.handleQuery()
      } else {
        this.$message.error(res.message.content)
      }
    }
  }
}
</script>
