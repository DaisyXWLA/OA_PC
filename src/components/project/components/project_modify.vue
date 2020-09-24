<template>
  <Modal v-model="projectUpdate" v-bind="params">
    <div slot="header" class="title">
      编辑项目
      <i class="h-icon-close" @click="cancel"></i>
    </div>
    <div :labelPosition="labelPosition">
      <Form
        ref="form"
        mode="twocolumn"
        :model="projectManageModel"
        :label-width="120"
        :top="0.2"
        :rules="validationRules"
      >
        <FormItem label="项目名称：" single prop="projectName">
          <input type="text" v-model="projectManageModel.projectName" />
        </FormItem>
        <FormItem label="项目编号：" prop="projectCode">
          <input type="text" v-model="projectManageModel.projectCode" />
        </FormItem>
        <FormItem label="项目负责人：" prop="projectLeader">
          <Select v-model="projectManageModel.projectLeader" :datas="param5"></Select>
        </FormItem>
        <FormItem label="项目团队成员：" prop="team">
          <Category
            v-tooltip
            theme="white"
            :option="param3"
            type="object"
            v-model="projectManageModel.team"
            multiple
          ></Category>
        </FormItem>
        <FormItem label="项目类型：" prop="projectType">
          <Select v-model="projectManageModel.projectType" class="select-demo" :datas="param"></Select>
        </FormItem>

        <FormItem label="项目周期：" single prop="time">
          <Radio
            v-model="data.value4"
            :datas="param4"
            keyName="code"
            @input="RadioChange"
            titleName="name"
          ></Radio>
        </FormItem>
        <FormItem label="可用工作日：" single prop="date">
          <Row>
            <Cell :width="21">
              <Row>
                <Cell :width="12">
                  <Row :space="3">
                    <Cell :width="23">
                      <DatePicker
                        v-model="min"
                        @input="changeDate"
                        type="datetime"
                        placeholder="请选择开始日期"
                      ></DatePicker>
                    </Cell>
                    <Cell :width="1">_</Cell>
                  </Row>
                </Cell>
                <Cell :width="12">
                  <DatePicker
                    v-model="max"
                    @input="changeDate"
                    type="datetime"
                    placeholder="请选择结束日期"
                  ></DatePicker>
                </Cell>
              </Row>
            </Cell>
            <Cell :width="3">
              <div class="h-input-group">
                <input type="text" v-model="data.date" readonly />
                <span class="h-input-addon">&nbsp;&nbsp;时&nbsp;&nbsp;</span>
              </div>
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="项目描述：" single prop="projectContent">
          <Ueditor v-model="projectManageModel.projectContent"></Ueditor>
        </FormItem>
        <FormItem label="附件：" single prop="accessory" style="padding-bottom:0;">
          <uploadFile @getUploadId="getUploadId"></uploadFile>
          <div style="width:100% ;height:110px; margin-top: 10px;">
            <div style="width:100% ;height:90px;">
              <Uploader type="images" data-type="url" :files="images" @deletefile="deletefile"></Uploader>
            </div>
            <div>
              <span class="upload-name" v-for="(d,i) of uploadNames" :key="i">{{d}}</span>
            </div>
          </div>
        </FormItem>

        <FormItem
          label="访问控制："
          single
          prop="projectPower"
          style="margin-top:30px;padding-bottom:0;"
        >
          <Radio
            v-model="projectManageModel.projectPower"
            :datas="param2"
            keyName="code"
            titleName="name"
          ></Radio>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button @click="submit" color="blue">更新</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import projectmanageAdd from 'model/projectmanage/projectmanageModel';
