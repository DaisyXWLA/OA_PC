<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            登录名称：
            <input type="text" v-model="userList.loginName" />&nbsp;&nbsp;
            用户名称：
            <input type="text" v-model="userList.realName" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add">新增</Button>
            <Button v-show="deleteBtn" color="red" icon="h-icon-close" @click="remove">删除</Button>
            <Button color="yellow" icon="icon-reply" @click="back">返回</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
              <TableItem title="序号" prop="$serial" :width="40" align="center"></TableItem>
              <TableItem :width="80" title="角色名称" prop="roleName" align="left"></TableItem>
              <TableItem title="登录名称" prop="loginName" :width="80" align="left"></TableItem>
              <TableItem title="用户名称" prop="realName" :width="80" align="left"></TableItem>
              <TableItem title="部门" prop="departmentName" :width="80" align="left"></TableItem>
              <!-- <TableItem title="职位" prop="time"></TableItem> -->
              <TableItem title="手机号" prop="phoneNumber" :width="120" align="left"></TableItem>
              <TableItem title="邮箱" prop="email" :width="150" align="left"></TableItem>
              <TableItem :width="150" title="创建时间" prop="createTime" align="left"></TableItem>
              <TableItem title="操作" prop="operation" :width="80" align="center">
                <template slot-scope="{data}">
                  <button class="h-btn h-btn-s h-btn-red" @click="del(data)">
                    <i class="h-icon-close"></i>&nbsp;删除
                  </button>
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
    <AddRoleMember :addRoleMember="addRoleMember" :roleId="roleId"></AddRoleMember>
  </div>
</template>

<script>
import userModel from 'model/user/userModel';
import roleUserModel from 'model/role/roleUserModel';
import rolememberadd from './components/rolemember-add';
export default {
  components: {
    AddRoleMember: rolememberadd,
  },
  data() {
    return {
      userList:userModel.parse({}),
      roleUserList:roleUserModel.parse({}),
      addRoleMember: false,
      datas: [],
      roleId:'',
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      isLoading: false,
      deleteBtn:false
    };
  },
  mounted() {
    this.getData();
  },
  //返回后刷新页面
  watch: {
    $route() {
      if (this.$route.params.Id != null) {
        this.getData();
      }
    }
  },
  methods: {
    getData() {
      this.roleUserList.id=this.$route.params.Id;
      this.roleUserList.page=this.pagination.page;
      this.roleUserList.size=this.pagination.size;
      R.roleManage.roleFindMembers(roleUserModel.dispose(this.roleUserList)).then(resp=>{
        // console.log(resp)
        if(resp.ok){
          this.datas=resp.body;
          this.pagination.page=resp.page;
          this.pagination.total=resp.total;
        }
      });
    },
    search() {
      this.getData();
      this.userList.page=this.pagination.page;
      this.userList.size=this.pagination.size;
    },
    reset() {
      this.userList.loginName='';
      this.userList.realName='';
    },
    add() {
        this.roleId=this.$route.params.Id;
        this.addRoleMember=true;      
    },
   //删除数据（可批量删除）
    remove() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        let ids = [];
        this.$Confirm('确定删除？', '删除').then(() => {
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.roleUserList.ids = ids.join(',');
          // this.roleUserList.roleId = this.roleId;
          this.roleUserList.id = this.$route.params.Id;
          // console.log(this.roleUserList.ids,this.roleUserList.roleId)
          R.roleManage.roleMemberDelete(roleUserModel.dispose(this.roleUserList)).then(resp => {
            if (resp.ok) {
              this.$Message.success('数据刪除成功');
              setTimeout(() => {
                this.getData();
              }, 2000);
            }
          });
        })
      }
    },
    //逐条删除数据
    del(data){
      let ids=[];
      this.$Confirm('确定删除？', '删除').then(() => {
        ids.push(data.id);
        this.roleUserList.ids = ids.join(',');
        this.roleUserList.id = this.$route.params.Id;
        R.roleManage.roleMemberDelete(roleUserModel.dispose(this.roleUserList)).then(resp => {
          if (resp.ok) {
            this.$Message.success('数据刪除成功');
            setTimeout(() => {
              this.getData();
            }, 2000);
          }
        });
      }).catch(()=>{
        this.$emit('close')
      })
    },
    back() {
      this.$router.push({name:'roleManage'});
    },
    changePage() {
      this.userList.page=this.pagination.page;
      this.userList.size=this.pagination.size;
      this.getData();
    },
    close() {
      this.addRoleMember = false;
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    //控制批量删除按钮
    select(data) {
      if (data.length > 0) {
        this.deleteBtn = true;
      } else {
        this.deleteBtn = false;
      }
    },
  }
};
</script>
<style lang="less" scoped>
/deep/ .h-panel-body {
  height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px);
}
/deep/ .h-table {
  max-height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px - 25px - 25px - 50px - 32px);
  overflow: auto;
}
</style>
