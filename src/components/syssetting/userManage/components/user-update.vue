<template>
  <div style="width: 500px">
    <Modal
      v-model="updateUser"
      :hasCloseIcon="hasCloseIcon"
      :hasDivider="hasDivider"
      :middle="true"
      :closeOnMask="closeOnMask"
    >
      <div slot="header" class="title">
        编辑用户
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
          <FormItem label="用户密码：" prop="password">
            <input type="password" v-model="userList.password" />
          </FormItem>
          <FormItem label="考勤编号：" prop="enrollNumber">
            <input type="text" v-model="userList.enrollNumber" />
          </FormItem>
          <FormItem label="部门：" prop="departmentId">
            <Select v-model="userList.departmentId" class="select-demo" :datas="department"></Select>
          </FormItem>
          <FormItem label="管理员：" prop="isAdmin">
            <Radio v-model="userList.isAdmin" :datas="adminParams" ref="check"></Radio>
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
        <button class="h-btn h-btn-primary" @click="submit">更新</button>
        <button class="h-btn" @click="close">取消</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import userModel from 'model/user/userModel';
export default {
  props: ['updateUser', 'department', 'role'],
  data() {
    return {
      userList: userModel.parse({}),
      sexParams: [
        { title: '男', key: '1' },
        { title: '女', key: '2' },
        { title: '其他', key: '3' }
      ],
      adminParams: [
        { title: '是', key: '1' },
        { title: '否', key: '0' }
      ],
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      //必填项校验项
      validationRules: {
        required: ['loginName', 'realName', 'password', 'isAdmin', 'departmentId', 'enrollNumber', 'phoneNumber', 'email']
      },
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
          this.userList.realName = resp.body.realName;
          this.userList.password = resp.body.password;
          this.userList.isAdmin = resp.body.isAdmin;
          this.userList.departmentId = resp.body.departmentId;
          this.userList.enrollNumber = resp.body.enrollNumber;
          this.userList.phoneNumber = resp.body.phoneNumber;
          this.userList.roleIds = resp.body.roleIds;
          this.userList.sex = resp.body.sex;
          this.userList.email = resp.body.email;
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.userManage.userUpdate(userModel.dispose(this.userList)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('修改成功');
              this.userList = userModel.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('修改失败');
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

