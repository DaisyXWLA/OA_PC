<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            任务名称：
            <input type="text" @search="search" v-model="taskModel.taskName" />
            <!-- &nbsp; 指派给：
            <input type="text" @search="search" v-model="taskModel.executor" />-->
            &nbsp;&nbsp;&nbsp;
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
                <button class="h-btn h-btn-yellow" @click="begin" v-has="'mytaskstart'">
                  <i class="icon-play"></i>
                  <span>开始</span>
                </button>
                <button class="h-btn h-btn-blue" @click="com" v-has="'mytaskend'">
                  <i class="icon-stop"></i>
                  <span>完成</span>
                </button>
              </div>
              <div style="position: absolute;right:0;" v-width="200">
                <Select
                  v-model="taskProject"
                  :datas="param"
                  placeholder="请选择项目名称"
                  @input="findTask"
                ></Select>
              </div>
            </div>
            <div class="home-part-body" style="margin-top: 50px">
              <Table
                ref="table"
                :loading="isLoading"
                :datas="datas"
                :checkbox="checkbox"
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
                <TableItem :width="80" prop="executorName" title="分派人" align="left"></TableItem>
                <TableItem :width="130" prop="planEndTime" title="截止日期" align="left"></TableItem>
                <TableItem :width="150" prop="projectInfoName" title="关联项目" align="left"></TableItem>
                <TableItem :width="50" prop="planHours" title="预计" align="center"></TableItem>
                <TableItem :width="50" prop="useHours" title="消耗" align="center"></TableItem>
                <TableItem :width="50" prop="task" title="剩余" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.status==2">
                      <span>0</span>
                    </div>
                    <div v-else>
                      <span>{{(data.useHours/data.planHours).toFixed(2)*100}}%</span>
                    </div>
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
                <TableItem :width="150" title="操作" align="center" fixed="right">
                  <template slot-scope="{data}">
                    <div v-if="data.myTaskType=='0'">
                      <span
                        class="icon-play"
                        v-font="20"
                        style="cursor:pointer;"
                        @click="ok(data)"
                        v-tooltip
                        content="开始"
                        v-has="'mytaskstart'"
                      >&nbsp;&nbsp;</span>
                      <Poptip content="确定完成该项目？" @confirm="off(data)">
                        <span
                          class="icon-stop"
                          v-font="19"
                          style="cursor:pointer"
                          v-tooltip
                          content="完成"
                          v-has="'mytaskend'"
                        >&nbsp;&nbsp;</span>
                      </Poptip>
                      <span
                        class="icon-clock"
                        v-font="18"
                        style="cursor:pointer"
                        v-tooltip
                        content="工时"
                        @click="hour(data)"
                        v-has="'mytasktime'"
                      >&nbsp;&nbsp;</span>
                      <span
                        class="icon-paper"
                        v-font="17"
                        style="cursor:pointer"
                        v-tooltip
                        content="详情"
                        @click="view(datas, data)"
                        v-has="'mytaskview'"
                      >&nbsp;&nbsp;</span>
                    </div>
                    <div v-else>
                      <span
                        class="icon-paper"
                        v-font="17"
                        style="cursor:pointer"
                        v-tooltip
                        content="详情"
                        @click="view(datas, data)"
                        v-has="'mytaskview'"
                      >&nbsp;&nbsp;</span>
                    </div>
                    <!-- <span class="icon-cross" v-tooltip content="关闭" @click="close(data)">&nbsp;&nbsp;</span>
                    <span class="icon-tag" v-tooltip content="修改" @click="dell(data)">&nbsp;&nbsp;</span>-->
                  </template>
                </TableItem>
                <div slot="empty">暂时无数据</div>
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
    <date-Ball ref="child" :ball="ball" :time="time"></date-Ball>
  </div>