import uploadFile from '../../common/oa/upload_file';
import UploadModel from 'model/upload/upload';
export default {
  props: ['projectUpdate', 'title', 'projectId'],
  components: {
    uploadFile
  },
  data() {
    return {
      projectManageModel: projectmanageAdd.parse({}),
      UploadAdd: UploadModel.parse({}),
      link: this.IMGURL.imgUrl,
      linkT: this.IMGURLT.imgUrlT,
      images: [],
      uploadIds: [],
      uploadNames: [],
      options: {
        max_file_size: '1mb'
      },
      params: {
        hasCloseIcon: false,
        hasDivider: true,
        closeOnMask: false
      },
      mode: 'single',
      param2: [
        { name: '默认设置（有项目视图权限，即可访问）', code: 0 },
        { name: '私有项目（只有项目团队成员才能访问）', code: 1 }
      ],
      min: '',
      max: '',
      value3: '',
      validationRules: {
        required: ['projectName', 'projectCode', 'projectLeader', 'team', 'projectType', 'projectContent']
      },
      data: {
        item: null,
        number: null,
        name: null,
        team: null,
        date: null,
        textareaData: null,
        select: [],
        contro: '0',
        value4: '0',
        value: {},
        describe: '',
        file: []
      },
      format: '',
      param: [],
      labelPosition: 'right',
      param4: [
        { name: '一星期', code: 0 },
        { name: '两星期', code: 1 },
        { name: '一个月', code: 2 },
        { name: '两个月', code: 3 },
        { name: '三个月', code: 4 },
        { name: '半年', code: 5 },
        { name: '一年', code: 6 }
      ],
      param5: [],
      param3: {
        keyName: 'id',
        titleName: 'name',
        datas: []
      }
    };
  },
  mounted() {
    this.data.value = { start: this.getNewDate(), end: this.getEndDate(7) };
    this.data.date = 7;
  },
  methods: {
    getUploadId(data) {
      this.$Loading();
      if (data.id.length > 10) {
        setTimeout(() => {
          this.$Loading.close();
          this.uploadIds.push(data.id);
          this.uploadNames.push(data.docName);
          this.$Message.success('上传成功');
        }, 1000);
        if (data.ext.indexOf('.doc') != -1) {
          this.images.push(this.linkT + 'doc.jpg');
        } else if (data.ext.indexOf('.xls') != -1) {
          this.images.push(this.linkT + 'xls.jpg');
        } else if (data.ext.indexOf('.jp') != -1) {
          this.images.push(this.link + data.name);
        } else if (data.ext.indexOf('.png') != -1) {
          this.images.push(this.link + data.name);
        } else {
          this.images.push(this.linkT + 'doc.jpg');
        }
        document.querySelectorAll('.name');
      } else {
        this.$Message.error('上传失败');
      }
    },
    getData(Id) {
      R.Rms.AList(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          this.param3.datas = resp.body;
        }
      });
      R.Rms.List(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          this.param5 = resp.body;
        }
      });
      this.projectManageModel.code = 'project';
      R.dictManage.findDictAll(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          this.param = resp.body;
        }
      });
      this.projectManageModel.id = Id;
      R.Projectmanage.projectFindOne(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          this.data.date = resp.body.days;
          this.min = resp.body.planStartDate;
          this.max = resp.body.planEndDate;
          this.projectManageModel.projectLeader = resp.body.projectLeader;
          this.projectManageModel.projectName = resp.body.projectName;
          this.projectManageModel.projectCode = resp.body.projectCode;
          this.projectManageModel.projectType = resp.body.projectType;
          this.projectManageModel.projectPower = resp.body.projectPower;
          this.projectManageModel.projectContent = resp.body.projectContent;
          this.projectManageModel.id = resp.body.id;
          var list = resp.body.projectInfoMemberEntities;
          for (var i = 0; i < list.length; i++) {
            list[i].id = list[i].memberId;
            list[i].name = list[i].memberName;
          }
          this.projectManageModel.team = list;
          if (this.data.date <= 168) {
            this.data.value4 = '0';
          }
          if (this.data.date > 168 && this.data.date <= 336) {
            this.data.value4 = '1';
          }
          if (this.data.date > 336 && this.data.date <= 720) {
            this.data.value4 = '2';
          }
          if (this.data.date > 720 && this.data.date <= 1440) {
            this.data.value4 = '3';
          }
          if (this.data.date > 1440 && this.data.date <= 2160) {
            this.data.value4 = '4';
          }
          if (this.data.date > 2160 && this.data.date <= 4320) {
            this.data.value4 = '5';
          }
          if (this.data.date > 4320) {
            this.data.value4 = '6';
          }
        }
      });
      this.images = [];
      this.uploadIds = [];
      this.download = [];
      this.uploadNames = [];
      R.Projectmanage.findOneImg(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          for (let i = 0; i < resp.body.length; i++) {
            this.uploadIds.push(resp.body[i].id);
            this.uploadNames.push(resp.body[i].docName);
            if (resp.body[i].docExt.indexOf('.doc') != -1) {
              this.images.push(this.linkT + 'doc.jpg');
            } else if (resp.body[i].docExt.indexOf('.xls') != -1) {
              this.images.push(this.linkT + 'xls.jpg');
            } else {
              this.images.push(this.link + resp.body[i].docSaveName);
            }
          }
        }
      });
    },
    deletefile(file) {
      this.images.splice(file, 1);
      this.UploadAdd.ids = this.uploadIds[file];
      R.Upload.delete(UploadModel.dispose(this.UploadAdd)).then(resp => {
        if (resp.ok) {
        }
      });
      this.uploadIds.splice(file, 1);
      this.uploadNames.splice(file, 1);
    },
    changeDate() {
      if (this.DataIff(this.min, this.max, 'hour') < 0) {
        this.$Message.error('结束时间必须大于开始时间');
        this.max = '';
      } else {
        this.data.date = this.DataIff(this.min, this.max, 'hour');
      }
    },
    //计算日期差
    DataIff(startTime, endTime, diffType) {
      startTime = startTime.replace(/\-/g, '/');
      endTime = endTime.replace(/\-/g, '/');
      //将计算间隔类性字符转换为小写
      diffType = diffType.toLowerCase();
      var sTime = new Date(startTime); //开始时间
      var eTime = new Date(endTime); //结束时间
      //作为除数的数字
      var divNum = 1;
      switch (diffType) {
        case 'second':
          divNum = 1000;
          break;
        case 'minute':
          divNum = 1000 * 60;
          break;
        case 'hour':
          divNum = 1000 * 3600;
          break;
        case 'day':
          divNum = 1000 * 3600 * 24;
          break;
        default:
          break;
      }
      return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
    },
    RadioChange(data) {
      if (data == 0) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(7) + ' 00:00';
        this.data.date = 168;
      } else if (data == 1) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(14) + ' 00:00';
        this.data.date = 336;
      } else if (data == 2) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(30) + ' 00:00';
        this.data.date = 720;
      } else if (data == 3) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(60) + ' 00:00';
        this.data.date = 1440;
      } else if (data == 4) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(90) + ' 00:00';
        this.data.date = 2160;
      } else if (data == 5) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(180) + ' 00:00';
        this.data.date = 4320;
      } else if (data == 6) {
        this.min = this.getNewDate() + ' 00:00';
        this.max = this.getEndDate(365) + ' 00:00';
        this.data.date = 8760;
      }
    },
    getNewDate() {
      var date = new Date();
      var seperator1 = '-';
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getEndDate(dd) {
      var date = new Date();
      var date2 = new Date(date);
      date2.setDate(date.getDate() + dd);
      var seperator1 = '-';
      var year = date2.getFullYear();
      var month = date2.getMonth() + 1;
      var strDate = date2.getDate();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    init() {
      const vm = this;
      this.data.name = vm.$props.select;
    },
    check() {
      if (this.title == '修改') {
      }
    },
    cancel() {
      this.$parent.close();
    },
    submit() {
      this.projectManageModel.planStartDate = this.min;
      this.projectManageModel.planEndDate = this.max;
      this.projectManageModel.days = this.data.date;
      this.projectManageModel.uploadId = this.uploadIds.toString();
      this.projectManageModel.projectLeader = this.projectManageModel.projectLeader;
      if (this.projectManageModel.projectContent == null) {
        this.projectManageModel.projectContent = '';
      }
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        var id = '';
        for (var i = 0; i < this.projectManageModel.team.length; i++) {
          if (this.projectManageModel.team[i].name.indexOf('部') != -1) {
            id = id + this.projectManageModel.team[i].id + '-,';
          } else {
            id = id + this.projectManageModel.team[i].id + ',';
          }
        }
        this.projectManageModel.idList = id;
        R.Projectmanage.projectmanageUpdate(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('修改成功');
              this.projectManageModel = projectmanageAdd.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('修改失败');
            this.$parent.close();
            this.$Loading.close();
          }
        });
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
.w-e-text-container {
  height: 120px !important;
}
// .h-form-item-label {
//   width: 120px !important;
// }
// .h-form .h-form-item-content {
//   margin-left: 120px !important;
// }
.h-uploader-image {
  width: 90px;
  height: 90px;
}
.h-uploader-image-empty {
  display: none;
}
.upload-name {
  width: 90px;
  vertical-align: top;
  margin-right: 10px;
  margin-top: 5px;
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
.h-category-input-border /deep/ .h-category-show {
  height: 32px;
  overflow-y: auto;
}
</style>
