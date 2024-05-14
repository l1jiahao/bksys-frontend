<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <!-- 搜索栏 -->
      <a-button type="primary" icon="plus" @click="handelFindAll"> mock </a-button>
      <a-table :columns="columnsLocation" :data-source="location" :pagination="{ pageSize: 15 }" >
        <!-- <template #headerCell="{ column }">
          <template v-if="column.key === 'building'">
            <span>
              <smile-outlined />
            </span>
          </template>
        </template> -->

        <a slot="building" slot-scope="text">{{ text }}</a>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { findAll } from '@/api/test_mock'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

const columnsLocation = [
    {
      title: '楼栋',
      dataIndex: 'building',
      key: 'building',
      filters: [
        {
          text: '光华楼',
          value: '光华楼'
        }
      ],
      onFilter: (value, record) => record.building.includes(value),
      sorter: (a, b) => a.building.length - b.building.length,
      ellipsis: true,
      scopedSlots: {
        customRender: 'building'
      }
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      key: 'floor',
      sorter: (a, b) => a.floor - b.floor,
      slots: {
        customRender: 'floor'
      }
    }
]

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
      columnsLocation: columnsLocation,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      location: []
    }
  },
  methods: {
    async handelFindAll () {
      const res = await findAll().then(res => res.data.message.data)
      this.location = res
      console.log(this.location)
    }
  }
}
</script>
