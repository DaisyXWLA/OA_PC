<template>
  <Modal
    v-model="addUser"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      新增用户
      <i class="h-icon-close" @click="close"></i>
    </div>
    <div :labelPosition="labelPosition" style="width:600px">
      <Form
        ref="form"
        :model="userList"
        :label-width="110"
        :rules="validationRules"
        :top="0.2"
        mode="twocolumn"
      >
        <FormItem label="登录名称：" prop="loginName">
          <input type="text" v-model="userList.loginName" v-wordlimit="15" />
        </FormItem>
        <FormItem label="用户姓名：" prop="realName">
          <input type="text" v-model="userList.realName" v-wordlimit="15" />
        </FormItem>
        <FormItem label="用户密码：" prop="loginPassword">
          <input type="password" v-model="userList.loginPassword" />
        </FormItem>
        <FormItem label="考勤编号：" prop="enrollNumber">
          <input type="text" v-model="userList.enrollNumber" />
        </FormItem>
        <FormItem label="部门：" prop="departmentId">
          <Select v-model="userList.departmentId" class="select-demo" :datas="department"></Select>
        </FormItem>
        <FormItem label="管理员：" prop="isAdmin">
          <Radio v-model="isAdmin" :datas="adminParams"></Radio>
        </FormItem>
        <FormItem label="手机号码：" prop="phoneNumber">
          <input type="text" v-model="userList.phoneNumber" />
        </FormItem>
        <FormItem label="邮箱：" prop="email">
          <input type="text" v-model="userList.email" />
        </FormItem>
        <FormItem label="用户性别：" prop="sex">
          <Select v-model="userList.sex" class="select-demo" :datas="sexParams"></Select>
        </FormItem>
        <FormItem label="添加角色：" prop="roleIds">
          <Select v-model="userList.roleIds" class="select-demo" :datas="role"></Select>
        </FormItem>
        <!-- <FormItem label="职位：" prop="relatedprojects">
          <input type="text" v-model="userList.theme" />
        </FormItem>-->
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="submit">保存</button>
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
import userModel from 'model/user/userModel';
export default {
  props: ['addUser', 'department', 'role'],
  data() {
    return {
      userList: userModel.parse({}),
      sexParams: [
        { title: '男', key: '1' },
        { title: '女', key: '2' },
        { title: '其他', key: '3' }
      ],
      isAdmin: '0',
      adminParams: [
        { title: '是', key: '1' },
        { title: '否', key: '0' }
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
      //必填项校验项
      validationRules: {
        required: ['loginName', 'realName', 'loginPassword', 'departmentId', 'enrollNumber', 'phoneNumber', 'email']
      },
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        this.userList.isAdmin = this.isAdmin;
        R.userManage.userAdd(userModel.dispose(this.userList)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.userList = userModel.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.$parent.close();
            this.$Loading.close();
          }
        });
      }
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
  overflow: hidden;
  .h-icon-close {
    float: right;
    line-height: 40px;
    font-size: 16px !important;
  }
}
.h-modal .h-notify-container .h-modal-header,
.h-modal .h-notify-container header:first-child {
  color: #fff;
  background: #2d7bf4;
}
.h-notify .h-notify-close,
.h-notify .h-notify-close:hover {
  color: #fff !important;
}
</style>

