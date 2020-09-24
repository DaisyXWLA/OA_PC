<style lang='less'>
.h-table-header table {
  background-color: #ffffff;
}
.h-panel-bar .h-panel-title {
  line-height: 0;
}
.mes-con {
  margin-top: 20px;
  height: 230px;
  overflow-y: auto;
}
.h-table td {
  font-size: 16px;
}
.pro-statistics,
.announcement {
  height: 420px;
}
@menu-prefix: ~'@{prefix}menu';
.menu-custom {
  background: @white-color;
  .@{menu-prefix} {
    &-show {
      padding: 8px 0;
      translate: font-size, color 0.3s;
      &:link {
        color: gray;
      }
      &:visited {
        color: gray;
      }
      &:hover {
        font-size: 15px;
        color: black;
      }
      &:active {
        font-size: 15px;
        color: gray;
      }
    }
    &-li {
      &-selected {
        background: white;
        font-size: 15px;
        color: black;
      }
    }
  }
}
.h-select-value-single {
  cursor: pointer;
}
</style>
<style lang="less" scoped>
html {
  font-size: 14px;
}
.task-table /deep/ .h-table-container {
  min-height: 380px;
}
.business {
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  ::-moz-scrollbar {
    display: none;
  }
  /deep/ .h-table-container {
    min-height: 380px;
  }
}
.notice-content {
  padding: 15px;
  min-height: 100px;
}
.real-time {
  span {
      font-size: 38px;
  }
  p {
    margin: 0;
    span {
        font-size: 16px;
    } 
  }
}
.text-right {
  margin-top: 15px;
}
.frame-page {
  margin: 0;
}
</style>
<template>
  <div class="app-home-vue frame-page" @contextmenu.prevent>
    <Row :space="8">
      <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="h-panel">
          <div class="h-panel-body">
            <Row>
              <Cell :lg="3" :xl="3">
                <div class="real-time">
                  <span>{{realTime}}</span>
                  <p>
                    <span>{{nowDate}}</span>
                    <span>{{nowWeek}}</span>
                  </p>
                </div>
              </Cell>
              <Cell :lg="11" :xl="11">
                <div class="text-left">
                  <iframe
                    id="fancybox-frame"
                    name="fancybox-frame1569747833691"
                    frameborder="0"
                    scrolling="no"
                    hspace="0"
                    height="80"
                    width="600"
                    src="https://i.tianqi.com/index.php?c=code&a=getcode&id=38&h=60&w=400"
                    style="padding-top:10px;box-sizing:border-box;"
                  ></iframe>
                </div>
              </Cell>
              <Cell :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
                <div class="text-right" >
                  <Row type="flex" justify="space-around" :space="10">
                    <Cell>
                      <h2>
                        <i class="h-icon-task"></i>&nbsp;&nbsp;项目数
                      </h2>
                      <h2>{{numberOfEntry}}</h2>
                    </Cell>
                    <Cell>
                      <h2>
                        <i class="h-icon-task"></i>&nbsp;&nbsp;待办业务
                      </h2>
                      <h2>0/0</h2>
                    </Cell>
                    <Cell>
                      <h2>
                        <i class="h-icon-calendar"></i>&nbsp;&nbsp;任务数
                      </h2>
                      <h2>{{numberOfJobs}}</h2>
                    </Cell>
                    <Cell>
                      <h2>
                        <i class="h-icon-users"></i>&nbsp;&nbsp;出勤人数
                      </h2>
                      <h2>0/0</h2>
                    </Cell>
                    <Cell>
                      <h2>
                        <i class="icon-shuffle"></i>&nbsp;&nbsp;外出人数
                      </h2>
                      <h2>0/0</h2>
                    </Cell>
                  </Row>
                </div>
              </Cell>
            </Row>
          </div>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <div class="h-panel pro-statistics">
          <div class="h-panel-bar">
            <Row>
              <Cell :width="12">
                <span class="h-panel-title">
                  <strong v-font="26">项目统计</strong>
                </span>
              </Cell>
              <Cell :width="12" style="text-align:right;">
                <div>
                  <DropdownMenu button @click="change" :datas="projectOption">{{project}}</DropdownMenu>
                </div>
              </Cell>
            </Row>
          </div>
          <div class="h-panel-body" style="height:300px">
            <Row type="flex">
              <Cell :width="10">
                <div class="text-center">
                  <p>
                    <h-circle :percent="data.percentage" :stroke-width="22" :size="180">
                      <p class="gray-color" v-font="24">已完成</p>
                      <h2 class="dark-color" v-font="40">{{data.percentage}}%</h2>
                    </h-circle>
                  </p>
                </div>
                <Row type="flex" justify="space-around">
                  <Cell align="center" v-font="20">
                    <span class="h-tag-circle h-tag-bg-red"></span>
                    <p>预计</p>
                    <p>{{data.estimate}}小时</p>
                  </Cell>
                  <Cell align="center" v-font="20">
                    <span class="h-tag-circle h-tag-bg-green"></span>
                    <p>消耗</p>
                    <p>{{data.consume}}小时</p>
                  </Cell>
                  <Cell align="center" v-font="20">
                    <span class="h-tag-circle h-tag-bg-blue"></span>
                    <p>剩余</p>
                    <p>{{data.remainder}}小时</p>
                  </Cell>
                </Row>
              </Cell>
              <Cell :width="14">
                <div style="margin-top:40px;">
                  <Row>
                    <Cell :width="18">
                      <div v-font="20">
                        <p slot="title">
                          <i class="h-icon-success green-color"></i>&nbsp;&nbsp;昨日完成任务
                        </p>
                        <p>
                          <Progress :percent="data.yesterdayPercentage" :stroke-width="6">
                            <span slot="text">{{data.yesterdayPercentage}}%</span>
                          </Progress>
                        </p>
                      </div>
                    </Cell>
                    <Cell :width="6">
                      <div v-font="16">
                        <p>
                          总任务：
                          <span slot="text">{{data.totalYesterdayNumber}}</span>
                        </p>
                        <p>
                          未完成：
                          <span slot="text">{{data.yesterdayUndone}}</span>
                        </p>
                      </div>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell :width="18">
                      <div v-font="20">
                        <p slot="title">
                          <i class="h-icon-success green-color"></i>&nbsp;&nbsp;超期任务
                        </p>
                        <p>
                          <Progress :percent="data.overduePercentage" :stroke-width="6">
                            <span slot="text">{{data.overduePercentage}}%</span>
                          </Progress>
                        </p>
                      </div>
                    </Cell>
                    <Cell :width="6">
                      <div v-font="16">
                        <p>
                          总任务：
                          <span slot="text">{{data.totalTaskNumber}}</span>
                        </p>
                        <p>
                          未完成：
                          <span slot="text">{{data.undone}}</span>
                        </p>
                      </div>
                    </Cell>
                  </Row>
                  <Row>
                    <Cell :width="18">
                      <div v-font="20">
                        <p slot="title">
                          <i class="h-icon-success green-color"></i>&nbsp;&nbsp;未完成任务
                        </p>
                        <p>
                          <Progress :percent="data.undonePercentage" :stroke-width="6">
                            <span slot="text">{{data.undonePercentage}}%</span>
                          </Progress>
                        </p>
                      </div>
                    </Cell>
                    <Cell :width="6">
                      <div v-font="16">
                        <p>
                          总任务：
                          <span slot="text">{{data.totalTaskNumber}}</span>
                        </p>
                        <p>
                          未完成：
                          <span slot="text">{{data.undone}}</span>
                        </p>
                      </div>
                    </Cell>
                  </Row>
                </div>
              </Cell>
            </Row>
          </div>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <div class="h-panel announcement">
          <div class="h-panel-bar">
            <div class="h-panel-title" style="font-weight: 600;padding:15px 0;" v-font="26">通知公告</div>
          </div>
          <div class="h-panel-body" style="height:300px">
            <h3 style="text-align: center;font-size:24px;">{{announcement.title}}</h3>
            <div class="mes-con" v-font="18">
              <p v-html="announcement.content"></p>
            </div>
          </div>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title" style="font-weight: 600;font-size:26px;">任务信息</div>
          </div>
          <div class="home-part-body" v-font="18">
            <Table :datas="taskInfo" class="task-table">
              <TableItem :width="80" title="序号" align="center">
                <template slot-scope="{data}">
                  <div v-if="data.status==0">
                    <div v-if="data.planEndTime<nowTime" style="color:red">{{data.serialNumber}}</div>
                    <div v-else>{{data.serialNumber}}</div>
                  </div>
                  <div v-else>{{data.serialNumber}}</div>
                </template>
              </TableItem>

              <TableItem :width="200" title="任务名称" align="left">
                <template slot-scope="{data}">
                  <div v-if="data.status==0">
                    <div v-if="data.planEndTime<nowTime" style="color:red">{{data.taskName}}</div>
                    <div v-else>{{data.taskName}}</div>
                  </div>
                  <div v-else>{{data.taskName}}</div>
                </template>
              </TableItem>
              <TableItem :width="70" title="执行人" align="left">
                <template slot-scope="{data}">
                  <div v-if="data.status==0">
                    <div v-if="data.planEndTime<nowTime" style="color:red">{{data.executorName}}</div>
                    <div v-else>{{data.executorName}}</div>
                  </div>
                  <div v-else>{{data.executorName}}</div>
                </template>
              </TableItem>
              <TableItem :width="130" title="预计开始日期" align="left">
                <template slot-scope="{data}">
                  <div v-if="data.status==0">
                    <div v-if="data.planEndTime<nowTime" style="color:red">{{data.planStartTime}}</div>
                    <div v-else>{{data.planStartTime}}</div>
                  </div>
                  <div v-else>{{data.planStartTime}}</div>
                </template>
              </TableItem>
              <TableItem :width="130" title="预计完成日期" align="left">
                <template slot-scope="{data}">
                  <div v-if="data.status==0">
                    <div v-if="data.planEndTime<nowTime" style="color:red">{{data.planEndTime}}</div>
                    <div v-else>{{data.planEndTime}}</div>
                  </div>
                  <div v-else>{{data.planEndTime}}</div>
                </template>
              </TableItem>
              <TableItem :width="90" title="任务类型" align="center">
                <template slot-scope="{data}">
                  <div v-if="data.taskType==0">
                    <span class="h-tag h-tag-blue">项目任务</span>
                  </div>
                  <div v-if="data.taskType==1">
                    <span class="h-tag h-tag-red">突发任务</span>
                  </div>
                  <div v-if="data.taskType==2">
                    <span class="h-tag h-tag-primary">周期任务</span>
                  </div>
                  <div v-if="data.taskType==3">
                    <span class="h-tag h-tag-yellow">触发任务</span>
                  </div>
                  <div v-if="data.taskType==4">
                    <span class="h-tag h-tag-green">其他任务</span>
                  </div>
                </template>
              </TableItem>
              <TableItem :width="80" prop="task" title="任务状态" align="center">
                <template slot-scope="{data}">
                  <div v-if="data.status==0">
                    <div v-if="data.planEndTime<nowTime">
                      <span class="h-tag h-tag-bg-red">未开始</span>
                    </div>
                    <div v-else>
                      <span class="h-tag h-tag-bg-gray">未开始</span>
                    </div>
                  </div>
                  <div v-else-if="data.status==1">
                    <span class="h-tag h-tag-bg-green">进行中</span>
                  </div>
                  <div v-else-if="data.status==2">
                    <span class="h-tag h-tag-bg-yellow">已完成</span>
                  </div>
                  <div v-else-if="data.status==3">
                    <span class="h-tag h-tag-bg-red">已超期</span>
                  </div>
                  <div v-else-if="data.status==4">
                    <span class="h-tag h-tag-bg-primary">已暂停</span>
                  </div>
                  <div v-else>
                    <span class="h-tag h-tag-bg-blue">已取消</span>
                  </div>
                </template>
              </TableItem>
              <div slot="empty">暂时无数据</div>
            </Table>
          </div>
        </div>
      </Cell>
      <Cell :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title" style="font-weight: 600;font-size:26px;">待办业务</div>
          </div>
          <div class="home-part-body" v-font="18">
            <Table :datas="datas" class="business">
              <TableItem :width="150" title="事项" prop="name" align="left"></TableItem>
              <TableItem :width="100" title="待办人" prop="addres" align="left"></TableItem>
              <TableItem :width="100" title="剩余时间" prop="address" align="left"></TableItem>
              <div slot="empty">暂时无数据</div>
            </Table>
          </div>
        </div>
      </Cell>
    </Row>
    <Modal v-model="opened" hasDivider class="pop-up">
      <!-- <div slot="header">{{announcement.title}}</div> -->
      <div class="notice-content">{{announcement.content}}</div>
      <div slot="footer">
        <Button @click="opened=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Login from 'model/login/Login';
