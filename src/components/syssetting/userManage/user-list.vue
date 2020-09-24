<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            登录名称：
            <input type="text" v-model="userList.loginName" />&nbsp;&nbsp; 用户姓名：
            <input type="text" v-model="userList.realName" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add" v-has="'userManageadd'">新增</Button>
            <!-- <Button color="green" icon="h-icon-edit" @click="update" v-has="'userManageupdate'">修改</Button> -->
            <Button
              v-show="deleteBtn"
              color="red"
              icon="h-icon-close"
              @click="remove"
              v-has="'userManagedelete'"
            >删除</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
              <TableItem :width="40" title="序号" prop="$serial" align="center" fixed="left"></TableItem>
              <TableItem :width="80" title="登录名称" prop="loginName" align="left" fixed="left"></TableItem>
              <TableItem :width="80" title="用户姓名" prop="realName" align="left" fixed="left"></TableItem>
              <TableItem :width="80" title="部门" prop="departmentName" align="left" fixed="left"></TableItem>
              <TableItem :width="80" title="角色" prop="roleName" align="left" fixed="left"></TableItem>
              <TableItem :width="80" title="考勤编号" prop="enrollNumber" align="center"></TableItem>
              <TableItem :width="120" title="手机" prop="phoneNumber" align="left"></TableItem>
              <TableItem :width="150" title="邮箱" prop="email" align="left"></TableItem>
              <TableItem :width="150" title="创建时间" prop="createTime" align="left"></TableItem>
              <TableItem :width="80" title="用户状态" align="center">
                <template slot-scope="{ data }">
                  <h-switch v-model="data.isOnline" disabled>
                    <span slot="open">在线</span>
                    <span slot="close">离线</span>
                  </h-switch>
                </template>
              </TableItem>
              <TableItem :width="80" title="用户锁定" align="center">
                <template slot-scope="{ data }">
                  <h-switch v-model="data.isLocked" disabled>
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                  </h-switch>
                </template>
              </TableItem>
              <TableItem :width="150" title="操作" prop="operation" align="center" fixed="right">
                <template slot-scope="{ data }">
                  <button
                    class="h-btn h-btn-s h-btn-blue"
                    @click="modify(data)"
                    v-has="'userManageupdate'"
                  >
                    <i class="h-icon-edit"></i>
                    编辑
                  </button>
                  <DropdownMenu
                    button
                    v-color:white
                    v-bg-color:#8b04e4
                    @click="trigger"
                    @show="getOneData(data)"
                    :datas="param"
                  >更多</DropdownMenu>
                </template>
              </TableItem>
              <div slot="empty">暂时无数据</div>
            </Table>
            <p v-height="15"></p>
            <div>
              <Pagination
                v-if="pagination.total > 0"
                align="right"
                v-model="pagination"
                @change="changePage"
              />
            </div>
          </div>
        </div>
      </Cell>
    </Row>
    <AddUser :addUser="addUser" :department="department" :role="role"></AddUser>
    <UpdateUser :updateUser="updateUser" :department="department" :role="role" ref="update"></UpdateUser>
    <Reset :reseteUser="reseteUser" ref="reset"></Reset>
  </div>
</template>

