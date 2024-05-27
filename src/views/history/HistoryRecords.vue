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
      </div>
    </template>

    <!-- <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="项目数" :value="56" />
        </div>
        <div class="stat-item">
          <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
        </div>
        <div class="stat-item">
          <a-statistic title="项目访问" :value="2223" />
        </div>
      </div>
    </template> -->

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
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { findRecord, checkIn, cancelCheckIn } from '@/api/history_mock'
import CreateForm from './modules/CreateForm'
import storage from 'store'
import { timeFix } from '@/utils/util'

const columns = [
    // {
    //     title: '座位ID',
    //     dataIndex: 'seat_id',
    //     key: 'seat_id',
    //     scopedSlots: { customRender: 'seat_id' }
    // },
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
        confirmLoading: false,
        mdl: null,
        // 查询参数
        user_id: null,
        records: []
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
            try {
              const res = await findRecord(requestParameters).then(res => res.data.message.data)
              this.records = res.map(item => {
                const [date, startTime] = item.startTime.split('T')
                const [startTimeHour, startTimeMinute] = startTime.split(':')
                const [, endTime] = item.endTime.split('T')
                const [endTimeHour, endTimeMinute] = endTime.split(':')
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
            console.log(record)
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
                const res = await checkIn(requestParameters)
                const vali = res.data.message.content
                console.log(vali)
                if (vali === '签到成功') return true
                else return false
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
            this.handleFindRecord()
          }).catch(err => {
            console.log(err)
            this.$message.error('取消预约失败, 请检查网络')
          })

          console.log(record)
        }
    }
}
</script>

<style lang="less" scoped>
@import './Workplace.less';

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
