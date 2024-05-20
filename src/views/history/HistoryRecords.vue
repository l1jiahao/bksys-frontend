<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="records" :pagination="{ pageSize: 10 }" >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleCheckIn(record)">签到</a>
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
import { findRecord } from '@/api/history_mock'
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
        // 高级搜索 展开/关闭
        advanced: false,
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
        },
        handleCancel () {
            this.visible = false
            const form = this.$refs.createModal.form
            form.resetFields()
        }
    }
}
</script>
