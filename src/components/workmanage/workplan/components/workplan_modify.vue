<template>
  <Modal v-model="UpdatePlan" v-bind="params">
    <div slot="header" class="title">修改工作计划<i @click="cancel">×</i></div>
    <div>
      <Form
        :label-width="110"
        :mode="mode"
        :model="workplanSerch"
        :rules="validationRules"
        ref="form"
        :top="0.2"
      >
        <FormItem label="计划标题：" prop="planTitle">
          <input type="text" v-model="workplanSerch.planTitle" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="计划类型：" prop="time">
          <Select
            v-model="workplanSerch.planType"
            :datas="param1"
            titleName="name"
            keyName="name"
            @input="SelectChange"
            placeholder="周计划/月计划/季度计划/半年计划/年计划"
          ></Select>
        </FormItem>
        <FormItem label="计划日期：" prop="time;">
          <Row :space="0">
            <Cell width="20">
              <DateRangePicker
                v-model="data.value"
                :format="format"
                placeholder="开始—结束"
                @confirm="changeDate"
              ></DateRangePicker>
            </Cell>
            <Cell width="2">
              <button class="h-btn" style="width: 60px;">
                <span>预计</span>
              </button>
            </Cell>
            <Cell width="2">
              <input type="text" style="border: 1px solid #d3d3d3" v-model="data.date" readonly />
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="计划内容：" prop="content">
          <RichTextEditor v-model="workplanSerch.content"></RichTextEditor>
        </FormItem>
        <FormItem :no-padding="true" style="text-align: right">
          <Button @click="cancel">取消</Button>
          <Button color="primary" @click="submit">确定</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
import workplanModel from 'model/workplan/workplanModel';
export default {
  props: ['UpdatePlan'],
  data() {
    return {
      workplanSerch: workplanModel.parse({}),
      format: '',
      param1: [{ name: '周计划' }, { name: '月计划' }, { name: '季度计划' }, { name: '半年计划' }, { name: '年计划' }],
      params: {
        closeOnMask: false,
        hasDivider: true
      },
      data:{
        value:{},
        date: null,
      },
      mode: 'single',
      value: {},
      isLoading: false,
      isInputAsyncError: false,
      validationRules: {
        required: ['planTitle', 'planType', 'content']
      }
    };
  },
  mounted() {},
  methods: {
    getData(Id) {
      this.workplanSerch.id = Id;
      R.ProjectPlan.planFindOne(workplanModel.dispose(this.workplanSerch)).then(resp => {
        if (resp.ok) {
          this.data.date = resp.body.days;
          var start = resp.body.planStartDate;
          var end = resp.body.planEndDate;
          this.data.value = { start, end };
          this.workplanSerch.planTitle = resp.body.planTitle;
          this.workplanSerch.planType = resp.body.planType;
          this.workplanSerch.content = resp.body.content;
          this.workplanSerch.id = resp.body.id;
        }
      });
    },
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
    SelectChange(workplanSerch) {
      if (workplanSerch == '周计划') {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(7) };
        this.data.date = 7;
      } else if (workplanSerch == '月计划') {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(30) };
        this.data.date = 30;
      } else if (workplanSerch == '季度计划') {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(90) };
        this.data.date = 90;
      } else if (workplanSerch == '半年计划') {
        this.data.value = { start: this.getNewDate(), end: this.getEndDate(180) };
        this.data.date = 180;
      } else if (workplanSerch == '年计划') {
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
    submit() {
      this.workplanSerch.planStartDate = this.data.value.start;
      this.workplanSerch.planEndDate = this.data.value.end;
      this.workplanSerch.days = this.data.date;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.ProjectPlan.planAdd(workplanModel.dispose(this.workplanSerch)).then(resp => {
          if (resp.ok) {
            this.$Message.success('保存成功');
            this.cancel();
            setTimeout(() => {
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.cancel();
            setTimeout(() => {
              this.$parent.getData();
            }, 1000);
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
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    cancel() {
      this.$parent.close();
    }
  }
};
</script>