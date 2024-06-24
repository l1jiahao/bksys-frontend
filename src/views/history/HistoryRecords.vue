<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="content">
          <div class="content-title">
            {{ timeFixInfo }}, {{ username }}
            <span class="welcome-text">,{{ '来一次酣畅淋漓的自习吧!' }}</span>
          </div>
          <div> 计算机学院 | 2019 级</div>
        </div>
        <div>
          <a-row :gutter="12">
            <a-col :span="8" class="stat-column">
              <a-statistic title="预约次数" :value="numTotal" style="padding: 10px;">
              </a-statistic>
            </a-col>
            <a-col :span="8" class="stat-column">
              <a-statistic title="已签到" :value="numSignedIn" class="demo-class" style="padding: 10px;">
              </a-statistic>
            </a-col>
            <a-col :span="8" class="stat-column">
              <a-statistic title="未签到" :value="numNotSignedIn" class="demo-class" style="padding: 10px;">
              </a-statistic>
            </a-col>
          </a-row>
        </div>
      </div>
    </template>

    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="records" :pagination="{ pageSize: 10 }" >
        <a-tag slot="status_id" slot-scope="tags" :color="tags === '未签到' ? 'green' : tags === '违约' ? 'red' : 'gray'">
          {{ tags }}
        </a-tag>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleCheckIn(record)">签到</a>
            <a-divider type="vertical" />
            <a @click="handleCancelRe(record)">取消预约</a>
            <a-divider type="vertical" />
            <a @click="handleBooking(record)">再次预约</a>
          </template>
        </span>
      </a-table>
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />

      <a-modal
        title="再次预约"
        :width="640"
        :visible="bookingVisible"
        @ok="handleBookingOk"
        @cancel="handleBookingCancel"
      >
        <div class="row">
          <div class="cell">建筑名: {{ selectBuilding }}</div>
          <div class="cell">楼层: {{ selectFloor }}</div>
          <div class="cell">教室名: {{ selectRoom }}</div>
        </div>
        <div class="row">
          <div class="cell">座位行: {{ selectRow }}</div>
          <div class="cell">座位列: {{ selectCol }}</div>
        </div>
        <div class="row">
          <a-date-picker :value="selectDate" @change="onDateChange">
          </a-date-picker>
          <span> 开放时间 </span>
          <a-time-picker format="HH:mm" :minute-step="30" :value="selectStartTime" @change="onStartChange">
          </a-time-picker>
          <a-divider type="vertical" />
          <span> 结束时间 </span>
          <a-time-picker format="HH:mm" :minute-step="30" :value="selectEndTime" @change="onEndChange">
          </a-time-picker>
        </div>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { findRecord, checkIn, cancelCheckIn, recordAddress } from '@/api/history_mock'
import { bookDesk } from '@/api/classroom_mock'
import CreateForm from './modules/CreateForm'
import storage from 'store'
import { timeFix } from '@/utils/util'

const columns = [
    {
        title: '状态',
        dataIndex: 'status_id',
        scopedSlots: { customRender: 'status_id' },
        filters: [
            { text: '未签到', value: '未签到' },
            { text: '已签到', value: '已签到' },
            { text: '违约', value: '违约' },
            { text: '已取消', value: '已取消' }
        ],
        onFilter: (value, record) => record.status_id.indexOf(value) === 0
    },
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        scopedSlots: { customRender: 'date' },
        sorter: (a, b) => a.date.localeCompare(b.date)
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'start_time',
        scopedSlots: { customRender: 'start_time' },
        sorter: (a, b) => {
        const [hourA, minuteA] = a.startTime.split(':').map(Number)
        const [hourB, minuteB] = b.startTime.split(':').map(Number)
        return hourA * 60 + minuteA - (hourB * 60 + minuteB)
      }
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'end_time',
        scopedSlots: { customRender: 'end_time' },
        sorter: (a, b) => {
        const [hourA, minuteA] = a.endTime.split(':').map(Number)
        const [hourB, minuteB] = b.endTime.split(':').map(Number)
        return hourA * 60 + minuteA - (hourB * 60 + minuteB)
      }
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: '150px',
        scopedSlots: { customRender: 'action' }
    }
]

// TODO: 只有待签到记录可以点击签到；user_id的逻辑调整；
// TODO LATER: 取消预约（通过12）；根据状态不同显示“签到或取消”以及“再次预约”（通过11）

