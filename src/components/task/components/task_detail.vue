<style lang='less'>
.app-home-vue {
  .h-table-header table {
    background-color: #ffffff;
  }
  .home-part-body {
    height: 350px;
    .echarts-vue {
      height: 350px;
    }
  }
  .home-part-body2 {
    height: 420px;
    .echarts-vue {
      height: 420px;
    }
  }
  .progress-div {
    > p {
      padding: 8px 0;
    }
    .h-progress {
      &-title {
        color: @dark2-color;
        font-size: 15px;
      }
      &-text {
        width: 40px;
      }
    }
  }
}
// .h-form .h-form-item-label {
//   padding-right: 10px;
//   color:#888;
// }
</style>
<style lang="less" scoped>
h3 {
  margin-bottom: 15px;
}
.h-form /deep/ .h-form-item {
  padding-bottom: 0;
}

//隐藏
/deep/ .edui-default .edui-editor {
  border: none;
}
/deep/ .edui-default .edui-toolbar .edui-button .edui-icon {
  display: none;
}
/deep/ .edui-default .edui-editor-toolbarboxouter {
  border: none;
}
/deep/ .edui-default .edui-editor-toolbarboxinner {
  padding: 0;
}
/deep/ .edui-default.edui-editor-toolbarbox {
  display: none;
}
/deep/ .edui-default .edui-editor-bottomContainer {
  display: none;
}
</style>
  <template>
  <div>
    <div class="app-home-vue frame-page">
      <Row :space="10">
        <Cell :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <Row :space="10">
            <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="h-panel">
                <div class="h-panel-body">
                  <div>
                    <h3>任务描述</h3>
                    <!-- <span v-if="data.da15==undefined||''" style="color:#999;">暂无描述</span>
                    <!-- <span v-else-if="data.da15==''" style="color:#999;">暂无描述</span>-->
                    <!-- <span
                      v-else
                      v-html="data.da15"
                      style="display:inline-block;max-height:200px;overflow-y:auto;"
                    ></span>-->
                    <div v-if="data.da15==undefined||''">
                      <span style="color:#999;">暂无描述</span>
                    </div>
                    <div v-else-if="data.da15==''">
                      <span style="color:#999;">暂无描述</span>
                    </div>
                    <div v-else>
                      <UeditorShow v-model="data.da15"></UeditorShow>
                    </div>
                  </div>
                </div>
              </div>
            </Cell>
            <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="h-panel">
                <div class="h-panel-body">
                  <div>
                    <h3>历史记录</h3>
                    <div>
                      <Collapse accordion>
                        <div v-for="History in datas" :key="History.changeTime">
                          <CollapseItem>
                            <template
                              slot="title"
                            >{{History.changeTime}},由{{History.changePersonName}}{{History.type}}。</template>
                            <span
                              style="display:inline-block;text-indent:2em;max-height:300px;overflow-y:auto;"
                            >{{History.bak}}</span>
                          </CollapseItem>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </div>
              </div>
            </Cell>
          </Row>
        </Cell>
        <Cell :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <Row :space="10">
            <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="h-panel">
                <div class="h-panel-bar">
                  <div class="h-panel-title">
                    <h4>基本信息</h4>
                  </div>
                </div>
                <div class="h-panel-body" style="padding-top:10px">
                  <Form :label-width="80" mode="single" readonly>
                    <!-- <FormItem label="序号:">{{data.da1}}</FormItem> -->
                    <FormItem label="任务名称:">{{data.da2}}</FormItem>
                    <FormItem label="任务类型:">{{data.da3}}</FormItem>
                    <FormItem label="关联项目:">{{data.da4}}</FormItem>
                    <FormItem label="指派给:">{{data.da5}}</FormItem>
                    <FormItem label="优先级:">
                      <div v-if="data.da6==0">
                        <span class="h-tag h-tag-bg-red">重要</span>
                      </div>
                      <div v-else-if="data.da6==1">
                        <span class="h-tag h-tag-bg-yellow">次要</span>
                      </div>
                      <div v-else-if="data.da6==2">
                        <span class="h-tag h-tag-bg-blue">紧急</span>
                      </div>
                      <div v-else-if="data.da6==3">
                        <span class="h-tag h-tag-bg-green">一般</span>
                      </div>
                      <div v-else></div>
                    </FormItem>
                    <FormItem label="任务状态:" single>
                      <div v-if="data.da7==0">
                        <span class="h-tag h-tag-green">未开始</span>
                      </div>
                      <div v-else-if="data.da7==-1">
                        <span class="h-tag h-tag-yellow">已关闭</span>
                      </div>
                      <div v-else-if="data.da7==1">
                        <span class="h-tag h-tag-yellow">进行中</span>
                      </div>
                      <div v-else-if="data.da7==2">
                        <span class="h-tag h-tag-blue">已完成</span>
                      </div>
                      <div v-else-if="data.da7==3">
                        <span class="h-tag h-tag-red">已超期</span>
                      </div>
                      <div v-else-if="data.da7==4">
                        <span class="h-tag h-tag-primary">已暂停</span>
                      </div>
                      <div v-else>
                        <span class="h-tag h-tag-blue">已取消</span>
                      </div>
                    </FormItem>
                    <FormItem label="抄送人:" single>{{data.da8}}</FormItem>
                  </Form>
                </div>
              </div>
            </Cell>
            <Cell :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="h-panel">
                <div class="h-panel-bar">
                  <div class="h-panel-title">
                    <h4>工时信息</h4>
                  </div>
                </div>
                <div class="h-panel-body" style="padding-top:10px">
                  <Form :label-width="100" mode="single" readonly>
                    <FormItem label="任务周期:">{{data.da9}} 至 {{data.da16}}</FormItem>
                    <FormItem label="开始时间:">{{data.da10}}</FormItem>
                    <FormItem label="预计:">{{data.da11}}小时</FormItem>
                    <FormItem label="消耗:">{{data.da12}}小时</FormItem>
                    <FormItem label="剩余:">{{data.da13}}小时</FormItem>
                    <FormItem label="进度:">{{parseFloat(data.da14).toFixed(2)*100}}%</FormItem>
                  </Form>
                </div>
              </div>
            </Cell>
          </Row>
        </Cell>
      </Row>
    </div>
  </div>
