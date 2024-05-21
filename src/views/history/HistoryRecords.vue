<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="records" :pagination="{ pageSize: 10 }" >
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
import { findRecord, checkIn } from '@/api/history_mock'
import CreateForm from './modules/CreateForm'

const columns = [
    {
        title: '记录ID',
        dataIndex: 'record_id',
        key: 'record_id',
        scopedSlots: { customRender: 'record_id' }
    },
    {
        title: '座位ID',
        dataIndex: 'seat_id',
        key: 'seat_id',
        scopedSlots: { customRender: 'seat_id' }
    },
    {
        title: '状态',
        dataIndex: 'status_id',
        scopedSlots: { customRender: 'status_id' }
    },
    {
        title: '用户ID',
        dataIndex: 'user_id',
        key: 'user_id',
        scopedSlots: { customRender: 'user_id' }
    },
    {
        title: '开始时间',
        dataIndex: 'start_time',
        key: 'start_time',
        scopedSlots: { customRender: 'start_time' }
    },
    {
        title: '结束时间',
        dataIndex: 'end_time',
        key: 'end_time',
        scopedSlots: { customRender: 'end_time' }
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: '150px',
        scopedSlots: { customRender: 'action' }
    }
]

// TODO: 状态的不同展示；只有待签到记录可以点击签到；user_id的逻辑调整；
// TODO LATER: 取消预约（通过12）；根据状态不同显示“签到或取消”以及“再次预约”（通过11）

/* const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
} */

export default {
    name: 'TableList',
    components: {
        STable,
        Ellipsis,
        CreateForm
    },
    data () {
        this.columns = columns
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
        this.user_id = 15000019981218856
        this.handleFindRecord()
    },
    methods: {
        async handleFindRecord () {
            const requestParameters = { user_id: this.user_id }
            try {
                const res = await findRecord(requestParameters)
                this.records = res.data.message.data
                console.log(this.records)
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
                  // TODO, refresh the table here
                } else {
                  this.$message.info('签到失败！')
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
        }
    }
}
</script>
