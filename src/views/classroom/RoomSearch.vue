<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 搜索栏 -->
      <a-table :columns="column" :data-source="classroom" :pagination="{ pageSize: 10 }" >
        <a slot="room_name" slot-scope="text, record" @click="goToRoom(record)">{{ text }}</a>
        <a-tag slot="status" slot-scope="tags" :color="tags === '开放' ? 'green' : tags === '故障' ? 'red' : 'blue'">
          {{ tags }}
        </a-tag></a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { findAllAddress, findClassroom } from '@/api/classroom_mock'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
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
      location: [],
      classroom: [],
      uniqueBuildings: [],
      uniqueStatus: [],
      openTime: null,
      closeTime: null
    }
  },
  created () {
    this.handleFindClassroom()
  },
  computed: {
    column () {
      return [
        {
          title: '教室名称',
          dataIndex: 'room_name',
          key: 'room_name',
          scopedSlots: {
            customRender: 'room_name'
          }
        },
        {
          title: '楼栋',
          dataIndex: 'building',
          key: 'building',
          filters: this.uniqueBuildings.map(building => ({
            text: building,
            value: building
          })),
          onFilter: (value, record) => record.building.includes(value)
        },
        {
          title: '楼层',
          dataIndex: 'floor',
          key: 'floor',
          scopedSlots: {
            customRender: 'floor'
          },
          sorter: (a, b) => a.floor - b.floor,
          ellipsis: true
        },
        {
          title: '开放时间',
          dataIndex: 'open_time',
          key: 'open_time',
          scopedSlots: {
            customRender: 'open_time'
          },
          sorter: (a, b) => {
            const [hourA, minuteA] = a.open_time.split(':').map(Number)
            const [hourB, minuteB] = b.open_time.split(':').map(Number)
            return hourA * 60 + minuteA - (hourB * 60 + minuteB)
          }
        },
        {
          title: '关闭时间',
          dataIndex: 'close_time',
          key: 'close_time',
          scopedSlots: {
            customRender: 'close_time'
          },
          sorter: (a, b) => {
            const [hourA, minuteA] = a.close_time.split(':').map(Number)
            const [hourB, minuteB] = b.close_time.split(':').map(Number)
            return hourA * 60 + minuteA - (hourB * 60 + minuteB)
          }
        },
        {
          title: '教室状态',
          dataIndex: 'status',
          key: 'status',
          filters: this.uniqueStatus.map(status => ({
            text: status,
            value: status
          })),
          onFilter: (value, record) => record.status.includes(value),
          scopedSlots: {
            customRender: 'status'
          }
        }
      ]
    }
  },
  methods: {
    async handelFindAll () {
      const res = await findAllAddress().then(res => res.data.message.data)
      this.location = res
      console.log(this.location)
    },
    async handleFindClassroom () {
      const res = await findClassroom().then(res => res.data.message)
      this.classroom = res
      const statusMap = {
        1: '开放',
        2: '关闭',
        3: '故障'
      }
      this.classroom = res.map(item => ({
        ...item,
        status: statusMap[item.status]
      }))

      this.uniqueBuildings = [...new Set(this.classroom.map(item => item.building))]
      this.uniqueStatus = [...new Set(this.classroom.map(item => item.status))]
    },
    goToRoom (record) {
      const path = '/classroom/desk'
      const query = {
        room_id: record.room_id,
        row_count: record.row_count,
        col_count: record.col_count,
        room_name: record.room_name
      }
      this.$router.push({
        path: path,
        query: query
      })
    }
  }
}
</script>
