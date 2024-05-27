<template>
  <a-card>
    <a-list
      itemLayout="horizontal"
      :dataSource="data"
    >
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>

      </a-list-item>
    </a-list>
    <create-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import CreateForm from '../modules/CreateForm'
import { editInfo } from '@/api/account_mock'

export default {
  components: {
    CreateForm
  },
  data () {
    return {
      password: null,
      token: null,
      account: null,
      email: null,
      name: null,
      // create model
      visible: false,
      confirmLoading: false
    }
  },
  computed: {
    data () {
      return [
      { title: this.$t('account.settings.security.password'), description: '账号密码', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.handleModify() } } }
      ]
    }
  },
  created () {
    this.token = '2BMf6n^j7e[A(ppkB^fq(0o$O)PGc!'
    this.account = '&muxD2EE'
    this.email = 'e.fsxupj@eihqnedo.ht'
    this.name = '孙伟'
    this.password = '#vVFi]JWB8'
  },
  methods: {
    handleModify () {
      this.visible = true
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          new Promise((resolve, reject) => {
            this.handleValidation(values.newpass).then(result => {
              resolve(result)
            }).catch(error => {
              reject(error)
            })
          }).then(res => {
            this.visible = false
            this.confirmLoading = false
            form.resetFields()
            if (res === true) {
              this.$message.info('修改成功！')
            } else {
              this.$message.info('修改失败！')
            }
          }).catch(error => {
            this.confirmLoading = false
            this.$message.info('修改失败！')
            console.error('修改失败，错误信息：', error)
          })
        } else {
          this.confirmLoading = false
          this.$message.info('修改失败！')
        }
      })
    },
    async handleValidation (pass) {
      const requestParameters = {
            token: this.token,
            name: this.newname,
            account: this.account,
            password: pass,
            email: this.newemail
          }
      try {
          const res = await editInfo(requestParameters)
          const result = res.data.message.content
          console.log(result)
          if (result === '修改成功') return true
          else return false
        } catch (error) {
            console.error('Error fetching records:', error)
        }
    },
    handleCancel () {
      this.visible = false
      const form = this.$refs.createModal.form
      form.resetFields()
    }
  }
}
</script>
