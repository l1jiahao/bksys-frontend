<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 搜索栏 -->
      <a-table :columns="column" :data-source="classroom" :pagination="{ pageSize: 10 }" >
        <a slot="room_name" slot-scope="text, record" @click="goToRoom(record)">{{ text }}</a>
        <a-tag slot="status" slot-scope="tags" :color="tags === '开放' ? 'green' : tags === '故障' ? 'red' : 'blue'">
          {{ tags }}
        </a-tag>
        <span slot="action" slot-scope="record">
          <a @click="handleAlterTime(record)">开放时间 </a>
          <a-divider type="vertical" />
          <a @click="handleStatus(record)"> 状态 </a>
        </span>
      </a-table>
      <a-modal v-model="visible" title="修改教室开放时间" @ok="handleOk">

        <span> 开放时间 </span>
        <a-time-picker format="HH" :value="startValue" @change="onStartChange">
          <a-button slot="addon" size="small" type="primary">
            Ok
          </a-button>
        </a-time-picker>
        <a-divider type="vertical" />
        <span> 关闭时间 </span>
        <a-time-picker format="HH" :value="endValue" @change="onEndChange">
          <a-button slot="addon" size="small" type="primary">
            Ok
          </a-button>
        </a-time-picker>

      </a-modal>
      <a-modal v-model="statusVisible" title="修改教室开放状态" @ok="handleStatusOk">
        <a-select default-value="1" style="width: 120px" @change="handleChange">
          <a-select-option value="1">
            开放
          </a-select-option>
          <a-select-option value="2">
            关闭
          </a-select-option>
          <a-select-option value="3">
            故障
          </a-select-option>
        </a-select>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { findAllAddress, findClassroom, alterTime, alterStatus } from '@/api/classroom_mock'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'
import storage from 'store'

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
      statusVisible: false,
      statusValue: 1,
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
      closeTime: null,
      roleId: null,
      startValue: null,
      endValue: null,
      selectedRoomId: null
    }
  },
  created () {
    this.handleFindClassroom()
    this.roleId = storage.get('role_id')
  },
  computed: {
    column () {
      const baseColumns = [
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
      if (this.roleId === '2') {
        baseColumns.push({
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        })
      }
      return baseColumns
    }
  },
  methods: {
    async handelFindAll () {
      const res = await findAllAddress().then(res => res.data.message.data)
      this.location = res
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
      console.log(record.status)
      if (record.status === '关闭') {
        this.$message.error('教室已关闭')
        return
      }
      if (record.status === '故障') {
        this.$message.error('教室故障, 暂停使用')
        return
      }
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
    },
    handleAlterTime (record) {
      this.selectedRoomId = record.room_id
      this.visible = true
    },
    handleOk () {
      this.visible = false
      const params = {
        roomId: this.selectedRoomId,
        openTime: this.startValue.format('HH') + ':00:00',
        closeTime: this.endValue.format('HH') + ':00:00'
      }
      alterTime(params).then(res => {
        if (res.data.code === 1) {
          this.$message.success('修改成功')
          this.handleFindClassroom()
        } else {
          this.$message.error('修改失败')
        }
      })
      console.log(params)
    },
    onStartChange (value) {
      this.startValue = value
    },
    onEndChange (value) {
      this.endValue = value
    },
    handleStatus (record) {
      this.selectedRoomId = record.room_id
      this.statusVisible = true
    },
    handleStatusOk () {
      this.statusVisible = false
      const params = {
        room_id: this.selectedRoomId,
        status_id: this.statusValue
      }
      console.log(params)
      alterStatus(params).then(res => {
        if (res.data.code === 1) {
          this.$message.success('修改成功')
          this.handleFindClassroom()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    handleChange (value) {
      this.statusValue = value
    }
  }
}
</script>
