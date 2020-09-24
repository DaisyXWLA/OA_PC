<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            项目名称：
            <input type="text" v-model="projectmanageSearch.projectName" />&nbsp;&nbsp;负责人：
            <input type="text" v-model="projectmanageSearch.projectLeader" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div style="position:relative;">
              <div style="position:absolute;left:0;">
                <button class="h-btn h-btn-blue" @click="opened=true" v-has="'projectListadd'">
                  <i class="h-icon-plus"></i>
                  <span>新增</span>
                </button>
                <!-- <button class="h-btn h-btn-green" @click="update" v-has="'projectListupdate'">
                  <i class="h-icon-edit"></i>
                  <span>修改</span>
                </button>-->
                <button
                  v-show="deleteBtn"
                  class="h-btn h-btn-red"
                  @click="remove"
                  v-has="'projectListdelete'"
                >
                  <i class="h-icon-close"></i>
                  <span>删除</span>
                </button>
              </div>
            </div>
            <div style="margin-top: 50px">
              <Table
                ref="table"
                :loading="isLoading"
                :datas="datas"
                @select="showBtn"
                :checkbox="checkbox"
                :height="tableHeight"
              >
                <TableItem :width="40" title="序号" prop="$serial" align="center" fixed="left"></TableItem>
                <!-- <TableItem :width="150" title="项目编号" align="center">
                  <template slot-scope="{data}">
                    <a href="#" @click="view(datas,data)">{{ data.projectCode }}</a>
                  </template>
                </TableItem>-->
                <TableItem :width="200" title="项目名称" align="left" fixed="left">
                  <template slot-scope="{data}">
                    <a href="#" @click="view(datas,data)">{{ data.projectName }}</a>
                  </template>
                </TableItem>
                <TableItem :width="100" prop="projectLeader" title="项目负责人" align="left"></TableItem>
                <TableItem :width="280" title="项目周期" align="left">
                  <template slot-scope="{data}">
                    <span>{{data.planStartDate}} 至 {{data.planEndDate}}</span>
                  </template>
                </TableItem>
                <TableItem :width="80" title="项目类型" align="left">
                  <template slot-scope="{data}">
                    <div v-if="data.projectType==0">
                      <span>短期项目</span>
                    </div>
                    <div v-else-if="data.projectType==1">
                      <span>长期项目</span>
                    </div>
                    <div v-else-if="data.projectType==2">
                      <span>运维项目</span>
                    </div>
                  </template>
                </TableItem>
                <TableItem :width="200" title="项目团队成员" align="left">
                  <template slot-scope="{data}">
                    <TextEllipsis
                      :text="data.memberNames"
                      :height="25"
                      more="..."
                      tooltipTheme="white"
                      useTooltip
                    ></TextEllipsis>
                  </template>
                </TableItem>
                <TableItem :width="150" prop="operation" title="操作" align="center" fixed="right">
                  <template slot-scope="{data}">
                    <!-- <button
                      class="h-btn h-btn-s h-btn-green"
                      @click="modify(data)"
                      v-has="'projectListupdate'"
                    >
                      <i class="h-icon-edit">&nbsp;编辑</i>
                    </button>-->
                    <button
                      class="h-btn h-btn-s h-btn-blue"
                      style="vertical-align:middle"
                      @click="modify(data)"
                      v-has="'projectListupdate'"
                    >
                      <i class="h-icon-edit"></i>
                      <span>编辑</span>
                    </button>
                    <DropdownMenu
                      class="oper-btn"
                      button
                      v-color:white
                      v-bg-color:#8b04e4
                      @click="trigger"
                      @show="saveData(data.id)"
                      :datas="moreBtn"
                    >更多</DropdownMenu>
                    <!-- <button
                      class="h-btn h-btn-s h-btn-yellow"
                      @click="openTeam(data)"
                      v-has="'projectListteam'"
                    >
                      <i class="h-icon-users">&nbsp;团队</i>
                    </button>
                    <button
                      class="h-btn h-btn-s h-btn-red"
                      @click="del(data)"
                      v-has="'projectListdelete'"
                    >
                      <i class="h-icon-close">&nbsp;删除</i>
                    </button>-->
                  </template>
                </TableItem>
                <div slot="empty">暂时无数据</div>
              </Table>
              <p v-height="15"></p>
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
    <AddProject ref="childS" :opened="opened" :title="title"></AddProject>
    <UpdateProject ref="child" :projectUpdate="projectUpdate" :title="title" :projectId="projectId"></UpdateProject>
    <ViewProject ref="childT" :projectView="projectView" :title="title" :projectId="projectId"></ViewProject>
  </div>
