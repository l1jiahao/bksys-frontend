<template>
  <!-- hidden PageHeaderWrapper title demo -->
  <page-header-wrapper :title="false">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" :title="'添加楼层'">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          :label="$t('form.basic-form.building.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'building',
              {rules: [{ required: true, message: $t('form.basic-form.building.required') }]}
            ]"
            name="name"
            :placeholder="$t('form.basic-form.building.placeholder')" />
        </a-form-item>

        <a-form-item
          :label="$t('form.basic-form.floor.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-input-number
            v-decorator="[
              'floor',
              {rules: [{ required: true, message: $t('form.basic-form.floor.required') }]}
            ]"
            :min="1"
            :max="100"
            :placeholder="$t('form.basic-form.floor.placeholder')" />

          <span> 层 </span>
        </a-form-item>

        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">{{ $t('form.basic-form.form.submit') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :body-style="{padding: '24px 32px'}" :title="'添加教室信息'">
      <a-form @submit="handleClassroomSubmit" :form="form2">

        <a-form-item
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          label="Address">
          <a-select style="width: 120px" @change="handleBuildingChange" placeholder="请选择楼栋">
            <a-select-option v-for="building in buildings" :key="building">
              {{ building }}
            </a-select-option>
          </a-select>
          <a-select style="width: 120px" placeholder="请选择楼层" @change="handleFloorChange">
            <a-select-option v-for="floor in floors" :key="floor">
              {{ floor }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="$t('form.basic-form.room.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'roomName',
              {rules: [{ required: true, message: $t('form.basic-form.room.required') }]}
            ]"
            name="name"
            :placeholder="$t('form.basic-form.room.placeholder')" />
        </a-form-item>

        <a-form-item
          :label="$t('form.basic-form.row-count.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-input-number
            v-decorator="[
              'rowCount',
              {rules: [{ required: true, message: $t('form.basic-form.row-count.required') }]}
            ]"
            :min="1"
            :max="100"
            :placeholder="$t('form.basic-form.row-count.placeholder')" />

          <span> 行 </span>
        </a-form-item>

        <a-form-item
          :label="$t('form.basic-form.col-count.label')"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="false"
        >
          <a-input-number
            v-decorator="[
              'colCount',
              {rules: [{ required: true, message: $t('form.basic-form.col-count.required') }]}
            ]"
            :min="1"
            :max="100"
            :placeholder="$t('form.basic-form.col-count.placeholder')" />

          <span> 列 </span>
        </a-form-item>

        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center"
        >
          <a-button htmlType="submit" type="primary">{{ $t('form.basic-form.form.submit') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { addAddress, findAllAddress, addClassroom } from '@/api/classroom_mock'

export default {
data () {
    return {
    form: this.$form.createForm(this),
    form2: this.$form.createForm(this),
    addressData: [],
    floors: [],
    selectedBuilding: null,
    selectedFloor: null
    }
},
created () {
    this.getAllAddress()
},
computed: {
    buildings () {
    return [...new Set(this.addressData.map(item => item.building))]
    },
    buildingFloors () {
        return this.addressData.reduce((acc, item) => {
        if (!acc[item.building]) {
            acc[item.building] = []
        }
        acc[item.building].push(item.floor)
        return acc
        }, {})
    },
    selectedAddressId () {
        return this.addressData.find(item => item.building === this.selectedBuilding && item.floor === this.selectedFloor).address_id
    }
},
methods: {
    // handler
    handleSubmit (e) {
    e.preventDefault()
    this.form.validateFields((err, values) => {
        if (!err) {
            console.log(values)
            addAddress(values).then(res => {
                const val = res.data
                if (val.code === 1) {
                    this.$message.success('添加成功')
                } else {
                    this.$message.error('添加失败')
                }
                this.getAllAddress()
            }).catch(err => {
                console.log(err)
                this.$message.error('添加失败, 请检查网络')
            })
        }
    })
    },

    handleClassroomSubmit (e) {
    e.preventDefault()
    this.form2.validateFields((err, values) => {
        if (!err) {
            values.address_id = this.selectedAddressId
            console.log(values)
            addClassroom(values).then(res => {
                const val = res.data
                if (val.code === 1) {
                    this.$message.success('教室添加成功')
                } else {
                    this.$message.error('添加失败')
                }
            }).catch(err => {
                console.log(err)
                this.$message.error('添加失败, 请检查网络')
            })
        }
    })
    },
    handleSelectChange (value) {
    console.log(value)
    },
    handleBuildingChange (value) {
        this.selectedBuilding = value
        this.floors = this.buildingFloors[value]
    //   this.cities = cityData[value]
    //   this.secondCity = cityData[value][0]
    },
    handleFloorChange (value) {
        this.selectedFloor = value
        console.log(this.selectedAddressId)
    //   this.cities = cityData[value]
    //   this.secondCity = cityData[value][0]
    },
    getAllAddress () {
        findAllAddress().then(res => {
            const val = res.data
            if (val.code === 1) {
                this.addressData = val.message.data
                console.log('再次获取楼栋信息')
            } else {
                this.$message.error('获取楼栋信息失败')
            }
        }).catch(err => {
            console.log(err)
            this.$message.error('获取楼栋信息失败, 请检查网络')
        })

      // const res = await findAllAddress().then(res => res.data.message.data)
      // this.location = res
      // console.log(this.location)
    }
}
}
</script>
