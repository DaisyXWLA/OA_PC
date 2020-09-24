<template>
  <Modal
    v-model="reseteUser"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      重置密码
      <i class="h-icon-close" @click="close"></i>
    </div>
    <div :labelPosition="labelPosition" style="width:600px">
      <Form ref="form" :model="data" :label-width="110" :top="0.2">
        <FormItem label="登录名称：" prop="loginName">
          <input type="text" v-model="userList.loginName" readonly />
        </FormItem>
        <FormItem label="输入密码：" prop="loginPassword">
          <input type="password" v-model="userList.loginPassword" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="submit">重置</button>
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
import userModel from 'model/user/userModel';
export default {
  props: ['reseteUser'],
  data() {
    return {
      userList: userModel.parse({}),
      param: [
        { title: '海友科伟官网开发', key: 'a1', other: '其他值' },
        { title: '办公平台开发', key: 'a2' },
        { title: '郑州师院固定资产', key: 'a3' }
      ],
      data: {
        theme: null,
        relatedprojects: null,
        time: null,
        reason: null,
        value: null
      },
      format: '',
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    getData(id) {
      this.userList.id = id;
      R.userManage.userFindOne(userModel.dispose(this.userList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.userList.id = resp.body.id;
          this.userList.loginName = resp.body.loginName;
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        if (this.userList.loginPassword.length > 16) {
          this.$Message('密码长度不能超过16位');
        } else {
          this.$Loading();
          R.userManage.userResetPassword(userModel.dispose(this.userList)).then(resp => {
            if (resp.ok) {
              setTimeout(() => {
                this.$parent.close();
                this.$Loading.close();
                this.$Message.success('重置密码成功');
                this.userList = userModel.parse({});
                this.$parent.getData();
              }, 1000);
            } else {
              this.$Message.error('重置密码失败');
              this.$parent.close();
              this.$Loading.close();
            }
          });
        }
      }
      // this.userList.loginName = '';
      this.userList.loginPassword = '';
    },
    close() {
      this.$parent.close();
    }
  }
};
</script>
<style lang="less">
.title {
  background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  margin-left: -15px;
}
.title {
  overflow: hidden;
  .h-icon-close {
    float: right;
    line-height: 40px;
    font-size: 16px !important;
  }
}
</style>



