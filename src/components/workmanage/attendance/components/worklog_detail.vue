<style lang='less'>
</style>

<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div>
        <div class="h-panel-body">
          <button class="h-btn h-btn-blue" style="float: right" @click="black">
            <i class="icon-reply">&nbsp;&nbsp;返回</i>
          </button>
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <div style="width:85%;">
            <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
              <FormItem label="日志标题：">{{worklogModel.workLogTitle}}</FormItem>
              <FormItem label="日志日期：">
                <span>{{worklogModel.workLogDate}}</span>
              </FormItem>
              <FormItem label="日志类型：">
                <div v-if="worklogModel.workLogType==0">
                  <span>工作日志</span>
                </div>
                <div v-else>
                  <span>施工日志</span>
                </div>
              </FormItem>
              <FormItem label="姓名：">
                <span>{{worklogModel.creator}}</span>
              </FormItem>
              <FormItem label="关联项目：">{{worklogModel.projectName}}</FormItem>
              <FormItem label="部门：">
                <span>软件部</span>
              </FormItem>
              <FormItem label="日志内容：">{{worklogModel.content}}</FormItem>
            </Form>
          </div>
        </div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>查看信息</h3>
          </div>
          <div style="width:85%;margin:0 auto">
            <Row>
              <div v-for="workLogReader in datas" :key="workLogReader">
                <Cell :width="4">
                  <Avatar :src="src" :width="70">
                    <blockquote>{{workLogReader.readerName}}</blockquote>
                    <blockquote>{{workLogReader.readerPosition}}</blockquote>
                    <blockquote>软件部</blockquote>
                  </Avatar>
                </Cell>
              </div>
            </Row>
          </div>
        </div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>评论信息</h3>
          </div>
          <div style="width:85%;margin:0 auto">
            <input
              type="text"
              v-model="worklogModel.rContent"
              placeholder="发表评论吧~"
              style="width:70%;height:40px"
            />
            <Button color="primary" style="height:40px" @click="reply">发表</Button>
            <p v-height="5"></p>
            <div v-for="workLogReader in datasT" :key="workLogReader">
              <Avatar :src="src" :width="55">
                <div style="padding:10px 0;">
                  <blockquote>{{workLogReader.readerName}}</blockquote>
                  <blockquote>
                    <i class="icon-clock"></i>
                    <span>{{workLogReader.readerTime}}</span>
                  </blockquote>
                </div>
              </Avatar>
              <div style="width:88%;margin:0 auto">
                <p>{{workLogReader.content}}</p>
                <p>
                  <i class="icon-heart" v-font="14">&nbsp;&nbsp;点赞</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';
import worklogList from 'model/worklog/worklogList';
export default {
  data() {
    return {
      worklogModel: worklogList.parse({}),
      agreeovertime: false,
      refuseovertime: false,
      stripe: false,
      isLoading: false,
      title: '',
      datas: [],
      datasT: [],
      src: 'https://i1.go2yd.com/image.php?url=0Kvq81cKR1'
    };
  },
  mounted() {
    this.getData(this.$route.params.Id);
  },
  methods: {
    currentChange(value) {
      console.log(value);
    },
    reply() {
      if (this.worklogModel.rContent != '') {
        R.Worklog.worklogReaderSave(worklogList.dispose(this.worklogModel)).then(resp => {
          if (resp.ok) {
            this.$Message.success(resp.body.body);
            this.worklogModel.rContent = '';
            R.Worklog.worklogReaderContent(worklogList.dispose(this.worklogModel)).then(resp => {
              if (resp.ok) {
                this.datasT = resp.body;
              }
            });
          }
        });
      } else {
        this.$Message('请输入回复内容');
      }
    },
    black() {
      this.$router.push({ name: 'worklog', params: { index: 1 } });
    },
    getData(id) {
      this.worklogModel.id = id;
      R.Worklog.worklogReaderSave(worklogList.dispose(this.worklogModel)).then(resp => {});
      R.Worklog.worklogFindOne(worklogList.dispose(this.worklogModel)).then(resp => {
        if (resp.ok) {
          this.worklogModel.id = resp.body.id;
          this.worklogModel.workLogTitle = resp.body.workLogTitle;
          this.worklogModel.workLogDate = resp.body.workLogDate;
          this.worklogModel.workLogType = resp.body.workLogType;
          this.worklogModel.content = resp.body.content;
          this.worklogModel.creator = resp.body.creator;
          this.worklogModel.projectName = resp.body.projectInfoEntity.projectName;
        }
      });

      R.Worklog.worklogReader(worklogList.dispose(this.worklogModel)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
        }
      });
      R.Worklog.worklogReaderContent(worklogList.dispose(this.worklogModel)).then(resp => {
        if (resp.ok) {
          this.datasT = resp.body;
        }
      });
    }
  }
};
</script>