<script>
// import { write } from 'fs';
import useradd from './components/user-add';
import userupdate from './components/user-update';
import userreset from './components/user-reset';
import userModel from 'model/user/userModel';
export default {
  components: {
    AddUser: useradd,
    UpdateUser: userupdate,
    Reset: userreset
  },
  data() {
    return {
      userList: userModel.parse({}),
      addUser: false,
      updateUser: false,
      reseteUser: false,
      datas: [],
      department: [],
      role: [],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      isLoading: false,
      deleteBtn: false,
      param: [
        { title: '编辑', key: 'modify' },
        { title: '重置', key: 'reset' },
        { title: '删除', key: 'delete' }
      ]
    };
  },
  mounted() {
    this.getData();
    this.$nextTick(() => {
      document.querySelector('.h-table-fixed-header-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-header-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
    });
    document.addEventListener('scroll', this.winScroll, true);
  },
  methods: {
    //根据筛选条件查询
    search() {
      this.getData();
      this.userList.page = this.pagination.page;
      this.userList.size = this.pagination.size;
    },
    //重置筛选条件
    reset() {
      this.userList.loginName = '';
      this.userList.realName = '';
    },
    changePage() {
      this.getData();
    },
    close() {
      this.addUser = false;
      this.updateUser = false;
      this.reseteUser = false;
    },
    //重置密码
    resetPassword(data) {
      this.reseteUser = true;
      this.$refs.reset.getData(this.datas[this.datas.indexOf(data)].id);
    },
    //新增数据
    add() {
      this.addUser = true;
    },
    //获取所有数据列表
    getData() {
      this.userList.page = this.pagination.page;
      this.userList.size = this.pagination.size;
      this.isLoading = true;
      R.userManage.userFindAll(userModel.dispose(this.userList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.size = resp.size;
          this.pagination.total = resp.total;
        }
      });
      R.userManage.userFindAllDepartment(userModel.dispose(this.userList)).then(resp => {
        // console.log(resp.body)
        if (resp.ok) {
          this.department = resp.body;
        }
      });
      R.userManage.userFindAllRole(userModel.dispose(this.userList)).then(resp => {
        // console.log(resp.body)
        if (resp.ok) {
          this.role = resp.body;
        }
      });
    },
    //修改数据
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要修改的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('修改仅支持单条数据');
        } else {
          this.updateUser = true;
          this.$refs.update.getData(this.$refs.table.getSelection()[0].id);
        }
      }
    },
    //编辑数据
    modify(data) {
      this.updateUser = true;
      this.$refs.update.getData(this.datas[this.datas.indexOf(data)].id);
    },
    //删除数据（可批量删除）
    remove() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
              ids.push(this.$refs.table.getSelection()[i].id);
            }
            this.userList.ids = ids.join(',');
            R.userManage.userDelete(userModel.dispose(this.userList)).then(resp => {
              if (resp.ok) {
                this.$Message.success('数据刪除成功');
                setTimeout(() => {
                  this.getData();
                }, 2000);
              }
            });
          })
          .catch(() => {
            this.$emit('close');
          });
      }
    },
    //逐条删除数据
    del(data) {
      let ids = [];
      this.$Confirm('确定删除？', '删除')
        .then(() => {
          ids.push(data.id);
          this.userList.ids = ids.join(',');
          R.userManage.userDelete(userModel.dispose(this.userList)).then(resp => {
            if (resp.ok) {
              this.$Message.success('数据刪除成功');
              setTimeout(() => {
                this.getData();
              }, 2000);
            }
          });
        })
        .catch(() => {
          this.$emit('close');
        });
    },
    //控制批量删除按钮
    select(data) {
      if (data.length > 0) {
        this.deleteBtn = true;
      } else {
        this.deleteBtn = false;
      }
    },
    trigger(data) {
      if (data == 'modify') {
        this.$refs.update.getData(this.oneData.id);
        this.updateUser = true;
      } else if (data == 'reset') {
        this.$refs.reset.getData(this.oneData.id);
        this.reseteUser = true;
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(this.oneData.id);
            this.userList.ids = ids.join(',');
            R.userManage.userDelete(userModel.dispose(this.userList)).then(resp => {
              if (resp.ok) {
                this.$Message.success('数据刪除成功');
                setTimeout(() => {
                  this.getData();
                }, 2000);
              }
            });
          })
          .catch(() => {
            this.$emit('close');
          });
      }
    },
    getOneData(data) {
      this.oneData = data;
    },
    winScroll() {
      if (document.querySelector('.h-table-body').scrollLeft == 0) {
        document.querySelector('.h-table-fixed-header-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
        document.querySelector('.h-table-fixed-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
        document.querySelector('.h-table-fixed-header-right').style.boxShadow = '-2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-right').style.boxShadow = '-2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
      } else if (
        document.querySelector('.h-table-body').scrollLeft > 0 &&
        document.querySelector('.h-table-body').scrollLeft <
          document.querySelector('.h-table-body').scrollWidth - document.querySelector('.h-table-body').clientWidth
      ) {
        document.querySelector('.h-table-fixed-header-left').style.boxShadow = '2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-left').style.boxShadow = '2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-header-right').style.boxShadow = '-2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-right').style.boxShadow = '-2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
      } else if (
        document.querySelector('.h-table-body').scrollLeft ==
        document.querySelector('.h-table-body').scrollWidth - document.querySelector('.h-table-body').clientWidth
      ) {
        document.querySelector('.h-table-fixed-header-left').style.boxShadow = '2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-left').style.boxShadow = '2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-header-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
        document.querySelector('.h-table-fixed-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.h-dropdowncustom.h-btn /deep/ .h-dropdowncustom-show {
  padding: 6px 10px;
  border-radius: 4px;
  vertical-align: middle;
}
/deep/ .h-dropdowncustom-show-content {
  padding-right: 14px;
}
/deep/ .h-panel-body {
  height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px);
}
/deep/ .h-table {
  max-height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px - 25px - 25px - 50px - 32px);
  overflow: auto;
}
</style>