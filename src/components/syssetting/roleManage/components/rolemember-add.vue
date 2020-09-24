<template>
  <Modal
    v-model="addRoleMember"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      新增用户
      <i class="h-icon-close" @click="close"></i>
    </div>
    <div :labelPosition="labelPosition">
      <Row :space="12">
        <Cell>
          <div class="h-panel">
            <div class="h-panel-bar">
              角色名称：
              <input type="text" v-model="userList.roleName" style="width:150px;" />&nbsp;&nbsp;
              部门：
              <input
                type="text"
                v-model="userList.departmentName"
                style="width:150px;"
              />&nbsp;&nbsp;
              用户名称：
              <input
                type="text"
                v-model="userList.realName"
                style="width:150px;"
              />&nbsp;&nbsp;
              <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
              <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
            </div>
          </div>
        </Cell>
        <Cell>
          <div class="h-panel">
            <div class="h-panel-body">
              <Table ref="table" :datas="datas" :loading="isLoading" checkbox>
                <TableItem :width="40" title="序号" prop="$serial"  align="center"></TableItem>
                <TableItem :width="80" title="登录名称" prop="loginName" align="left"></TableItem>
                <TableItem :width="80" title="用户姓名" prop="realName" align="left"></TableItem>
                <TableItem :width="60" title="部门" prop="departmentName" align="left"></TableItem>
                <TableItem :width="80" title="角色名称" prop="roleName" align="left"></TableItem>
                <TableItem :width="100" title="手机号" prop="phoneNumber" align="left"></TableItem>
                <TableItem :width="150" title="邮箱" prop="email" align="left"></TableItem>
                <TableItem :width="150" title="创建时间" prop="createTime" align="left"></TableItem>
                <div slot="empty">暂时无数据</div>
              </Table>
              <p v-height="15"></p>
              <div>
                <Pagination
                  v-if="pagination.total>0"
                  align="right"
                  v-model="pagination"
                  @change="changePage"
                />
              </div>
            </div>
          </div>
        </Cell>
      </Row>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="submit">新增</button>
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
import userModel from 'model/user/userModel';
import roleModel from 'model/role/roleModel';
import roleUserModel from 'model/role/roleUserModel';
export default {
  props: ['addRoleMember', 'roleId'],
  data() {
    return {
      userList: userModel.parse({}),
      roleList: roleModel.parse({}),
      roleUserList: roleUserModel.parse({}),
      datas: [],
      pagination: {
        page: 1,
        size: 5,
        total: 100
      },
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      isLoading: false,
      closeOnMask: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取所有用户列表
    getData() {
      this.roleList.page = this.pagination.page;
      this.roleList.size = this.pagination.size;
      R.roleManage.roleFindAllUser(userModel.dispose(this.userList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
    },
    search() {
      this.getData();
      this.userList.page = this.pagination.page;
      this.userList.size = this.pagination.size;
    },
    reset() {
      this.userList.roleName = '';
      this.userList.departmentName = '';
      this.userList.realName = '';
    },
    submit() {
      this.$Loading();
      this.roleUserList.roleId = this.roleId;
      let userIds = [];
      for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
        userIds.push(this.$refs.table.getSelection()[i].id);
      }
      this.roleUserList.userIds = userIds.join(',');
      R.roleManage.roleAddUser(roleUserModel.dispose(this.roleUserList)).then(resp => {
        if (resp.ok) {
          if (resp.msg == '') {
            this.$parent.close();
            this.$Loading.close();
            this.$Message.error(resp.body);
          } else {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.roleUserList = roleUserModel.parse({});
              this.$parent.getData();
            }, 1000);
          }
        } else {
          this.$Message.error('保存失败');
          this.$parent.close();
          this.$Loading.close();
        }
      });
    },
    changePage() {
      this.getData();
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
</style>

