<style lang='less'>
</style>

<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            部门名称：
            <input type="text" v-model="deptList.departmentName" />&nbsp;&nbsp;
            部门编号：
            <input type="text" v-model="deptList.departmentCode" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add" v-has="'deptManageadd'">新增</Button>
            <!-- <Button color="green" icon="h-icon-edit" @click="update" v-has="'deptManageupdate'">修改</Button> -->
            <!-- <Button color="red" icon="h-icon-close" @click="remove">删除</Button> -->
            <!-- <Button v-color:white v-bg-color:#8b04e4 icon="h-icon-menu" @click="confirm">展开/折叠</Button> -->
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" checkbox>
              <TableItem title="序号" prop="$serial" :width="40" align="center"></TableItem>
              <TableItem title="部门名称" prop="departmentName" align="left" :width="80" treeOpener></TableItem>
              <TableItem title="部门编号" prop="departmentCode" align="left" :width="60"></TableItem>
              <TableItem title="上级部门" prop="parentDepName" :width="80" align="left"></TableItem>
              <TableItem title="排序值" prop="sortValue" align="center" :width="50"></TableItem>
              <TableItem title="创建人" prop="creatorName" align="left" :width="80"></TableItem>
              <TableItem title="创建时间" prop="createTime" align="left" :width="150"></TableItem>
              <!-- <TableItem title="备注" prop="name"></TableItem> -->
              <TableItem title="操作" prop="operation" align="center" :width="120">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s h-btn-blue"
                    @click="modify(data)"
                    v-has="'deptManageupdate'"
                  >
                    <i class="h-icon-edit"></i>
                    编辑
                  </button>
                  <!-- <button
                    class="h-btn h-btn-s h-btn-red"
                    @click="del(data)"
                    v-has="'deptManagedelete'"
                  >
                    <i class="h-icon-close"></i>&nbsp;删除
                  </button>-->
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
    <AddDept :addDept="addDept" :department="department"></AddDept>
    <UpdateDept :updateDept="updateDept" :department="department" ref="update"></UpdateDept>
  </div>
</template>

<script>
import { write } from 'fs';
import deptadd from './components/dept-add';
import deptupdate from './components/dept-update';
import deptModel from 'model/department/deptModel';
export default {
  components: {
    AddDept: deptadd,
    UpdateDept: deptupdate
  },
  data() {
    return {
      deptList: deptModel.parse({}),
      addDept: false,
      updateDept: false,
      department: [],
      datas: [],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      isLoading: false,
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
    //根据筛选条件查询
    search() {
      this.getData();
      this.deptList.page = this.pagination.page;
      this.deptList.size = this.pagination.size;
    },
    //重置筛选条件
    reset() {
      this.deptList.departmentName = '';
      this.deptList.departmentCode = '';
    },
    changePage() {
      this.getData();
    },
    close() {
      this.addDept = false;
      this.updateDept = false;
    },
    //新增数据
    add() {
      this.addDept = true;
    },
    //获取所有数据列表
    getData() {
      this.deptList.page = this.pagination.page;
      this.deptList.size = this.pagination.size;
      this.isLoading = true;
      R.deptManage.departmentFindAll(deptModel.dispose(this.deptList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
      R.deptManage.departmentFindAllDepartment(deptModel.dispose(this.deptList)).then(resp => {
        // console.log(resp.body)
        if (resp.ok) {
          this.department = resp.body;
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
          this.updateDept = true;
          this.$refs.update.getData(this.$refs.table.getSelection()[0].id);
        }
      }
    },
    //编辑数据
    modify(data) {
      this.updateDept = true;
      this.$refs.update.getData(data.id);
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
            this.deptList.ids = ids.join(',');
            R.deptManage.departmentDelete(deptModel.dispose(this.deptList)).then(resp => {
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
          this.deptList.ids = ids.join(',');
          R.deptManage.departmentDelete(deptModel.dispose(this.deptList)).then(resp => {
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
    //折叠展开
    confirm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要展开/折叠的数据');
      }
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    trigger(data) {
      if (data == 'modify') {
        this.$refs.update.getData(this.oneData.id);
        this.updateDept = true;
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(data.id);
            this.deptList.ids = ids.join(',');
            R.deptManage.departmentDelete(deptModel.dispose(this.deptList)).then(resp => {
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