</template>
<script>
import add from './components/project_add';
import projectUpdate from './components/project_modify';
import projectView from './components/project_detail';
import projectmanageModel from 'model/projectmanage/projectmanageModel';
export default {
  components: {
    AddProject: add,
    UpdateProject: projectUpdate,
    ViewProject: projectView
  },
  data() {
    return {
      projectmanageSearch: projectmanageModel.parse({}),
      height: '600',
      checkbox: true,
      tableHeight: 0,
      deleteBtn: false,
      projectId: '',
      opened: false,
      projectUpdate: false,
      projectView: false,
      item: '',
      name: '',
      datas: [],
      title: '',
      params: {},
      pagination: {
        page: 1,
        size: 20,
        total: 100
      },
      data: {},
      isLoading: false,
      select: [],
      index: 0,
      checkData: '',
      moreBtn: [
        { title: '编辑', key: 'modify' },
        { title: '详情', key: 'detail' },
        { title: '团队', key: 'team' },
        { title: '删除', key: 'delete' }
      ]
    };
  },
  watch: {
    $route(to, from) {}
  },
  mounted() {
    this.init();
    // this.tableHeight=document.body.scrollHeight - 30 - 30 - 72 - 18 - 25 - 25 - 50 - 32 - 48 -31 -32;
    // console.log(this.tableHeight,document.body.scrollHeight)
    this.$nextTick(() => {
      document.querySelector('.h-table-fixed-header-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-header-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
    });
    document.addEventListener('scroll', this.winScroll, true);
  },
  methods: {
    init() {
      this.getData();
      this.timer();
    },
    timer() {
      setInterval(() => {
        if (this.$route.params.index > 0) {
          this.$route.params.index = 0;
          this.index = 1;
        }
        if (this.index > 0) {
          this.$router.go(0);
          this.index = 0;
        }
      }, 2000);
    },
    changePage() {
      this.projectmanageSearch.page = this.pagination.page;
      this.projectmanageSearch.size = this.pagination.size;
      this.getData();
    },
    search() {
      this.projectmanageSearch.page = this.pagination.page;
      this.projectmanageSearch.size = this.pagination.size;
      this.getData();
    },
    //控制批量删除按钮
    showBtn(data) {
      if (data.length > 0) {
        this.deleteBtn = true;
      } else {
        this.deleteBtn = false;
      }
    },
    getData() {
      this.projectmanageSearch.page = this.pagination.page;
      this.projectmanageSearch.size = this.pagination.size;
      // console.log(this.projectmanageSearch.page,this.projectmanageSearch.size)
      this.isLoading = true;
      R.Projectmanage.projectmanageList(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
        // console.log(resp)
        if (resp.ok) {
          this.isLoading = false;
          this.tableHeight = parseInt(window.getComputedStyle(document.querySelector('.h-panel-body')).height) - 164;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.size = resp.size;
          this.pagination.total = resp.total;
        }
      });
    },
    close() {
      this.opened = false;
      this.projectUpdate = false;
      this.projectView = false;
    },
    //批量删除
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
            R.Projectmanage.projectmanageDel(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
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
    //逐条删除数据
    del(data) {
      let ids = [];
      this.$Confirm('确定删除？', '删除')
        .then(() => {
          ids.push(data.id);
          this.projectmanageSearch.ids = ids.join(',');
          R.Projectmanage.projectmanageDel(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
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
    reset() {
      this.projectmanageSearch.projectName = '';
      this.projectmanageSearch.projectLeader = '';
    },
    openTeam(data) {
      this.$router.push({ name: 'project_teamList', params: { Id: data.id } });
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    add() {
      this.projectmanageSearch = projectmanageModel.parse({});
      this.opened = false;
      this.projectUpdate = false;
      this.projectView = false;
      this.opened = true;
      this.title = '新增项目';
    },
    view(datas, data) {
      this.opened = false;
      this.projectUpdate = false;
      this.opened = false;
      this.$refs.childT.getData(data.id, datas.indexOf(data));
      this.projectView = true;
      this.title = '项目详情';
      //this.$router.push({ name: 'projectview' });
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
          this.projectUpdate = false;
          this.projectView = false;
          this.projectUpdate = true;
          this.title = '修改项目';
        }
      }
    },
    trigger(code) {
      if (code == 'detail') {
        this.opened = false;
        this.projectUpdate = false;
        this.opened = false;
        this.$refs.childT.getData(this.checkData);
        this.projectView = true;
        this.title = '项目详情';
      }
      if (code == 'modify') {
        this.$refs.child.getData(this.checkData);
        this.opened = false;
        this.projectUpdate = false;
        this.projectView = false;
        this.projectUpdate = true;
        this.title = '修改项目';
      }
      if (code == 'team') {
        this.$router.push({ name: 'project_teamList', params: { Id: this.checkData } });
      }
      if (code == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(this.checkData);
            this.projectmanageSearch.ids = ids.join(',');
            R.Projectmanage.projectmanageDel(projectmanageModel.dispose(this.projectmanageSearch)).then(resp => {
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
    saveData(data) {
      this.checkData = data;
    },
    modify(data) {
      this.projectUpdate = true;
      this.title = '修改项目';
      this.$refs.child.getData(data.id);
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
/deep/ .h-table-header {
  background: #f5f5f5;
}
.h-table-header /deep/ table {
  background: #f5f5f5;
}
</style>