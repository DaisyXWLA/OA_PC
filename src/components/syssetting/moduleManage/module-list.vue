<style lang='less'>
</style>

<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            模块名称：
            <input type="text" v-model="moduleList.modelName" />&nbsp;&nbsp;
            模块编号：
            <input type="text" v-model="moduleList.modelCode" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add" v-has="'moduleManageadd'">新增</Button>
            <!-- <Button color="green" icon="h-icon-edit" @click="update" v-has="'moduleManageupdate'">修改</Button> -->
            <Button
              v-show="deleteBtn"
              color="red"
              icon="h-icon-close"
              @click="remove"
              v-has="'moduleManagedelete'"
            >删除</Button>
            <!-- <Button v-color:white v-bg-color:#8b04e4 icon="h-icon-menu" @click="confirm">展开/折叠</Button> -->
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
              <TableItem :width="40" title="序号" prop="$serial" align="center"></TableItem>
              <TableItem :width="100" title="模块名称" prop="modelName" align="left" treeOpener></TableItem>
              <TableItem :width="100" title="模块编号" prop="modelCode" align="left"></TableItem>
              <TableItem :width="50" title="模块排行" prop="sortValue" align="center"></TableItem>
              <TableItem title="模块地址" prop="modelUrl" align="left" :width="100"></TableItem>
              <!-- <TableItem title="备注" prop="name"></TableItem> -->
              <TableItem title="操作" prop="operation" align="center" :width="100">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s h-btn-blue"
                    @click="modify(data)"
                    v-has="'moduleManageupdate'"
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
    <AddModule :addModule="addModule" :action="action" :modules="modules"></AddModule>
    <UpdateModule :updateModule="updateModule" :action="action" :modules="modules" ref="update"></UpdateModule>
  </div>
</template>

<script>
import moduleModel from 'model/module/moduleModel';
import moduleadd from './components/module-add';
import moduleupdate from './components/module-update';
export default {
  components: {
    AddModule: moduleadd,
    UpdateModule: moduleupdate
  },
  data() {
    return {
      moduleList: moduleModel.parse({}),
      addModule: false,
      updateModule: false,
      datas: [],
      action: [],
      modules: [],
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
      this.moduleList.page = this.pagination.page;
      this.moduleList.size = this.pagination.size;
      this.isLoading = true;
      R.moduleManage.moduleFindAll(moduleModel.dispose(this.moduleList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
      //获取所有按钮
      R.moduleManage.moduleFindAllAction(moduleModel.dispose(this.moduleList)).then(resp => {
        if (resp.ok) {
          this.action = resp.body;
        }
      });
      //获取所有模块
      R.moduleManage.moduleFindAllModule(moduleModel.dispose(this.moduleList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.modules = resp.body;
        }
      });
    },
    findAll() {
      this.moduleList.page = this.pagination.page;
      this.moduleList.size = this.pagination.size;
      R.moduleManage.moduleFindAll(moduleModel.dispose(this.moduleList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
    },
    //根据筛选条件查询
    search() {
      this.getData();
      this.moduleList.page = this.pagination.page;
      this.moduleList.size = this.pagination.size;
    },
    //重置筛选条件
    reset() {
      this.moduleList.modelName = '';
      this.moduleList.modelCode = '';
    },
    //新增数据
    add() {
      this.addModule = true;
    },
    //修改数据
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要修改的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('修改仅支持单条数据');
        } else {
          this.updateModule = true;
          this.$refs.update.getData(this.$refs.table.getSelection()[0].id);
        }
      }
    },
    //编辑数据
    modify(data) {
      this.updateModule = true;
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
            this.moduleList.ids = ids.join(',');
            // console.log(his.moduleList.ids)
            R.moduleManage.moduleDelete(moduleModel.dispose(this.moduleList)).then(resp => {
              if (resp.ok) {
                this.$Message.success('数据刪除成功');
                setTimeout(() => {
                  this.findAll();
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
          this.moduleList.ids = ids.join(',');
          this.datas.splice(this.datas.indexOf(data), 1);
          R.moduleManage.moduleDelete(moduleModel.dispose(this.moduleList)).then(resp => {
            if (resp.ok) {
              this.$Message.success('数据刪除成功');
              setTimeout(() => {
                this.findAll();
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
      this.addModule = false;
      this.updateModule = false;
    },
    //折叠展开
    confirm() {
      // if (this.$refs.table.getSelection().length < 1) {
      //   this.$Message('请选择要展开/折叠的数据');
      // }
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
    trigger(data) {
      if (data == 'modify') {
        this.$refs.update.getData(this.oneData.id);
        this.updateModule = true;
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(data.id);
            this.moduleList.ids = ids.join(',');
            this.datas.splice(this.datas.indexOf(data), 1);
            R.moduleManage.moduleDelete(moduleModel.dispose(this.moduleList)).then(resp => {
              if (resp.ok) {
                this.$Message.success('数据刪除成功');
                setTimeout(() => {
                  this.findAll();
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