export default {
    name: 'TableList',
    components: {
        STable,
        Ellipsis,
        CreateForm
    },
    data () {
        this.columns = columns
        this.username = storage.get('username')
        return {
        // create model
        visible: false,
        bookingVisible: false,
        confirmLoading: false,
        mdl: null,
        // 查询参数
        user_id: null,
        records: [],
        selectBuilding: null,
        selectFloor: null,
        selectRoom: null,
        selectRow: null,
        selectCol: null,
        selectStartTime: null,
        selectEndTime: null,
        selectDate: null,
        selectSeatId: null
        }
    },
    created () {
        // this.user_id = localStorage.getItem('user_id')
        this.user_id = storage.get('user_id')
        this.handleFindRecord()
    },
    computed: {
      timeFixInfo () {
        return timeFix()
      },
      numTotal () {
        return this.records.length
      },
      numSignedIn () {
        return this.records.filter(record => record.status_id === '已签到').length
      },
      numNotSignedIn () {
        return this.records.filter(record => record.status_id === '未签到').length
      }
    },
    methods: {
        async handleFindRecord () {
            const requestParameters = { user_id: this.user_id }
            const statusMap = {
              1: '未签到',
              2: '已签到',
              3: '违约',
              4: '已取消'
            }
            const statistics = {
              total: 0,
              signedIn: 0,
              notSignedIn: 0
            }
            try {
              const res = await findRecord(requestParameters).then(res => res.data.message.data)
              this.records = res.map(item => {
                const [date, startTime] = item.startTime.split('T')
                const [startTimeHour, startTimeMinute] = startTime.split(':')
                const [, endTime] = item.endTime.split('T')
                const [endTimeHour, endTimeMinute] = endTime.split(':')
                    // 更新统计数据
                statistics.total++
                if (item.status_id === 2) {
                  statistics.signedIn++
                } else if (item.status_id === 1) {
                  statistics.notSignedIn++
                }
                return {
                  ...item,
                  date,
                  startTime: `${startTimeHour}:${startTimeMinute}`,
                  endTime: `${endTimeHour}:${endTimeMinute}`,
                  status_id: statusMap[item.status_id]
                }
              })
                // console.log(this.records)
            } catch (error) {
                console.error('Error fetching records:', error)
            }
        },
        handleCheckIn (record) {
            this.visible = true
            this.mdl = { ...record }
            // console.log(record)
        },
        handleCancel () {
            this.visible = false
            const form = this.$refs.createModal.form
            form.resetFields()
        },
        handleOk () {
          const form = this.$refs.createModal.form
          this.confirmLoading = true
          form.validateFields((errors, values) => {
            if (!errors) {
              console.log('values', values)
              new Promise((resolve, reject) => {
                this.handleValidation(this.mdl.record_id, values.check_code).then(result => {
                  console.log(result)
                  resolve(result)
                }).catch(error => {
                  reject(error)
                })
              }).then(res => {
                this.visible = false
                this.confirmLoading = false
                form.resetFields()
                if (res === true) {
                  this.$message.info('签到成功！')
                  // refresh the table here
                  this.handleFindRecord()
                } else {
                  this.$message.warning('签到失败！')
                }
              }).catch(error => {
                this.confirmLoading = false
                this.$message.info('签到失败！')
                console.error('签到失败，错误信息：', error)
              })
            } else {
              this.confirmLoading = false
              this.$message.info('签到失败！')
            }
          })
        },
        async handleValidation (id, code) {
          const requestParameters = { record_id: id, check_code: code }
          try {
                console.log(requestParameters)
                const res = await checkIn(requestParameters)
                const result = res.data
                console.log(result)
                if (result.code === 1) {
                  this.handleFindRecord()
                  return true
                } else return false
            } catch (error) {
                console.error('Error fetching records:', error)
            }
        },
        handleCancelRe (record) {
          const params = {
            record_id: record.record_id,
            status_id: 4
          }
          cancelCheckIn(params).then(res => {
            if (res.data.code === 1) {
              this.$message.success('取消预约成功')
              this.handleFindRecord()
            } else {
              this.$message.error('取消预约失败')
            }
          }).catch(err => {
            console.log(err)
            this.$message.error('取消预约失败, 请检查网络')
          })

          console.log(record)
        },
        handleBooking (record) {
          this.bookingVisible = true
          const params = {
            record_id: record.record_id
          }
          this.selectSeatId = record.seat_id
          recordAddress(params).then(res => {
            const result = res.data
            if (result.code === 1) {
              this.selectBuilding = result.message.building
              this.selectFloor = result.message.floor
              this.selectRoom = result.message.room_name
              this.selectRow = result.message.row_num
              this.selectCol = result.message.col_num
            } else {
              this.$message.error(result.message)
            }
          }).catch(err => {
            console.log(err)
          })

          console.log(record)
        },
        handleBookingOk () {
          const params = {
            user_id: this.user_id,
            seat_id: this.selectSeatId,
            start_time: this.selectStartTime.format('YYYY-MM-DD HH:mm:ss'),
            end_time: this.selectEndTime.format('YYYY-MM-DD HH:mm:ss')
          }
          console.log(params)
          bookDesk(params).then(res => {
            if (res.data.code === 1) {
              this.$message.success('再次预约成功')
              this.handleFindRecord()
            } else {
              this.$message.error('预约失败')
            }
          }).catch(err => {
            console.log(err)
            this.$message.error('预约失败, 请检查网络')
          })
          this.bookingVisible = false
        },
        handleBookingCancel () {
          this.bookingVisible = false
        },
        onStartChange (value) {
          this.selectStartTime = value
        },
        onEndChange (value) {
          this.selectEndTime = value
        },
        onDateChange (value) {
          this.selectDate = value
        }
    }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';
.stat-column {
  min-width: 150px; /* 设置最小宽度 */
  white-space: nowrap; /* 确保文本不换行 */
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.cell {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
