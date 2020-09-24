<style lang='less'>
</style>

<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            按钮分组：
            <input type="text" v-model="btnGroupList.groupName" />&nbsp;&nbsp;
            按钮代码：
            <input type="text" v-model="btnGroupList.actionCode" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button
              color="blue"
              icon="h-icon-plus"
              @click="addGroup"
              v-has="'btnManageaddgroup'"
            >新增分组</Button>
            <Button color="blue" icon="h-icon-plus" @click="add" v-has="'btnManageadd'">新增</Button>
            <!-- <Button color="green" icon="h-icon-edit" @click="update"  v-has="'btnManageupdate'">修改</Button> -->
            <Button
              v-show="deleteBtn"
              color="red"
              icon="h-icon-close"
              @click="remove"
              v-has="'btnManagedelete'"
            >删除</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
              <TableItem title="序号" prop="$serial" align="center" :width="40"></TableItem>
              <TableItem title="按钮分组/按钮名称" prop="groupName" align="left" :width="150" treeOpener></TableItem>
              <TableItem title="按钮代码" prop="actionCode" align="left" :width="80"></TableItem>
              <TableItem title="按钮排序" prop="sortValue" align="center" :width="80"></TableItem>
              <TableItem title="按钮描述" prop="remarks" align="left" :width="150"></TableItem>
              <TableItem title="操作" prop="operation" align="center" :width="150">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s h-btn-blue"
                    @click="modify(data)"
                    v-has="'btnManageupdate'"
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
    <AddBtn :addBtn="addBtn" :btnGroup="btnGroup"></AddBtn>
    <AddBtnGroup :addBtnGroup="addBtnGroup" :btnGroup="btnGroup"></AddBtnGroup>
    <UpdateBtn :updateBtn="updateBtn" :btnGroup="btnGroup" ref="update"></UpdateBtn>
    <UpdateBtnGroup :updateBtnGroup="updateBtnGroup" :btnGroup="btnGroup" ref="updateGroup"></UpdateBtnGroup>
  </div>
</template>

<script>
import btnModel from 'model/button/buttonModel';
import btnGroupModel from 'model/button/buttonGroupModel';
import btnadd from './components/btn-add';
import btnaddGroup from './components/btn-addGroup';
import btnupdate from './components/btn-update';
import btnupdateGroup from './components/btn-updateGroup';
export default {
  components: {
    AddBtn: btnadd,
    AddBtnGroup: btnaddGroup,
    UpdateBtn: btnupdate,
    UpdateBtnGroup: btnupdateGroup
  },
  data() {
    return {
      btnList: btnModel.parse({}),
      btnGroupList: btnGroupModel.parse({}),
      addBtn: false,
      addBtnGroup: false,
      updateBtn: false,
      updateBtnGroup: false,
      datas: [],
      btnGroup: [],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      isLoading: false,
      deleteBtn: false,
      oneData: {},
      param: [
        { title: '编辑', key: 'modify' },
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
      this.btnGroupList.page = this.pagination.page;
      this.btnGroupList.size = this.pagination.size;
      this.isLoading = true;
      R.buttonManage.buttonFindAll(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
      R.buttonManage.buttonFindAllGroup(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
        if (resp.ok) {
          this.btnGroup = resp.body;
        }
      });
    },
    //根据筛选条件查询
    search() {
      this.getData();
      this.btnGroupList.page = this.pagination.page;
      this.btnGroupList.size = this.pagination.size;
    },
    //重置筛选条件
    reset() {
      this.btnGroupList.groupName = '';
      this.btnGroupList.actionCode = '';
    },
    //新增按钮
    add() {
      this.addBtn = true;
    },
    //按钮分组
    addGroup() {
      this.addBtnGroup = true;
    },
    //修改
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要修改的按钮');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('修改仅支持单条按钮');
        } else {
          if (this.$refs.table.getSelection()[0].children) {
            this.updateBtnGroup = true;
            this.$refs.updateGroup.getData(this.$refs.table.getSelection()[0].id);
          } else {
            this.updateBtn = true;
            this.$refs.update.getData(this.$refs.table.getSelection()[0].id);
          }
        }
      }
    },
    //编辑
    modify(data) {
      if (data.children) {
        this.updateBtnGroup = true;
        this.$refs.updateGroup.getData(data.id);
      } else {
        this.updateBtn = true;
        this.$refs.update.getData(data.id);
      }
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
            R.buttonManage.buttonDelete(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
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
          this.btnGroupList.ids = ids.join(',');
          R.buttonManage.buttonDelete(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
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
      this.getData();
    },
    close() {
      this.addBtn = false;
      this.addBtnGroup = false;
      this.updateBtn = false;
      this.updateBtnGroup = false;
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
        if (this.oneData.children) {
          this.$refs.updateGroup.getData(this.oneData.id);
          this.updateBtnGroup = true;
        } else {
          this.$refs.update.getData(this.oneData.id);
          this.updateBtn = true;
        }
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(data.id);
            this.btnGroupList.ids = ids.join(',');
            R.buttonManage.buttonDelete(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
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
