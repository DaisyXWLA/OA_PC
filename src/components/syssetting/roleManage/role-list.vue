<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            角色名称：
            <input type="text" v-model="roleList.roleName" />&nbsp;&nbsp;
            角色代码：
            <input type="text" v-model="roleList.roleCode" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add" v-has="'roleManageadd'">新增</Button>
            <Button v-show="allotUser"
              v-color:white
              v-bg-color:#8b04e4
              icon="h-icon-plus"
              @click="distributeUser"
              v-has="'roleManageallot'"
            >分配用户</Button>
            <Button v-show="allotLimit" color="blue" icon="h-icon-lock" @click="disPerm">权限分配</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
              <TableItem title="序号" prop="$serial" :width="40" align="center"></TableItem>
              <TableItem title="角色名称" prop="roleName" align="left"></TableItem>
              <TableItem title="角色代码" prop="roleCode" align="center"></TableItem>
              <TableItem title="备注" prop="remarks" align="left"></TableItem>
              <TableItem title="操作" prop="operation" align="center" :width="150">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s h-btn-blue"
                    @click="modify(data)"
                    v-has="'roleManageupdate'"
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
    <AddRole :addRole="addRole"></AddRole>
    <UpdateRole :updateRole="updateRole" ref="update"></UpdateRole>
    <DisUser :disUser="disUser" ref="dist" :roleId="roleId"></DisUser>
    <UserPower :userPower="userPower" ref="power" :roleId="roleId"></UserPower>
  </div>
</template>

<script>
import roleModel from 'model/role/roleModel';
import roleUserModel from 'model/role/roleUserModel';
import userModel from 'model/user/userModel';
import roleadd from './components/role-add';
import updateRole from './components/role-update';
import disUser from './components/user-distribute';
import UserPower from './components/user-power';
export default {
  components: {
    AddRole: roleadd,
    UpdateRole: updateRole,
    DisUser: disUser,
    UserPower: UserPower
  },
  data() {
    return {
      roleList: roleModel.parse({}),
      roleUserList: roleUserModel.parse({}),
      userList: userModel.parse({}),
      value: null,
      addRole: false,
      updateRole: false,
      userPower: false,
      disUser: false,
      datas: [],
      roleId: '', //角色id
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      data: {},
      isLoading: false,
      allotUser:false,
      allotLimit:false,
      oneData: {},
      param: [
        { title: '编辑', key: 'modify' },
        { title: '分配用户', key: 'allot' },
        { title: '成员', key: 'member' },
        { title: '删除', key: 'delete' }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取所有数据列表
    getData() {
      this.roleList.page = this.pagination.page;
      this.roleList.size = this.pagination.size;
      this.isLoading = true;
      R.roleManage.roleFindAll(roleModel.dispose(this.roleList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.size = resp.size;
          this.pagination.total = resp.total;
        }
      });
    },
    //根据筛选条件查询
    search(data) {
      this.getData();
      this.roleList.page = this.pagination.page;
      this.roleList.size = this.pagination.size;
    },
    //重置筛选条件
    reset() {
      this.roleList.roleName = '';
      this.roleList.roleCode = '';
    },
    //新增角色
    add() {
      this.addRole = true;
    },
    //分配用户
    distributeUser() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要分配用户的数据');
      } else if (this.$refs.table.getSelection().length > 1) {
        this.$Message('分配用户仅支持单条数据');
      } else {
        this.disUser = true;
        this.roleId = this.$refs.table.getSelection()[0].id;
      }
    },
    //分配用户
    distUser(data) {
      this.disUser = true;
      this.roleId = this.datas[this.datas.indexOf(data)].id;
    },
    //权限分配
    disPerm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要分配权限的角色');
      } else if (this.$refs.table.getSelection().length > 1) {
        this.$Message('分配权限仅支持单条数据');
      } else {
        this.userPower = true;
        this.roleId = this.$refs.table.getSelection()[0].id;
      }
    },
    //修改数据
    modify(data) {
      this.updateRole = true;
      this.$refs.update.getData(this.datas[this.datas.indexOf(data)].id);
    },
    //逐条删除数据
    del(data) {
      let ids = [];
      this.$Confirm('确定删除？', '删除')
        .then(() => {
          ids.push(data.id);
          this.roleList.ids = ids.join(',');
          this.datas.splice(this.datas.indexOf(data), 1);
          R.roleManage.roleDelete(roleModel.dispose(this.roleList)).then(resp => {
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
    changePage() {
      this.roleList.page = this.pagination.page;
      this.roleList.size = this.pagination.size;
      this.getData();
    },
    close() {
      this.addRole = false;
      this.updateRole = false;
      this.disUser = false;
      this.userPower = false;
    },
    member(data) {
      this.$router.push({ name: 'rolemember-list', params: { Id: data.id } });
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    select(data){
      if(data.length>0){
        this.allotUser=true;
        this.allotLimit=true;
      }else{
        this.allotUser=false;
        this.allotLimit=false;
      }
    },
    trigger(data) {
      if (data == 'modify') {
        this.$refs.update.getData(this.oneData.id);
        this.updateRole = true;
      } else if (data == 'allot') {
        this.roleId = this.datas[this.oneData.id];
        this.disUser = true;
      } else if (data == 'member') {
        this.$router.push({ name: 'rolemember-list', params: { Id: this.oneData.id } });
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(data.id);
            this.roleList.ids = ids.join(',');
            this.datas.splice(this.datas.indexOf(data), 1);
            R.roleManage.roleDelete(roleModel.dispose(this.roleList)).then(resp => {
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
    getOneData(data){
      this.oneData=data;
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

