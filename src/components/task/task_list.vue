<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            任务名称：
            <input type="text" @search="search" v-model="taskModel.taskName" />&nbsp; 指派给：
            <Select
              v-model="taskModel.executor"
              :datas="paramExecutor"
              :filterable="true"
              :autosize="true"
            ></Select>&nbsp;&nbsp;&nbsp;
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
                <button class="h-btn h-btn-blue" @click="add" v-has="'taskAssignadd'">
                  <i class="h-icon-plus"></i>
                  <span>新增</span>
                </button>
                <!-- <button class="h-btn h-btn-green" @click="update" v-has="'taskAssignupdate'">
                  <i class="h-icon-edit"></i>
                  <span>修改</span>
                </button>-->
                <button
                  v-show="deleteBtn"
                  class="h-btn h-btn-red"
                  @click="del"
                  v-has="'taskAssigndelete'"
                >
                  <i class="h-icon-close"></i>
                  <span>删除</span>
                </button>
              </div>
              <div style="position: absolute;right:0;" v-width="200">
                <Select
                  v-model="taskModel.projectInfo"
                  :datas="projectOption"
                  placeholder="请选择项目名称"
                  @input="findTask"
                ></Select>
              </div>
            </div>
            <div style="margin-top: 50px;">
              <Table
                ref="table"
                :loading="isLoading"
                :datas="datas"
                :checkbox="checkbox"
                @select="select"
                :height="tableHeight"
              >
                <TableItem :width="40" title="序号" prop="$serial" align="center" fixed="left"></TableItem>
                <TableItem :width="200" title="任务名称" align="left" fixed="left">
                  <template slot-scope="{data}">
                    <a href="#" @click="view(datas,data)">{{ data.taskName }}</a>
                  </template>
                </TableItem>
                <TableItem :width="80" prop="task" title="任务类型" align="left">
                  <template slot-scope="{data}">
                    <div v-if="data.taskType==0">
                      <span>项目任务</span>
                    </div>
                    <div v-else-if="data.taskType==1">
                      <span>突发任务</span>
                    </div>
                    <div v-else-if="data.taskType==2">
                      <span>周期任务</span>
                    </div>
                    <div v-else-if="data.taskType==3">
                      <span>触发任务</span>
                    </div>
                    <div v-else>
                      <span>其他任务</span>
                    </div>
                  </template>
                </TableItem>
                <TableItem :width="80" prop="executorName" title="指派给" align="left"></TableItem>
                <TableItem :width="130" prop="planEndTime" title="截止日期" align="left"></TableItem>
                <TableItem :width="150" prop="projectInfoName" title="关联项目" align="left"></TableItem>
                <TableItem :width="50" prop="planHours" title="预计" align="center"></TableItem>
                <TableItem :width="50" prop="useHours" title="消耗" align="center"></TableItem>
                <TableItem :width="50" prop="task" title="剩余" align="center">
                  <template slot-scope="{data}">
                    <span>{{data.planHours -data.useHours}}</span>
                  </template>
                </TableItem>
                <TableItem :width="50" prop="task" title="进度" align="right">
                  <template slot-scope="{data}">
                    <div v-if="data.status==2">
                      <span>100%</span>
                    </div>
                    <div v-else>
                      <span>{{(data.useHours/data.planHours).toFixed(2)*100}}%</span>
                    </div>
                  </template>
                </TableItem>
                <TableItem :width="90" prop="task" title="任务状态" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.status==0">
                      <span class="h-tag h-tag-bg-gray">未开始</span>
                    </div>
                    <div v-else-if="data.status==-1">
                      <span class="h-tag h-tag-yellow">已关闭</span>
                    </div>
                    <div v-else-if="data.status==1">
                      <span class="h-tag h-tag-yellow">进行中</span>
                    </div>
                    <div v-else-if="data.status==2">
                      <span class="h-tag h-tag-green">已完成</span>
                    </div>
                    <div v-else-if="data.status==3">
                      <span class="h-tag h-tag-red">已超期</span>
                    </div>
                    <div v-else-if="data.status==4">
                      <span class="h-tag h-tag-primary">已暂停</span>
                    </div>
                    <div v-else>
                      <span class="h-tag h-tag-blue">已取消</span>
                    </div>
                  </template>
                </TableItem>
                <TableItem :width="60" prop="task" title="优先级" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.priority==0">
                      <span class="h-tag h-tag-bg-red">重要</span>
                    </div>
                    <div v-else-if="data.priority==1">
                      <span class="h-tag h-tag-bg-yellow">次要</span>
                    </div>
                    <div v-else-if="data.priority==2">
                      <span class="h-tag h-tag-bg-blue">紧急</span>
                    </div>
                    <div v-else-if="data.priority==3">
                      <span class="h-tag h-tag-bg-green">一般</span>
                    </div>
                    <div v-else></div>
                  </template>
                </TableItem>
                <TableItem :width="150" prop="task12" title="操作" align="center" fixed="right">
                  <template slot-scope="{data}">
                    <button
                      class="h-btn h-btn-s h-btn-blue"
                      style="vertical-align:middle"
                      @click="update(data)"
                      v-has="'taskAssignupdate'"
                    >
                      <i class="h-icon-edit"></i>
                      <span>编辑</span>
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
              </Table>
              <p></p>
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
    <task-Add
      ref="child"
      :isAddShow="isAddShow"
      :title="title"
      :projectOption="projectOption"
      :member="member"
      :taskModel="taskModel"
    ></task-Add>
    <task-Update
      ref="childT"
      :isUpdateShow="isUpdateShow"
      :title="title"
      :projectOption="projectOption"
      :member="member"
    ></task-Update>
  </div>
