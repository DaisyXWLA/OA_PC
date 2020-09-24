<template>
  <Modal v-model="isUpdateShow" v-bind="params">
    <div slot="header" class="title">
      编辑任务分派
      <i class="h-icon-close" @click="cancel"></i>
    </div>
    <div>
      <Form
        :label-width="80"
        mode="twocolumn"
        :model="taskModel"
        ref="form"
        :rules="validationRules"
        :top="0.2"
      >
        <div class="list-project">
          <FormItem label="任务名称" prop="taskName">
            <input type="text" v-model="taskModel.taskName" placeholder="请输入" v-wordlimit="30" />
          </FormItem>
          <FormItem label="任务类型" prop="taskType">
            <Select v-model="taskModel.taskType" :datas="paramq"></Select>
          </FormItem>
        </div>
        <div class="list-project">
          <FormItem label="关联项目" prop="projectInfo">
            <Select v-model="taskModel.projectInfo" :datas="projectOption"></Select>
          </FormItem>
          <FormItem label="指派给" prop="executor">
            <Select v-model="taskModel.executor" :datas="paramExecutor" :filterable="true"></Select>
          </FormItem>
        </div>
        <FormItem label="任务周期" :required="true" single>
          <Row>
            <Cell :width="20">
              <Row>
                <Cell :width="12">
                  <Row :space="3">
                    <Cell :width="23">
                      <FormItem
                        label="开始日期"
                        prop="planStartTime"
                        :show-label="false"
                        style="width:100%;padding-bottom:0;"
                      >
                        <DatePicker
                          v-model="taskModel.planStartTime"
                          @input="changeDate"
                          type="datetime"
                          placeholder="请选择开始日期"
                        ></DatePicker>
                      </FormItem>
                    </Cell>
                    <Cell :width="1">_</Cell>
                  </Row>
                </Cell>
                <Cell :width="12">
                  <FormItem
                    label="结束日期"
                    prop="planEndTime"
                    :show-label="false"
                    style="width:100%;padding-bottom:0;"
                  >
                    <DatePicker
                      v-model="taskModel.planEndTime"
                      @input="changeDate"
                      type="datetime"
                      placeholder="请选择结束日期"
                    ></DatePicker>
                  </FormItem>
                </Cell>
              </Row>
            </Cell>
            <Cell width="1" align="center">
              <span style="display:inline-block;margin-top:20%;">预计</span>
            </Cell>
            <Cell :width="3">
              <div class="h-input-group">
                <input type="text" v-model="taskModel.planHours" style="border-radius:0;" readonly />
                <span class="h-input-addon">&nbsp;&nbsp;工时&nbsp;&nbsp;</span>
              </div>
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="抄送人" prop="copyPerson">
          <Select v-model="taskModel.copyPerson" :datas="paramCopyPerson" :multiple="true"></Select>
        </FormItem>
        <FormItem label="优先级" class="priority">
          <SwitchList v-model="taskModel.priority" :datas="params6"></SwitchList>
        </FormItem>
        <FormItem label="任务描述" prop="taskContent" single>
          <Ueditor v-model="taskModel.taskContent"></Ueditor>
        </FormItem>
        <FormItem label="附件" ref="datapicker" prop="dateData" single style="padding-bottom:0;">
          <uploadFile @getUploadId="getUploadId"></uploadFile>
          <div style="width:100% ;height:110px;margin-top: 10px;">
            <div style="width:100% ;height:90px;">
              <Uploader type="images" data-type="url" :files="images" @deletefile="deletefile"></Uploader>
            </div>
            <div>
              <span class="upload-name" v-for="(d,i) of uploadNames" :key="i">{{ d }}</span>
            </div>
          </div>
        </FormItem>
        <!-- <FormItem label="添加之后" prop="rateData" single style="margin-top:30px;padding-bottom:0;">
          <Radio v-model="value8" :datas="param8"></Radio>
        </FormItem>-->
      </Form>
    </div>
    <div slot="footer">
      <Button class="h-btn h-btn-primary" @click="submit">更新</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import myamend from 'model/task/taskUpdate';
