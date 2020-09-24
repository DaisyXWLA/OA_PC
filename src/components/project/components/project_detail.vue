<template>
  <Modal v-model="projectView" v-bind="params">
    <div slot="header" class="title">
      {{title}}
      <i class="h-icon-close" @click="cancel"></i>
    </div>
    <div class="detail-con">
      <Form class="info-basic" :label-width="150" mode="twocolumn" readonly>
        <FormItem label="项目名称：">
          <span>{{projectManageModel.projectName}}</span>
        </FormItem>
        <FormItem label="项目编号：">
          <span>{{projectManageModel.projectCode}}</span>
        </FormItem>
        <FormItem label="项目负责人：">
          <span>{{projectManageModel.projectLeader}}</span>
        </FormItem>
        <FormItem label="项目团队成员：">
          <span
            v-tooltip
            theme="white"
            style="display:inline-block;max-height:26px;overflow-y:auto;cursor:pointer"
          >{{projectManageModel.memberNames}}</span>
        </FormItem>
        <FormItem label="项目类型：">
          <span v-if="projectManageModel.projectType==0">短期项目</span>
          <span v-else-if="projectManageModel.projectType==1">长期项目</span>
          <span v-else-if="projectManageModel.projectType==2">运维项目</span>
        </FormItem>
        <FormItem label="可用工作日：">
          <span>{{projectManageModel.days}}小时</span>
        </FormItem>
        <FormItem label="项目周期：">
          <span>{{projectManageModel.planStartDate}} 至 {{projectManageModel.planEndDate}}</span>
        </FormItem>
        <FormItem label="项目描述：" single>
          <!-- <span
            style="display:inline-block;max-height:200px;overflow-y:auto;"
            v-html="projectManageModel.projectContent"
          ></span>-->
          <div v-if="projectManageModel.projectContent==undefined||''">
            <span style="color:#999;">暂无描述</span>
          </div>
          <div v-else-if="projectManageModel.projectContent==''">
            <span style="color:#999;">暂无描述</span>
          </div>
          <div v-else>
            <UeditorShow v-model="projectManageModel.projectContent"></UeditorShow>
          </div>
        </FormItem>
      </Form>
      <div style="padding:0 30px;box-sizing:border-box;">
        <h4>相关附件</h4>
        <div style="width:100% ;height:150px;margin-top:10px;">
          <div style="width:100% ;height:100px;">
            <ImagePreview :width="90" :borderRadius="4" :datas="images" @click="openPreview" />
          </div>
          <div>
            <span class="upload-detail-name" v-for="(d,i) of uploadNames" :key="i">{{d}}</span>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button @click="cancel">关闭</Button>
    </div>
  </Modal>
</template>

<script>
import projectmanageAdd from 'model/projectmanage/projectmanageModel';
export default {
  props: ['projectView', 'title'],
  data() {
    return {
      link: this.IMGURL.imgUrl,
      linkT: this.IMGURLT.imgUrlT,
      images: [],
      img: '',
      uploadIds: [],
      uploadNames: [],
      download: [],
      params: {
        hasCloseIcon: false,
        hasDivider: true,
        closeOnMask: false
      },
      projectManageModel: projectmanageAdd.parse({})
    };
  },
  mounted() {},
  methods: {
    getData(Id) {
      this.images = [];
      this.uploadIds = [];
      this.download = [];
      this.uploadNames = [];
      this.projectManageModel.id = Id;
      R.Projectmanage.projectFindOne(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          this.projectManageModel = projectmanageAdd.parse(resp.body);
        }
      });
      R.Projectmanage.findOneImg(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          for (let i = 0; i < resp.body.length; i++) {
            this.uploadIds.push(resp.body[i].id);
            this.uploadNames.push(resp.body[i].docName);
            if (resp.body[i].docExt.indexOf('.doc') != -1) {
              this.images.push(this.linkT + 'doc.jpg');
              this.download.push('0');
            } else if (resp.body[i].docExt.indexOf('.xls') != -1) {
              this.images.push(this.linkT + 'xls.jpg');
              this.download.push('0');
            } else {
              this.images.push(this.link + resp.body[i].docSaveName);
              this.download.push('1');
            }
          }
        }
      });
    },
    cancel() {
      this.$parent.close();
    },
    openPreview(index, data) {
      if (this.download[index] == '0') {
        location.href = this.FILEURL.fileUrl + this.uploadIds[index];
      } else {
        this.$ImagePreview(this.images, index);
      }
    },
    submitAsync() {
      this.isLoading = true;
      this.$refs.form.validAsync().then(result => {
        if (result.result) {
          this.$Message('验证成功');
        }
        this.isLoading = false;
      });
    }
  }
};
</script>
<style lang="less">
// .detail-con {
//   height: 50vh;
// }
.title {
  background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  margin-left: -15px;
  overflow: hidden;
  .h-icon-close {
    float: right;
    line-height: 40px;
    font-size: 16px !important;
  }
}
.upload-detail-name {
  width: 90px;
  vertical-align: top;
  margin-right: 10px;
  font-size: 12px;
  text-align: center;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    overflow: visible;
    white-space: normal;
    word-wrap: break-word;
  }
}
</style>
<style lang="less" scoped>
.h-form /deep/ .h-form-item {
  padding-bottom: 0;
}

//隐藏 ueditor样式
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

