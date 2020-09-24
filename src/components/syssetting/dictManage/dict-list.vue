<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            字典名称：
            <input type="text" v-model="dictList.dictName" />&nbsp;&nbsp;
            字典编码：
            <input type="text" v-model="dictList.dictCode" />&nbsp;&nbsp;
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
              @click="AddDict"
              v-has="'dictManageaddgroup'"
            >新增字典</Button>
            <Button color="blue" icon="h-icon-plus" @click="AddDataDict" v-has="'dictManageadd'">新增数据</Button>
            <!-- <Button color="green" icon="h-icon-edit" @click="update" v-has="'dictManageupdate'">修改</Button> -->
            <Button
              v-show="deleteBtn"
              color="red"
              icon="h-icon-close"
              @click="remove"
              v-has="'dictManagedelete'"
            >删除</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
              <TableItem title="序号" prop="$serial" :width="40" align="center"></TableItem>
              <TableItem title="字典名称/字典标签" prop="dictName" :width="150" align="left" treeOpener></TableItem>
              <TableItem title="字典编码/字典键值" prop="dictCode" :width="150" align="left"></TableItem>
              <TableItem title="备注" prop="remarks" :width="200" align="left"></TableItem>
              <TableItem title="创建时间" prop="createTime" align="left" :width="150"></TableItem>
              <TableItem title="操作" prop="operation" align="center" :width="150">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s h-btn-blue"
                    @click="modify(data)"
                    v-has="'dictManageupdate'"
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
    <AddDict :addDict="addDict"></AddDict>
    <UpdateDict :updateDict="updateDict" ref="update"></UpdateDict>
    <AddDataDict :addDataDict="addDataDict" :DictName="DictName" ref="add"></AddDataDict>
    <UpdateDataDict :updateDataDict="updateDataDict" :DictName="DictName" ref="updateData"></UpdateDataDict>
  </div>
</template>

<script>
import dictModel from 'model/dictionary/dictItemModel';
import dictDataModel from 'model/dictionary/dictDataModel';
import dictadd from './components/dict-add';
import dictupdate from './components/dict-update';
import dictadddata from './components/dict-addData';
import dictupdatedata from './components/dict-updateData';
export default {
  components: {
    AddDict: dictadd,
    UpdateDict: dictupdate,
    AddDataDict: dictadddata,
    UpdateDataDict: dictupdatedata
  },
  data() {
    return {
      dictList: dictModel.parse({}),
      dictDataList: dictDataModel.parse({}),
      addDict: false,
      updateDict: false,
      addDataDict: false,
      updateDataDict: false,
      datas: [],
      DictName: [],
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
      this.dictDataList.page = this.pagination.page;
      this.dictDataList.size = this.pagination.size;
      this.isLoading = true;
      R.dictManage.dictFindAll(dictModel.dispose(this.dictList)).then(resp => {
        // console.log(resp);
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
      R.dictManage.dictFindAllDep(dictModel.dispose(this.dictList)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.DictName = resp.body;
        }
      });
    },
    //根据筛选条件查询
    search() {
      this.getData();
      this.dictList.page = this.pagination.page;
      this.dictList.size = this.pagination.size;
    },
    //重置筛选条件
    reset() {
      this.dictList.dictName = '';
      this.dictList.dictCode = '';
    },
    //新增字典
    AddDict() {
      this.addDict = true;
    },
    //新增数据
    AddDataDict() {
      this.addDataDict = true;
    },
    //修改字典
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要修改的字典');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('修改仅支持单条字典');
        } else {
          if (this.$refs.table.getSelection()[0].children) {
            this.updateDict = true;
            this.$refs.update.getData(this.$refs.table.getSelection()[0].id);
          } else {
            this.updateDataDict = true;
            this.$refs.updateData.getData(this.$refs.table.getSelection()[0].id);
          }
        }
      }
    },
    //编辑字典
    modify(data) {
      if (data.children) {
        this.updateDict = true;
        this.$refs.update.getData(data.id);
      } else {
        this.updateDataDict = true;
        this.$refs.updateData.getData(data.id);
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
            this.deptList.ids = ids.join(',');
            R.dictManage.dictDelete(dictModel.dispose(this.dictList)).then(resp => {
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
          this.dictList.ids = ids.join(',');
          R.dictManage.dictDelete(dictModel.dispose(this.dictList)).then(resp => {
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
      this.addDict = false;
      this.updateDict = false;
      this.addDataDict = false;
      this.updateDataDict = false;
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
        if (this.oneData.children) {
          this.$refs.update.getData(this.oneData.id);
          this.updateDict = true;
        } else {
          this.$refs.updateData.getData(this.oneData.id);
          this.updateDataDict = true;
        }
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(data.id);
            this.dictList.ids = ids.join(',');
            R.dictManage.dictDelete(dictModel.dispose(this.dictList)).then(resp => {
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
/deep/ .h-table-header{
  background: #f5f5f5;
}
</style>