import taskList from 'model/task/taskList';
import UploadModel from 'model/upload/upload';
import uploadFile from '../../common/oa/upload_file';
export default {
  props: ['isUpdateShow', 'title', 'param', 'projectOption', 'member'],
  components: {
    uploadFile
  },
  data() {
    return {
      taskModel: taskList.parse({}),
      value8: '1',
      param8: { 1: '继续为该需求添加任务', 2: '返回任务列表', 3: '返回需求列表' },
      value6: '1',
      paramExecutor: [],
      paramCopyPerson: [],
      paramProject: [],
      validationRules: {
        required: ['taskName', 'taskType', 'planStartTime', 'planEndTime', 'executor', 'projectInfo']
      },
      paramq: [],
      params6: [
        {
          key: '0',
          title: '重要',
          icon: 'h-icon-home'
        },
        {
          key: '1',
          title: '次要',
          icon: 'h-icon-task'
        },
        {
          key: '2',
          title: '紧急',
          icon: 'h-icon-task'
        },
        {
          key: '3',
          title: '一般',
          icon: 'h-icon-users'
        }
      ],
      params: {
        closeOnMask: false,
        hasDivider: true
      },
      mode: 'single',
      data: {
        param2: '',
        param3: '',
        param4: '',
        param5: '',
        param6: { start: '', end: '' },
        param8: '',
        param7: '<p></p>'
      },
      isLoading: false,
      link: this.IMGURL.imgUrl,
      linkT: this.IMGURLT.imgUrlT,
      images: [],
      uploadIds: [],
      uploadNames: [],
      UploadAdd: UploadModel.parse({})
    };
  },
  mounted() {
    this.init();
    R.Time.findWorkTime().then(resp => {
      if (resp.ok) {
        this.mStartTime = resp.body.mStartTime;
        this.mEndTime = resp.body.mEndTime;
        this.aStartTime = resp.body.aStartTime;
        this.aEndTime = resp.body.aEndTime;
        this.workTime = resp.body.workTime;
      }
    });
  },
  methods: {
    init() {
      const vm = this;
      this.data.param4 = vm.$props.select;
    },
    changeDate() {
      if (this.DataIff(this.taskModel.planStartTime, this.taskModel.planEndTime, 'hour') < 0) {
        this.$Message.error('结束时间必须大于开始时间');
        this.taskModel.planEndTime = '';
      } else {
        //this.taskModel.planHours = parseInt((this.DataIff(this.taskModel.planStartTime, this.taskModel.planEndTime, 'hour') / 24).toFixed(1) * 8);
        if (this.taskModel.planStartTime.length > 0 && this.taskModel.planEndTime.length > 0) {
          this.taskModel.startDateStr = this.taskModel.planStartTime;
          this.taskModel.endDateStr = this.taskModel.planEndTime;
          R.ProjectTask.getTime(taskList.dispose(this.taskModel)).then(resp => {
            if (resp.ok) {
              this.taskModel.planHours = resp.body;
            }
          });
        }
        // this.taskModel.planHours = this.countSc(this.taskModel.planStartTime, this.taskModel.planEndTime);
      }
    },
    countSc(str1, str2) {
      var mStartTime = parseInt(this.mStartTime);
      var mEndTime = parseInt(this.mEndTime);
      var aStartTime = parseInt(this.aStartTime);
      var aEndTime = parseInt(this.aEndTime);
      var workTime = parseInt(this.workTime);
      if (!str1 || !str2) {
        return 0;
      }
      //开始构造两个日期对象
      var datetime1 = new Date(),
        datetime2 = new Date();

      datetime1.setFullYear(str1.substr(0, 4), str1.substr(5, 2) - 1, str1.substr(8, 2));
      datetime2.setFullYear(str2.substr(0, 4), str2.substr(5, 2) - 1, str2.substr(8, 2));

      datetime1.setMilliseconds(0);
      datetime2.setMilliseconds(0);

      datetime1.setHours(str1.substr(11, 2), 0, 0);
      datetime2.setHours(str2.substr(11, 2), 0, 0);

      if (datetime1.getDay() == 0 || datetime1.getDay() == 6) {
        datetime1.setDate(datetime1.getDate() - 1);
        datetime1.setHours(23, 0, 0);
      }
      if (datetime2.getDay() == 0 || datetime2.getDay() == 6) {
        datetime2.setDate(datetime2.getDate() + 1);
        datetime2.setHours(0, 0, 0);
      }
      var travelHours = 0;

      var datetime3 = datetime1;
      for (var i = 0; i < 60; i++) {
        var sd = datetime1.getDate(),
          ed = datetime2.getDate();
        if (sd == ed - 1) {
          break;
        }
        if (sd == ed) {
          break;
        }
        datetime1.setDate(datetime1.getDate() + 1);
        if (datetime1.getDay() > 0 && datetime1.getDay() < 6) {
          travelHours += workTime;
        }
      }
      if (datetime3.getDate() == datetime2.getDate()) {
        if (parseInt(datetime3.getHours()) <= mStartTime && parseInt(datetime2.getHours()) >= aEndTime) {
          travelHours = workTime;
        } else {
          if (parseInt(datetime3.getHours()) <= mEndTime && parseInt(datetime2.getHours()) >= aStartTime) {
            travelHours = parseInt(datetime2.getHours()) - parseInt(datetime3.getHours()) - (aStartTime - mEndTime);
          }
          if (parseInt(datetime2.getHours()) >= mEndTime && parseInt(datetime2.getHours()) <= aStartTime) {
            if (parseInt(datetime3.getHours()) <= mEndTime) {
              travelHours = parseInt(datetime2.getHours()) - parseInt(datetime3.getHours()) - (aStartTime - mEndTime);
            } else {
              travelHours = 0;
            }
          }
          if (parseInt(datetime3.getHours()) <= mEndTime && parseInt(datetime2.getHours()) <= mEndTime) {
            travelHours = parseInt(datetime2.getHours()) - parseInt(datetime3.getHours());
          }
          if (parseInt(datetime3.getHours()) >= aStartTime) {
            travelHours = parseInt(datetime2.getHours()) - parseInt(datetime3.getHours());
          }
        }
      } else {
        if (parseInt(datetime3.getHours()) <= mStartTime) {
          travelHours += workTime;
        } else {
          if (parseInt(datetime3.getHours()) <= mEndTime) {
            travelHours += mEndTime - parseInt(datetime3.getHours()) + (aEndTime - aStartTime);
          } else {
            if (parseInt(datetime3.getHours()) <= aEndTime) {
              travelHours += aEndTime - parseInt(datetime3.getHours());
            }
          }
        }
        if (parseInt(datetime2.getHours()) >= aEndTime) {
          travelHours += workTime;
        } else {
          if (parseInt(datetime2.getHours()) >= mEndTime) {
            if (parseInt(datetime2.getHours()) >= aStartTime) {
              travelHours += mEndTime - mStartTime + parseInt(datetime2.getHours()) - aStartTime;
            } else {
              travelHours += mEndTime - mStartTime;
            }
          } else {
            if (parseInt(datetime2.getHours()) >= mStartTime) {
              travelHours += parseInt(datetime2.getHours()) - mStartTime;
            }
          }
        }
      }

      return travelHours;
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
    getList() {
      const vm = this;
      this.paramProject = vm.$props.param;
      R.ProjectTask.findPullDown(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.paramExecutor = resp.body;
          this.paramCopyPerson = resp.body;
        }
      });
      this.taskModel.code = 'task';
      R.dictManage.findDictAll(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.paramq = resp.body;
        }
      });
    },
    cancel() {
      this.$parent.close();
    },
    getData(id) {
      this.taskModel.id = id;
      R.ProjectTask.task(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
          this.taskModel.id = resp.body.id;
          this.taskModel.taskName = resp.body.taskName;
          this.taskModel.taskType = resp.body.taskType;
          this.taskModel.executor = resp.body.executor;
          this.taskModel.taskContent = resp.body.taskContent;
          this.taskModel.projectInfo = resp.body.projectInfo;
          this.taskModel.planStartTime = resp.body.planStartTime;
          this.taskModel.planEndTime = resp.body.planEndTime;
          // let start = resp.body.planStartTime;
          // let end = resp.body.planEndTime;
          // this.taskModel.time = { start, end };
          this.taskModel.priority = resp.body.priority;
          this.taskModel.planHours = resp.body.planHours;
          this.taskModel.copyPerson = resp.body.copyPerson.split(',');
        }
      });
      this.uploadIds = [];
      this.images = [];
      this.uploadNames = [];
      R.ProjectTask.findOneImg(taskList.dispose(this.taskModel)).then(resp => {
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
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        if (this.taskModel.copyPerson != null) {
          this.taskModel.copyPerson = this.taskModel.copyPerson.join(',');
        }
        this.taskModel.uploadId = this.uploadIds.toString();
        R.ProjectTask.taskUpdate(taskList.dispose(this.taskModel)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.taskModel = taskList.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.$parent.close();
            this.$Loading.close();
          }
        });
      }
    },

    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    add() {
      this.data.inputsData.push({ value: '' });
    },
    remove(index) {
      this.data.inputsData.splice(index, 1);
    },
    //上傳文件
    onUpload: function(e) {
      this.taskModel.file = e.target.files[0];
      R.Upload.Upload(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
        }
      });
    },
    deletefile(file) {
      this.images.splice(file, 1);
      this.UploadAdd.ids = this.uploadIds[file];
      R.Upload.delete(UploadModel.dispose(this.UploadAdd)).then(resp => {
        if (resp.ok) {
          // console.log(resp);
        }
      });
      this.uploadIds.splice(file, 1);
      this.uploadNames.splice(file, 1);
    },
    getUploadId(data) {
      this.$Loading();
      if (data.id.length > 10) {
        setTimeout(() => {
          this.$Loading.close();
          this.uploadIds.push(data.id);
          this.uploadNames.push(data.docName);
          this.$Message.success('附件上传成功');
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
        this.$Message.error('上传附件失败');
      }
    }
  }
};
</script>
<style lang="less">
.h-form.h-form-single .list-project {
  overflow: hidden;
}
.h-form.h-form-single .list-project .h-form-item {
  width: 48%;
  margin-right: 4%;
  float: left;
}
.h-form.h-form-single .list-project .h-form-item:nth-child(2) {
  width: 48%;
  margin-right: 0;
  float: right;
}
.w-e-text-container {
  height: 120px !important;
}
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
.h-uploader-image {
  width: 90px;
  height: 90px;
}
.h-uploader-image-empty {
  display: none;
}
</style>
<style lang="less" scoped>
.priority /deep/ .h-switchlist > span {
  padding: 8px 12px;
}
</style>