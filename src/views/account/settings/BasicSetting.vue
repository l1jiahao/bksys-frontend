<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center" >
      <a-col :md="24" :lg="16">

        <a-form layout="vertical" @submit="handleSubmit" :form="form">
          <a-form-item label="Name" >
            <a-input
              v-decorator="['newname', { rules: [{ required: true, message: 'Please input your name!' }] }]"
              :placeholder="name"
            />
          </a-form-item>

          <a-form-item :label="$t('account.settings.basic.email')" >
            <a-input
              v-decorator="['newemail', { rules: [{ required: true, message: 'Please input your email!' }] }]"
              :placeholder="email"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-item>
        </a-form>

      </a-col>
    </a-row>
  </div>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { editInfo } from '@/api/account_mock'
import storage from 'store'

export default {
  mixins: [baseMixin],
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      password: null,
      token: null,
      account: null,
      email: null,
      name: null,
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  created () {
    this.token = '2BMf6n^j7e[A(ppkB^fq(0o$O)PGc!'
    this.account = storage.get('account')
    this.email = storage.get('email')
    this.name = storage.get('username')
    this.password = storage.get('password')
    this.role_id = storage.get('role_id')
    this.user_id = storage.get('user_id')
  },
  methods: {
    async handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const requestParameters = {
            token: this.token,
            name: values.newname,
            account: this.account,
            password: this.password,
            email: values.newemail,
            user_id: this.user_id,
            role_id: this.role_id
          }
          try {
              const res = await editInfo(requestParameters)
              const result = res.data
              if (result.code === 1) {
                this.email = values.newemail
                this.name = values.newname
                storage.set('username', values.newname)
                storage.set('email', values.newemail)
                this.form.resetFields()
                this.$message.info('修改成功！')
              } else {
                this.$message.info('修改失败！')
              }
          } catch (error) {
              console.error('Error fetching records:', error)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
