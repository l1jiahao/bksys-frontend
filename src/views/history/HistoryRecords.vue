<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 搜索栏 -->
      <a-button type="primary" icon="plus" @click="handleFindRecord"> mock classroom </a-button>
      <a-table :columns="column" :data-source="records" :pagination="{ pageSize: 10 }" >
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { findRecord } from '@/api/history_mock'

export default {
    name: 'TableList',
    data () {
        return {
        // create model
        visible: false,
        confirmLoading: false,
        mdl: null,
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        records: []
        }
    },
    create () {
        this.handleFindRecord()
    },
    computed: {
        column () {
            return [
                {
                title: '记录ID',
                dataIndex: 'record_id',
                key: 'record_id',
                scopedSlots: {
                    customRender: 'record_id'
                }
                },
                {
                title: '座位ID',
                dataIndex: 'seat_id',
                key: 'seat_id',
                scopedSlots: {
                    customRender: 'seat_id'
                }
                },
                {
                title: '状态',
                dataIndex: 'status_id',
                key: 'status_id',
                scopedSlots: {
                    customRender: 'status_id'
                }
                },
                {
                title: '用户ID',
                dataIndex: 'user_id',
                key: 'user_id',
                scopedSlots: {
                    customRender: 'user_id'
                }
                },
                {
                title: '开始时间',
                dataIndex: 'start_time',
                key: 'start_time',
                scopedSlots: {
                    customRender: 'start_time'
                }
                },
                {
                title: '结束时间',
                dataIndex: 'end_time',
                key: 'end_time',
                scopedSlots: {
                    customRender: 'end_time'
                }
                }
            ]
    },
    methods: {
        async handleFindRecord () {
            const res = await findRecord().then(res => res.data.message.data)
            this.records = res
            console.log(this.records)
        }
    }
    }
}
</script>