import showTaskInfoModel from 'model/showTaskInfo/showTaskInfoModel';
import taskList from 'model/task/taskList';
export default {
  data() {
    return {
      showTaskInfoList: showTaskInfoModel.parse({}),
      taskModel: taskList.parse({}),
      login: Login.parse({}),
      nowTime: this.format(new Date(), 'yyyy-MM-dd HH:mm'),
      src: 'https://i1.go2yd.com/image.php?url=0Kvq81cKR1',
      data: {}, //项目统计数据
      taskInfo: [],
      datas: [],
      projectOption: [], //下拉框选项
      taskInit: [], //初始化任务信息
      selected: '', //下拉框默认选项
      numberOfEntry: '', //项目数
      numberOfJobs: '', //任务数
      announcement: {}, //通知公告
      project: '请选择项目',
      pagination: {
        page: 1,
        size: 5,
        total: 100
      },
      opened: false,
      nowDate: '', // 当前日期
      realTime: '', // 当前时间
      nowWeek: '' // 当前星期
    };
  },
  mounted() {
    this.login.grant_type = 'password';
    this.login.username = 'admin';
    this.login.password = '123456';
    Utils.saveLocal('token', 'Basic aHlrdy1vYTpoeWt3LW9hLXNlY3JldA==');
    R.Login.login(Login.dispose(this.login)).then(resp => {
      Utils.saveLocal('token', resp.tokenType + ' ' + resp.value);
      this.getData();
      setInterval(() => {
        //项目统计
        this.showTaskInfoList.projectInfo = this.selected;
        R.showTaskInfo.showTaskInfo(showTaskInfoModel.dispose(this.showTaskInfoList)).then(resp => {
          if (resp.ok) {
            this.data = resp.body;
          }
        });
        this.getData();
      }, 20000);
    });
    this.taskModel.page = 1;
    this.taskModel.size = 5;
    R.ProjectTask.taskList(taskList.dispose(this.taskModel)).then(resp => {
      if (resp.ok) {
        this.taskInfo = resp.body;
      }
    });
    this.currentTime();
    // setTimeout(() => {
    //   if (this.announcement.showType == '全屏弹窗') {
    //     this.opened = true;
    //   }
    // }, 500);
  },
  methods: {
    getData() {
      //项目统计下拉框
      R.ProjectTask.pullDownProject(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.projectOption = resp.body;
          if (this.project.indexOf('请选择项目') != -1) {
            this.project = resp.body[0].title;
          }
          if (this.selected.length > 0) {
          } else {
            this.selected = resp.body[0].key;
          }
          this.taskModel.projectInfo = resp.body[0].key;
          //项目统计
          this.showTaskInfoList.projectInfo = this.selected;
          R.showTaskInfo.showTaskInfo(showTaskInfoModel.dispose(this.showTaskInfoList)).then(resp => {
            if (resp.ok) {
              this.data = resp.body;
            }
          });
        }
      });
      //任务信息
      this.taskModel.page = 1;
      this.taskModel.size = 5;
      setInterval(() => {
        R.ProjectTask.taskList(taskList.dispose(this.taskModel)).then(resp => {
          if (resp.ok) {
            this.taskInfo = resp.body;
            this.taskModel.size = resp.size;
            this.taskModel.page = resp.page + 1;
            if (this.taskModel.page > Math.ceil(resp.total / 5)) {
              this.taskModel.page = 1;
            }
          }
        });
      }, 20000);
      //项目数
      R.index.projectlist(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.numberOfEntry = resp.body;
        }
      });
      //任务数
      R.index.taskcount(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.numberOfJobs = resp.body;
        }
      });
      //通知公告
      R.announcement.announcement(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.announcement = resp.body[0];
          // if (this.announcement.showType == '全屏弹窗') {
          //   this.notice(5000);
          // }
        }
      });
    },
    //通知公告弹窗
    notice(timeout) {
      this.$Notice({
        title: this.announcement.title,
        content: this.announcement.content,
        timeout: timeout,
        buttons: [
          {
            name: '关闭',
            type: 'cancel'
          }
        ]
      });
    },
    format(date, fmt) {
      let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'H+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
      return fmt;
    },
    change(data, code) {
      this.showTaskInfoList.projectInfo = data;
      //项目统计下拉框
      R.ProjectTask.pullDownProject(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.projectOption = resp.body;
          this.project = code.title;
          this.selected = data;
          //项目统计
          R.showTaskInfo.showTaskInfo(showTaskInfoModel.dispose(this.showTaskInfoList)).then(resp => {
            if (resp.ok) {
              this.data = resp.body;
            }
          });
        }
      });
    },
    currentTime() {
      setInterval(this.getDate, 500);
    },
    getDate() {
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let week = new Date().getDay();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let sec = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      if (week == 1) {
        this.nowWeek = '星期一';
      } else if (week == 2) {
        this.nowWeek = '星期二';
      } else if (week == 3) {
        this.nowWeek = '星期三';
      } else if (week == 4) {
        this.nowWeek = '星期四';
      } else if (week == 5) {
        this.nowWeek = '星期五';
      } else if (week == 6) {
        this.nowWeek = '星期六';
      } else {
        this.nowWeek = '星期日';
      }
      _this.realTime = hh + ':' + mf + ':' + sec;
      _this.nowDate = yy + '年' + mm + '月' + dd + '日';
    }
  }
};
</script>