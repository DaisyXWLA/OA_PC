<style lang='less'>
</style>

<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <div style="width:85%;">
            <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
              <FormItem label="计划标题：">{{workplanSerch.planTitle}}</FormItem>
              <FormItem label="计划天数：">
                <span>{{data.date}}</span>
              </FormItem>
              <FormItem label="计划类型：">
                <span>{{workplanSerch.planType}}</span>
              </FormItem>
              <FormItem label="姓名：">
                <span>{{workplanSerch.creator}}</span>
              </FormItem>
              <FormItem label="计划日期：">
                <span>{{data.value.start}}—{{data.value.end}}</span>
              </FormItem>
              <FormItem label="部门：">
                <span>软件部</span>
              </FormItem>
              <FormItem label="计划内容：">{{workplanSerch.content}}</FormItem>
            </Form>
          </div>
        </div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>查看信息</h3>
          </div>
          <div class="h-panel-body">
            <Row>
              <div v-for="planReader in datas" :key="planReader">
                <Cell :width="3">
                  <Avatar :src="src" :width="70">
                    <blockquote>{{planReader.readerName}}</blockquote>
                    <blockquote>{{planReader.readerPosition}}</blockquote>
                    <blockquote>{{planReader.departmentName}}</blockquote>
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
              v-model="workplanSerch.rContent"
              placeholder="发表评论吧~"
              style="width:70%;height:40px"
            />
            <Button color="primary" style="height:40px" @click="reply">发表</Button>
            <p v-height="5"></p>
            <div v-for="planReader in datasT" :key="planReader">
              <Avatar :src="src" :width="55">
                <div style="padding:10px 0;">
                  <blockquote>{{planReader.readerName}}</blockquote>
                  <blockquote>
                    <i class="icon-clock"></i>
                    <span>{{planReader.readerTime}}</span>
                  </blockquote>
                </div>
              </Avatar>
              <div style="width:88%;margin:0 auto">
                <p>{{planReader.content}}</p>
                <p>
                  <i class="icon-heart" v-font="14">&nbsp;&nbsp;点赞</i>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div class="text-center">
          <button class="h-btn h-btn-blue" @click="black">返回</button>
        </div>
        <br />
        <br />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';
import workplanModel from 'model/workplan/workplanModel';
export default {
  data() {
    return {
      workplanSerch: workplanModel.parse({}),
      stripe: false,
      isLoading: false,
      data: {
        value: {},
        planType: ''
      },
      datas: [],
      datasT: [],
      src: 'https://i1.go2yd.com/image.php?url=0Kvq81cKR1'
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to,from) {
      if (this.$route.params.dataId!=null) {
        this.getData();
      }
    }
  },
  methods: {
    init() {
      this.getData();
    },
    black() {
      this.$router.go(-1);
      // this.$router.push({ name: 'workplan', params: { index: 1 } });
    },
    reply() {
      if (this.workplanSerch.rContent != '') {
        R.ProjectPlan.planReaderSave(workplanModel.dispose(this.workplanSerch)).then(resp => {
          if (resp.ok) {
            this.$Message.success(resp.body.body);
            this.workplanSerch.rContent = '';
            R.ProjectPlan.planReaderContent(workplanModel.dispose(this.workplanSerch)).then(resp => {
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
    getData() {
      this.workplanSerch.id = this.$route.params.dataId;
      R.ProjectPlan.planReaderSave(workplanModel.dispose(this.workplanSerch)).then(resp => {});
      R.ProjectPlan.planFindOne(workplanModel.dispose(this.workplanSerch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body.planReaderEntities;
          this.data.date = resp.body.days;
          var start = resp.body.planStartDate;
          var end = resp.body.planEndDate;
          this.data.value = { start, end };
          this.workplanSerch.id = resp.body.id;
          this.workplanSerch.creator = resp.body.creator;
          this.workplanSerch.planTitle = resp.body.planTitle;
          this.workplanSerch.planType = resp.body.planType;
          this.workplanSerch.content = resp.body.content;
        }
      });
      R.ProjectPlan.planReader(workplanModel.dispose(this.workplanSerch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
        }
      });
      R.ProjectPlan.planReaderContent(workplanModel.dispose(this.workplanSerch)).then(resp => {
        if (resp.ok) {
          this.datasT = resp.body;
        }
      });
    }
  }
};
</script>

