<template>
  <div>
    <header class="title">
      新增项目
      <i @click="cancel">×</i>
    </header>
    <div :labelPosition="labelPosition">
      <Form
        ref="form"
        :mode="mode"
        :model="projectManageModel"
        :label-width="120"
        :top="0.2"
        :rules="validationRules"
      >
        <div class="list-project">
          <FormItem label="项目名称：" prop="projectName">
            <input type="text" v-model="projectManageModel.projectName" />
          </FormItem>
          <FormItem label="项目编号：" prop="projectCode">
            <input type="text" v-model="projectManageModel.projectCode" />
          </FormItem>
        </div>
        <div class="list-project">
          <FormItem label="项目负责人：" prop="projectLeader">
            <Select v-model="projectManageModel.projectLeader" :datas="param5"></Select>
          </FormItem>
          <FormItem label="项目团队成员：" prop="team">
            <Category :option="param3" type="object" v-model="projectManageModel.team" multiple></Category>
          </FormItem>
        </div>
        <div class="list-project">
          <FormItem label="项目类型：" prop="projectType">
            <Select v-model="projectManageModel.projectType" class="select-demo" :datas="param"></Select>
          </FormItem>
          <FormItem label="可用工作日：" prop="date">
            <div class="h-input-group">
              <input type="text" v-model="data.date" readonly />
              <span class="h-input-addon">&nbsp;&nbsp;天&nbsp;&nbsp;</span>
            </div>
          </FormItem>
        </div>
        <FormItem label="项目周期：" prop="time">
          <Radio
            v-model="data.value4"
            :datas="param4"
            keyName="code"
            @input="RadioChange"
            titleName="name"
          ></Radio>
        </FormItem>
        <FormItem prop="time">
          <DateRangePicker
            v-model="data.value"
            :format="format"
            placeholder="开始—结束"
            @confirm="changeDate"
          ></DateRangePicker>
        </FormItem>

        <FormItem label="项目描述：" prop="projectContent">
          <RichTextEditor v-model="projectManageModel.projectContent"></RichTextEditor>
        </FormItem>
        <FormItem label="附件：" prop="accessory">
          <!-- <Qiniu :options="options" type="image" :limit="2" data-type="file" v-model="data.file"></Qiniu> -->
          <input type="file" id="upload-file" />
          <label for="upload-file" class="h-btn h-btn-primary">上传附件</label>
        </FormItem>
        <FormItem label="访问控制：" prop="projectPower">
          <Radio
            v-model="projectManageModel.projectPower"
            :datas="param2"
            keyName="code"
            titleName="name"
          ></Radio>
        </FormItem>
      </Form>
    </div>
    <footer class="h-modal-footer">
      <Button @click="submit" color="blue">保存</Button>
      <Button @click="cancel">取消</Button>
    </footer>
  </div>
</template>

<script>
import projectmanageAdd from 'model/projectmanage/projectmanageModel';

export default {
  props: ['openModal', 'title'],
  data() {
    return {
      projectManageModel: projectmanageAdd.parse({}),
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
      value3: '',
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
      validationRules: {
        required: ['projectName', 'projectCode', 'projectLeader', 'team', 'projectType', 'projectContent']
      },
      format: '',
      param: [
        { title: '短期项目', key: '0' },
        { title: '长期项目', key: '1' },
        { title: '运维项目', key: '2' }
      ],
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
    this.projectManageModel.projectPower = 0;
    this.data.value = { start: this.getNewDate(), end: this.getEndDate(7) };
    this.data.date = 7;
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
    this.projectManageModel.projectContent = null;
  },
  methods: {
    changeDate() {
      this.data.date = this.DataIff(this.data.value.start, this.data.value.end, 'day');
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
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(7) };
        this.data.date = 7;
      } else if (data == 1) {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(14) };
        this.data.date = 14;
      } else if (data == 2) {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(30) };
        this.data.date = 30;
      } else if (data == 3) {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(60) };
        this.data.date = 60;
      } else if (data == 4) {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(90) };
        this.data.date = 90;
      } else if (data == 5) {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(180) };
        this.data.date = 180;
      } else if (data == 6) {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(365) };
        this.data.date = 365;
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
      this.$emit('close');
    },
    // 获取父组件的getData方法
    getData() {
      this.$emit('getParentData');
    },
    submit() {
      this.projectManageModel.planStartDate = this.data.value.start;
      this.projectManageModel.planEndDate = this.data.value.end;
      this.projectManageModel.days = this.data.date;
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
          } else {
            id = id + this.projectManageModel.team[i].id + ',';
          }
        }
        this.projectManageModel.idList = id;
        R.Projectmanage.projectmanageAdd(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$emit('close');
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.projectManageModel = projectmanageAdd.parse({});
              this.getData();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.$emit('close');
            this.$Loading.close();
          }
        });
      }
    }
  }
};
</script>
<style>
/**修改弹框默认样式 */
.h-modal .h-notify-container .h-modal-header,
.h-modal .h-notify-container header:first-child {
  background: #2d7bf4;
  color: #fff;
  margin-bottom: 15px;
}
/**设置home以外的table字体大小 */
.h-table .h-table-tbody td {
  font-size: 14px;
}
.h-modal .h-notify-content {
  padding-top: 0;
}
.h-modal .h-notify-content .title {
  width: 100%;
}
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
</style>
<style lang="less">
.title {
  background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  i {
    font-size: 24px;
    font-style: normal;
    float: right;
    cursor: pointer;
  }
}
#upload-file {
  opacity: 0;
  position: absolute;
  clip: rect(0 0 0 0);
}
</style>