</template>
<script>
import taskList from 'model/task/taskList';
import date from './components/mytask_hour';
import taskView from './components/task_detail';
import mytask from './components/mytask_add';
import taskAdd from 'model/task/taskAdd';
import taskDel from 'model/task/taskDel';
import myid from 'model/task/taskUpdate';
export default {
  components: {
    'date-Ball': date
  },
  data() {
    return {
      taskProject: '',
      taskModel: taskList.parse({}),
      taskupdateModal: myid.parse({}),
      checkbox: true,
      taskSearch: taskAdd.parse({}),
      taskDelModel: taskDel.parse({}),
      complete: taskDel.parse({}),
      start: taskDel.parse({}),
      workHour: taskDel.parse({}),
      tableHeight: 0,
      value: '',
      a: false,
      ball: false,
      title: '',
      isLoading: false,
      datas: [],
      data: {
        status: ''
      },
      pagination: {
        page: 1,
        size: 20,
        total: 100
      },
      select: '',
      param: [],
      time: '',
      index: 0
    };
  },

  mounted() {
    this.init();
    this.$nextTick(() => {
      document.querySelector('.h-table-fixed-header-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-header-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-left').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
    });
    document.addEventListener('scroll', this.winScroll, true);
  },
  methods: {
    closes() {
      this.ball = false;
    },
    changePage() {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.getData();
    },
    findTask(data) {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.taskModel.projectInfo = data;
      this.taskModel.userId = 'myTask';
      R.ProjectTask.taskPList(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          Utils.saveLocal('mytaskProject', data);
          this.taskProject = Utils.getLocal('mytaskProject');
        }
      });
      R.ProjectTask.projectNameAndIdList(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.param = resp.body;
        }
      });
    },
    init() {
      if (Utils.getLocal('mytaskProject').length > 0) {
        this.findTask(Utils.getLocal('mytaskProject'));
      } else {
        this.getData();
      }
    },

    reset() {
      this.taskModel.taskName = '';
      this.taskModel.executor = '';
    },
    hour(data) {
      if (data.status == -1) {
        this.$Message('该任务已关闭');
      } else if (data.status == 0) {
        this.$Message('该任务尚未开始');
      } else if (data.status == 2) {
        this.$Message('该任务已完成');
      } else if (data.status == 3) {
        this.$Message('该任务已超期');
      } else if (data.status == 4) {
        this.$Message('该任务已暂停');
      } else if (data.status == 5) {
        this.$Message('该任务已取消');
      } else {
        this.$refs.child.getTime(data.planEndTime, data.id);
        this.ball = false;
        this.ball = true;
      }
    },
    dell() {},
    view(datas, data) {
      this.$router.push({ path: '/task_detail/' + data.id });
      // this.$router.push({ name: 'task_detail', params: { useId: data.id } });
    },
    search() {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.getData();
    },
    begin() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要开始的数据');
      } else {
        if (this.$refs.table.getSelection()[0].status == -1) {
          this.$Message('该任务已关闭');
        } else if (this.$refs.table.getSelection()[0].status == 1) {
          this.$Message('该任务正在进行');
        } else if (this.$refs.table.getSelection()[0].status == 2) {
          this.$Message('该任务已完成');
        } else if (this.$refs.table.getSelection()[0].status == 4) {
          this.$Message('该任务已暂停');
        } else if (this.$refs.table.getSelection()[0].status == 5) {
          this.$Message('该任务已取消');
        } else {
          let ids = new Array();
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.start.ids = ids.join(',');
          R.Maintask.mytasklist(taskDel.dispose(this.start)).then(resp => {
            if (resp.ok) {
              this.$Message(resp.body);
              this.getData();
            }
          });
        }
      }
    },
    ok(data) {
      if (data.status == -1) {
        this.$Message('该任务已关闭');
      } else if (data.status == 1) {
        this.$Message('该任务正在进行');
      } else if (data.status == 2) {
        this.$Message('该任务已完成');
      } else if (data.status == 4) {
        this.$Message('该任务已暂停');
      } else if (data.status == 5) {
        this.$Message('该任务已取消');
      } else {
        this.taskupdateModal.ids = data.id;
        R.Maintask.mytasklist(myid.dispose(this.taskupdateModal)).then(resp => {
          this.getData();
        });
        this.taskupdateModal.ids = data.id;
        R.Maintask.mytasklist(myid.dispose(this.taskupdateModal)).then(resp => {
          this.getData();
        });
      }
    },
    off(data) {
      if (data.status == -1) {
        this.$Message('该任务已关闭');
      } else if (data.status == 0) {
        this.$Message('该任务尚未开始');
      } else if (data.status == 2) {
        this.$Message('该任务已完成');
      } else if (data.status == 4) {
        this.$Message('该任务已暂停');
      } else if (data.status == 5) {
        this.$Message('该任务已取消');
      } else {
        this.taskupdateModal.ids = data.id;
        R.Maintask.myfinish(myid.dispose(this.taskupdateModal)).then(resp => {
          this.$Message(resp.body);
          this.getData();
        });
      }
    },
    close() {
      this.ball = false;
    },
    com() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要完成的数据');
      } else {
        if (this.$refs.table.getSelection()[0].status == -1) {
          this.$Message('该任务已关闭');
        } else if (this.$refs.table.getSelection()[0].status == 0) {
          this.$Message('该任务尚未开始');
        } else if (this.$refs.table.getSelection()[0].status == 2) {
          this.$Message('该任务已完成');
        } else if (this.$refs.table.getSelection()[0].status == 4) {
          this.$Message('该任务已暂停');
        } else if (this.$refs.table.getSelection()[0].status == 5) {
          this.$Message('该任务已取消');
        } else {
          let ids = new Array();
          this.$Confirm('确定完成？', '完成')
            .then(() => {
              for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
                ids.push(this.$refs.table.getSelection()[i].id);
              }
              this.complete.ids = ids.join(',');
              R.Maintask.myfinish(taskDel.dispose(this.complete)).then(resp => {
                if (resp.ok) {
                  this.$Message(resp.body);
                  this.getData();
                }
              });
            })
            .catch(() => {
              this.$emit('close');
            });
        }
      }
    },
    getData() {
      this.taskModel.page = this.pagination.page;
      this.taskModel.size = this.pagination.size;
      this.isLoading = true;
      R.ProjectTask.findMyInfo(taskList.dispose(this.taskModel)).then(resp => {
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
          this.param = resp.body;
        }
      });
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
/deep/ .h-panel-body {
  height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px);
}
// /deep/ .h-table {
//   max-height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px - 25px - 25px - 50px - 32px);
//   overflow: auto;
// }
</style>