</template>
<script>
import taskAdd from './components/task_add';
import taskView from './components/task_detail';
import taskUpdate from './components/task_modify';
import taskList from 'model/task/taskList';
import taskDel from 'model/task/taskDel';
import myid from 'model/task/taskUpdate';
export default {
  components: {
    'task-Add': taskAdd,
    'task-Update': taskUpdate
  },
  data() {
    return {
      taskProject: '',
      paramExecutor: [],
      taskModel: taskList.parse({}),
      taskDelModel: taskDel.parse({}),
      taskupdateModal: myid.parse({}),
      deletable: false,
      projectOption: [],
      isAddShow: false,
      isUpdateShow: false,
      title: '',
      member: [],
      mode: 'single',
      pagination: {
        page: 1,
        size: 20,
        total: 100
      },
      type: 'China',
      checkbox: true,
      datas: [],
      serial: true,
      isLoading: false,
      index: 0,
      projectInfo: '',
      deleteBtn: false,
      tableHeight: 0,
      param: [
        { title: '编辑', key: 'modify' },
        { title: '详情', key: 'detail' },
        { title: '删除', key: 'delete' }
      ],
      oneData: {}
    };
  },
  mounted() {
    this.init();
    // this.tableHeight=document.body.scrollHeight - 30 - 30 - 72 - 18 - 25 - 25 - 50 - 32 - 150;
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
      if (Utils.getLocal('taskProject').length > 0) {
        this.findTask(Utils.getLocal('taskProject'));
      } else {
        R.ProjectTask.findPullDown().then(resp => {
          if (resp.ok) {
            this.paramExecutor = resp.body;
          }
        });
        this.getData();
      }
    },
    change(data) {},
    changePage() {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.getData();
    },
    search(data) {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.getData();
    },
    reset() {
      this.taskModel.taskName = '';
      this.taskModel.executor = '';
    },
    add() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isViewShow = false;
      this.$refs.child.getList();
      this.title = '新增任务分派';
      this.isAddShow = true;
      this.projectInfo = this.taskModel.projectInfo;
    },
    close() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isViewShow = false;
    },
    update(data) {
      if (data.status == -1) {
        this.$Message('该任务已关闭,不能修改');
      } else if (data.status == 1) {
        this.$Message('该任务正在进行');
      } else if (data.status == 2) {
        this.$Message('该任务已完成');
      } else if (data.status == 3) {
        this.$Message('该任务已超期');
      } else if (data.status == 4) {
        this.$Message('该任务已暂停');
      } else if (data.status == 5) {
        this.$Message('该任务已取消');
      } else {
        this.$refs.childT.getList();
        this.$refs.childT.getData(data.id);
        this.isAddShow = false;
        this.isUpdateShow = false;
        this.isViewShow = false;
        this.title = '编辑任务分派';
        this.isUpdateShow = true;
      }
    },
    view(datas, data) {
      this.$router.push({ path: '/task_detail/' + data.id });
      // this.$router.push({ name: 'task_detail', params: { useId: data.id } });
    },
    findTask(data) {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.taskModel.projectInfo = data;
      R.ProjectTask.taskPList(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          Utils.saveLocal('taskProject', data);
          this.taskProject = Utils.getLocal('taskProject');
        }
      });
      //获取所有项目名
      R.ProjectTask.projectNameAndIdList(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.projectOption = resp.body;
        }
      });
    },
    del() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
              ids.push(this.$refs.table.getSelection()[i].id);
            }
            this.taskDelModel.ids = ids.join(',');
            R.ProjectTask.taskDel(taskDel.dispose(this.taskDelModel)).then(resp => {
              if (resp.ok) {
                this.$Message.success('刪除成功');
                setTimeout(() => {
                  this.getData();
                }, 1000);
              }
            });
          })
          .catch(() => {
            this.$emit('close');
          });
      }
    },
    close() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isViewShow = false;
    },
    getData() {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.isLoading = true;
      R.ProjectTask.findAll(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.isLoading = false;
          this.tableHeight = parseInt(window.getComputedStyle(document.querySelector('.h-panel-body')).height) - 164;
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
      //获取所有项目名
      R.ProjectTask.projectNameAndIdList(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.projectOption = resp.body;
        }
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
      if (data == 'detail') {
        this.$router.push({ path: '/task_detail/' + this.oneData.id });
        // this.$router.push({ name: 'task_detail', params: { useId: this.oneData.id } });
      } else if (data == 'modify') {
        if (this.oneData.status == -1) {
          this.$Message('该任务已关闭,不能修改');
        } else if (this.oneData.status == 1) {
          this.$Message('该任务正在进行');
        } else if (this.oneData.status == 2) {
          this.$Message('该任务已完成');
        } else if (this.oneData.status == 3) {
          this.$Message('该任务已超期');
        } else if (this.oneData.status == 4) {
          this.$Message('该任务已暂停');
        } else if (this.oneData.status == 5) {
          this.$Message('该任务已取消');
        } else {
          this.$refs.childT.getData(this.oneData.id);
          this.isUpdateShow = true;
        }
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(this.oneData.id);
            this.taskDelModel.ids = ids.join(',');
            R.ProjectTask.taskDel(taskDel.dispose(this.taskDelModel)).then(resp => {
              if (resp.ok) {
                this.$Message.success('刪除成功');
                setTimeout(() => {
                  this.getData();
                }, 1000);
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
  overflow: hidden;
}
// /deep/ .h-table {
//   max-height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px - 25px - 25px - 50px - 32px);
//   overflow: auto;
// }
// //table固定列shadow样式
// .h-table-fixed-left, .h-table-fixed-header-left{
//   box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.2);
// }
</style>