</template>
<script>
import taskList from 'model/task/taskList';
export default {
  data() {
    return {
      taskModel: taskList.parse({}),
      datas: [],
      data: {
        da1: '',
        da2: '',
        da3: '',
        da4: '',
        da5: '',
        da6: '',
        da7: '',
        da8: '',
        da9: '',
        da10: '',
        da11: '',
        da12: '',
        da13: '',
        da14: '',
        da15: '',
        da16: ''
      },
      type: ''
    };
  },
  mounted() {
    this.getData(this.$route.params.useId);
  },
  watch: {
    $route: 'getPath'
  },
  methods: {
    getPath() {
      this.getData(this.$route.params.useId);
    },
    getData(id, indexx) {
      this.taskModel.id = id;
      R.ProjectTask.task(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.taskModel.id = resp.body.id;
          this.data.da2 = resp.body.taskName;
          this.data.da3 = resp.body.taskType;
          if (resp.body.taskType == 0) {
            this.data.da3 = '项目任务';
          } else if (resp.body.taskType == 1) {
            this.data.da3 = '突发任务';
          } else if (resp.body.taskType == 1) {
            this.data.da3 = '周期任务';
          } else if (resp.body.taskType == 1) {
            this.data.da3 = '触发任务';
          } else {
            this.data.da3 = '其他任务';
          }
          this.data.da5 = resp.body.executorName;
          this.data.da15 = resp.body.taskContent;
          console.log(this.data.da15);
          this.data.da4 = resp.body.projectInfoName;
          this.data.da9 = resp.body.planStartTime;
          this.data.da10 = resp.body.realStartTime;
          this.data.da16 = resp.body.planEndTime;
          this.data.da7 = resp.body.status;
          this.data.da8 = resp.body.copyPersonName;
          this.data.da6 = resp.body.priority;
          this.data.da11 = resp.body.planHours;
          this.data.da12 = resp.body.useHours;
          this.data.da13 = resp.body.planHours - resp.body.useHours;
          this.data.da14 = resp.body.useHours / resp.body.planHours;
        }
      });
      R.Maintask.findHistory(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
        }
      });
    }
  }
};
</script>
