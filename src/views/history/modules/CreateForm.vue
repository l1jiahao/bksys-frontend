<template>
  <a-modal
    title="签到"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <div class="row">
          <div class="cell">建筑名: {{ buildingName }}</div>
          <div class="cell">楼层: {{ floor }}</div>
          <div class="cell">教室名: {{ roomName }}</div>
        </div>
        <div class="row">
          <div class="cell">座位行: {{ seatRow }}</div>
          <div class="cell">座位列: {{ seatCol }}</div>
        </div>
        <a-form-item label="签到码">
          <a-input v-decorator="['check_code', {rules: [{required: true, message: '请输入签到码'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { recordAddress } from '@/api/history_mock'

// 表单字段
const fields = ['check_code']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      roomName: 'asdfasd',
      buildingName: '',
      floor: '',
      seatCol: '',
      seatRow: ''
    }
  },
  methods: {
    getRecordAddress (params) {
      recordAddress(params).then(res => {
        const result = res.data
        if (result.code === 1) {
          this.roomName = result.message.room_name
          this.buildingName = result.message.building
          this.floor = result.message.floor
          this.seatCol = result.message.col_num
          this.seatRow = result.message.row_num
        } else {
          this.$message.error(result.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }

  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      const params = {
        record_id: this.model.record_id
      }
      this.getRecordAddress(params)
    })
  }
}
</script>

<style scoped>
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
</style>
