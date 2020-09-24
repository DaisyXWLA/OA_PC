<style lang='less' scoped>

</style>

<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <div style="width:70%;">
            <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
              <FormItem label="标题：">{{informFindOneModel.title}}</FormItem>
              <FormItem label="阅读数：">
                <span>{{informFindOneModel.readerNumber}}</span>
              </FormItem>
              <FormItem label="发布人员：">
                <!-- <span>{{informFindOneModel.readerName}}</span> -->
                <span>{{informFindOneModel.creatorName}}</span>
              </FormItem>
              <FormItem label="类型：">
                <div v-if="informFindOneModel.dataType==0">
                  <span class="h-tag h-tag-bg-blue">公告</span>
                </div>
                <div v-else-if="informFindOneModel.dataType==1">
                  <span class="h-tag h-tag-bg-yellow">通知</span>
                </div>
                <div v-else-if="informFindOneModel.dataType==2">
                  <span class="h-tag h-tag-bg-green">动态</span>
                </div>
                <div v-else-if="informFindOneModel.dataType==3">
                  <span class="h-tag h-tag-bg-red">祝福</span>
                </div>
                <div v-else></div>
              </FormItem>
              <FormItem label="提醒方式：">{{informFindOneModel.showType}}</FormItem>
              <FormItem label="发布时间：">
                <span>{{informFindOneModel.createTime}}</span>
              </FormItem>
              <FormItem label="通知公告内容：" single>
                <span v-html="informFindOneModel.content"></span>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>查看信息</h3>
          </div>
          <div class="h-panel-body">
            <Row :space="20">
              <div v-for="(informReader,i) in datas" :key="i">
                <Cell :width="6">
                  <Avatar :src="src" v-width="200" :imageTop="5">
                    <div style="font-size: 20px;" class="text-ellipsis">{{informReader.readerName}}</div>
                    <p class="dark2-color">{{informReader.readerPosition}}</p>
                    <p class="dark2-color">{{informReader.departmentName}}</p>
                  </Avatar>
                </Cell>
              </div>
            </Row>
          </div>
        </div>
        <p v-height="150"></p>

        <br />
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';
import informFindOne from 'model/inform/informUpdate';
import findAllReaderList from 'model/inform/readerList';

export default {
  data() {
    return {
      informFindOneModel: informFindOne.parse({}),
      informReaderListModel: findAllReaderList.parse({}),
      agreeovertime: false,
      refuseovertime: false,
      stripe: false,
      isLoading: false,
      datas: [],
      src: 'https://i1.go2yd.com/image.php?url=0Kvq81cKR1'
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to, from) {
      if (this.$route.params.dataId != null) {
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
    },
    currentChange(value) {
      console.log(value);
    },
    getData() {
      this.informFindOneModel.id = this.$route.params.dataId;
      R.ProjectInform.informReaderSave(informFindOne.dispose(this.informFindOneModel)).then(resp => {});
      R.ProjectInform.informFindOne(informFindOne.dispose(this.informFindOneModel)).then(resp => {
        if (resp.ok) {
          this.informFindOneModel.id = resp.body.id;
          this.informFindOneModel.title = resp.body.title;
          this.informFindOneModel.readerNumber = resp.body.readerNumber;
          this.informFindOneModel.dataType = resp.body.dataType;
          this.informFindOneModel.showType = resp.body.showType;
          this.informFindOneModel.content = resp.body.content;
          this.informFindOneModel.creatorName = resp.body.creatorName;
          this.informFindOneModel.createTime = resp.body.createTime;
        }
      });
      this.informReaderListModel.id = this.$route.params.dataId;
      R.ProjectInform.findAllReaderList(informFindOne.dispose(this.informReaderListModel)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
        }
      });
    }
  }
};
</script>

