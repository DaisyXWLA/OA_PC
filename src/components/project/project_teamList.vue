<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <div class="h-panel">
      <div class="h-panel-body">
        <Button color="blue" icon="h-icon-plus" @click="add">新增</Button>
        <!-- <Button color="green" icon="h-icon-edit" @click="update">修改</Button> -->
        <Button v-show="deleteBtn" color="red" icon="h-icon-close" @click="remove">删除</Button>
        <!-- <button class="h-btn h-btn-blue" style="float: right" @click="back">
          <i class="icon-reply">&nbsp;&nbsp;返回</i>
        </button>-->
        <div style="margin-top: 10px">
          <Table ref="table" :datas="datas" :loading="isLoading" @select="select" checkbox>
            <TableItem title="序号" :width="40" prop="$serial" align="center"></TableItem>
            <TableItem :width="150" title="项目成员" prop="memberName" align="left"></TableItem>
            <TableItem :width="80" title="部门" prop="department" align="left"></TableItem>
            <TableItem :width="80" title="职位" prop="position" align="left"></TableItem>
            <TableItem :width="150" title="手机号" prop="phoneNumber" align="left"></TableItem>
            <TableItem :width="150" title="邮箱" prop="email" align="left"></TableItem>
            <TableItem :width="120" title="操作" prop align="center">
              <template slot-scope="{data}">
                <button class="h-btn h-btn-s h-btn-blue" v-color:white @click="updateT(data)">
                  <span>
                    <i class="h-icon-edit" style="vertical-align: top"></i>&nbsp;编辑
                  </span>
                </button>
                <!-- <button class="h-btn h-btn-s h-btn-red" v-color:white @click="del(data)">
                  <span>
                    <i class="icon-cross" style="vertical-align: top"></i>&nbsp;删除
                  </span>
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
        </div>
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
    <AddPerson :addPerson="addPerson" :projectId="projectId" :title="title"></AddPerson>
    <UpdatePerson ref="child" :updatePerson="updatePerson" :projectId="projectId" :title="title"></UpdatePerson>
  </div>
</template>

<script>
import add from './components/project_addPerson';
import update from './components/project_updateMember';
import projectmanageModel from 'model/projectmanage/projectmanageModel';
export default {
  components: {
    AddPerson: add,
    UpdatePerson: update
  },
  data() {
    return {
      projectmanageSearch: projectmanageModel.parse({}),
      addPerson: false,
      updatePerson: false,
      projectId: '',
      pagination: {
        page: 1,
        size: 20,
        total: 100
      },
      isLoading: false,
      datas: [],
      title: '',
      deleteBtn: false,
      oneData: {},
      param: [
        { title: '编辑', key: 'modify' },
        { title: '删除', key: 'delete' }
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    search(data) {
      this.getData(true);
      this.addPerson = false;
    },
    changePage() {
      this.getData(true);
      this.addPerson = false;
    },
    getData() {
      this.projectId = this.$route.params.Id;
      this.projectmanageSearch.projectInfo = this.$route.params.Id;
      this.projectmanageSearch.page = this.pagination.page;
      this.projectmanageSearch.size = this.pagination.size;
      this.isLoading = true;
      R.Projectmanage.findMemberAll(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
        if (resp.ok) {
          this.isLoading = false;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
    },
    add() {
      this.title = '新增项目成员';
      this.addPerson = false;
      this.updatePerson = false;
      this.addPerson = true;
    },
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要修改的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('修改仅支持单条数据');
        } else {
          this.$refs.child.getData(this.$refs.table.getSelection()[0].id);
          this.opened = false;
          this.updatePerson = false;
          this.updatePerson = true;
          this.title = '修改项目成员';
        }
      }
    },
    updateT(data) {
      this.$refs.child.getData(data.id);
      this.opened = false;
      this.updatePerson = false;
      this.updatePerson = true;
      this.title = '修改项目成员';
    },
    currentChange(value) {},
    remove() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
              ids.push(this.$refs.table.getSelection()[i].id);
            }
            this.projectmanageSearch.ids = ids.join(',');
            R.Projectmanage.MemberDel(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
              if (resp.ok) {
                this.$Message.success('刪除成功');
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
    del(data) {
      this.$Confirm('确定删除？', '删除')
        .then(() => {
          this.projectmanageSearch.ids = data.id;
          R.Projectmanage.MemberDel(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('刪除成功');
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
    back() {
      this.$router.push({ name: 'projectList', params: { index: 1 } });
    },
    confirm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        if (this.$refs.table.getSelection().length >= 1) {
          this.$Confirm('确定删除？')
            .then(() => {
              this.$Message.success('删除成功！');
            })
            .catch(() => {
              this.$Message.error('取消删除');
            });
        }
      }
    },
    close() {
      this.addPerson = false;
      this.updatePerson = false;
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
        this.$refs.child.getData(this.oneData.id);
        this.updatePerson = true;
        this.title = '修改项目成员';
      } else if (data == 'delete') {
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            this.projectmanageSearch.ids = this.oneData.id;
            R.Projectmanage.MemberDel(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
              if (resp.ok) {
                this.$Message.success('刪除成功');
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
  height: calc(100vh - 60px - 45px - 30px - 30px);
}
/deep/ .h-table {
  max-height: calc(100vh - 60px - 45px - 30px - 30px - 25px - 25px - 50px - 32px);
  overflow: auto;
}
</style>
