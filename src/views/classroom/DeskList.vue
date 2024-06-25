<template>
  <page-header-wrapper>
    <a-card
      :bordered="false"
      :headStyle="{ 'text-align': 'center' }"
      :style="{ overflow: 'auto', width: cols * 250, height: '800px' }">
      <template slot="title">
        {{ displayName }}
        <span v-if="showCaptcha" style="color: red;">签到码: {{ captcha }}</span>
      </template>
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
                  <a-tag v-if="isDeskAvali(i, j)" :color="getBonusTag(i, j)" @click="onTagClick(i, j)"> {{ getBonusContent(i, j) }}</a-tag>
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
      <a-modal v-model="modalVisible" title="预约" @ok="handleModalOk">
        <a-select default-value="3" style="width: 120px" @change="handleChange">
          <a-select-option value="3">
            普通
          </a-select-option>
          <a-select-option value="1">
            电源
          </a-select-option>
          <a-select-option value="2">
            靠窗
          </a-select-option>
          <a-select-option value="4">
            电源靠窗
          </a-select-option>
        </a-select>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import { avaliDesk, bookDesk, getCaptcha, alterDeskStatus } from '@/api/classroom_mock'
import storage from 'store'
export default {
  name: 'TestTable',
  data () {
    return {
      windowWidth: window.innerWidth,
      deskStatus: 3,
      captcha: '',
      roomID: '',
      roomName: '',
      startTime: null,
      endTime: null,
      bookStartTime: null,
      bookEndTime: null,
      avaliDesks: [],
      modalVisible: false,
      selectCol: 0,
      selectRow: 0,
      role_id: storage.get('role_id'),
      showCaptcha: false

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
    },
    cardTitle () {
      return this.showCaptcha ? this.displayName + ' <span style="color: red;">签到码</span>' : this.displayName
    }
  },
  created () {
    this.roomID = this.$route.query.room_id
    this.handleCaptcha()
    this.cols = Number(this.$route.query.col_count) || 0
    this.rows = Number(this.$route.query.row_count) || 0
    this.roomName = this.$route.query.room_name
    this.showCaptcha = this.role_id !== '1'
    window.addEventListener('resize', this.updateWindowWidth)
  },
  destroyed () {
    window.removeEventListener('resize', this.updateWindowWidth)
  },
  methods: {
    openNotification () {
      const key = `open${Date.now()}`
      this.$notification.open({
        message: '预约通知',
        duration: 0,
        description:
          '在预约时间之前15分钟会有邮件推送提醒；在预约时间之后10分钟如果还未签到，则会再次提醒；预约时间15分钟后如果还未签到，则自动取消预约、释放座位，并再次提醒，同时后台记录一次违约。',
        btn: h => {
          return h(
            'a-button',
            {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => this.$notification.close(key)
              }
            },
            'Confirm'
          )
        },
        key,
        onClose: close
      })
    },
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
      this.selectCol = col
      this.selectRow = row
      this.handelBooking(row, col)
    },
    async handelBooking (row, col) {
      // 根据 row col 从 avaliDesk 中找到对应的 desk_id
      const selectDesk = this.getDesk(row, col)
      const param = JSON.stringify({
        'user_id': storage.get('user_id'), // TODO: 从 store 中获取
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
        this.openNotification()
        this.handleQuery()
      } else {
        this.$message.error(res.message.content)
      }
    },
    async handleCaptcha () {
      const params = JSON.stringify({
        'room_id': Number(this.roomID)
      })
      await getCaptcha(params).then(res => {
        const result = res.data
        // console.log(result)
        if (result.code === 1) {
          this.captcha = result.message.check_code
        } else {
          this.$message.error('获取验证码失败')
        }
      }
      ).catch(err => {
        console.log(err)
        // this.$message.error('获取验证码失败, 请检查网络')
      })
    },
    onTagClick (row, col) {
      if (this.role_id !== '2') {
        return
      }
      this.selectCol = col
      this.selectRow = row
      this.modalVisible = true
    },
    handleModalOk () {
      this.modalVisible = false
      const params = {
        seat_id: this.getDesk(this.selectRow, this.selectCol).seat_id,
        bonus_id: this.deskStatus
      }
      alterDeskStatus(params).then(res => {
        if (res.data.code === 1) {
          this.$message.success('修改成功')
          this.handleQuery()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    handleChange (value) {
      this.deskStatus = value
    }
  }
}
</script>
