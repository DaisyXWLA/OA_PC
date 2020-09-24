<template>
  <Modal v-model="leaveUpdate" v-bind="params">
    <div slot="header" class="title">请假申请<i @click="cancel">×</i></div>
    <div>
      <Form
        :label-width="110"
        :mode="mode"
        :model="leaveSerch"
        :rules="validationRules"
        ref="form"
        :top="0.2"
         
      >
        <FormItem label="请假主题：" prop="leaveTitle">
          <input type="text" v-model="leaveSerch.leaveTitle" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="请假类型：" prop="leaveType">
          <Select v-model="leaveSerch.leaveType" :datas="param1" titleName="name" keyName="name"></Select>
        </FormItem>
        <FormItem label="请假时间段：" prop="time">
          <Row :space="0">
            <Cell width="20">
              <DateRangePicker
                v-model="data.value"
                :format="format"
                placeholder="开始 - 结束"
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
        <FormItem label="请假理由：" prop="taginputsData">
          <RichTextEditor v-model="leaveSerch.content"></RichTextEditor>
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
import leaveModel from 'model/leave/leaveModel';
export default {
  props: ['leaveUpdate'],
  data() {
    return {
      leaveSerch: leaveModel.parse({}),
      params: {
        closeOnMask: false,
        hasDivider: false
      },
      param1: [{ name: '事假' }, { name: '病假' }, { name: '年休假' }, { name: '婚假' }, { name: '丧假' }, { name: '生育假' }, { name: '陪产假' }],
      data: {
        value: {},
        date: null
      },
      format: '',
      mode: 'single',
      isLoading: false,
      isInputAsyncError: false,
      validationRules: {
        required: ['leaveTitle', 'leaveType', 'value']
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const vm = this;
    },
    getData(Id) {
      this.leaveSerch.id = Id;
      R.ProjectLeave.leaveFindOne(leaveModel.dispose(this.leaveSerch)).then(resp => {
        if (resp.ok) {
          this.data.date = resp.body.leaveDays;
          var start = resp.body.leaveStartTime;
          var end = resp.body.leaveEndTime;
          this.data.value = { start, end };
          this.leaveSerch.leaveTitle = resp.body.leaveTitle;
          this.leaveSerch.leaveType = resp.body.leaveType;
          this.leaveSerch.content = resp.body.content;
          this.leaveSerch.id = resp.body.id;
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
    submit() {
      this.leaveSerch.leaveStartTime = this.data.value.start;
      this.leaveSerch.leaveEndTime = this.data.value.end;
      this.leaveSerch.leaveDays = this.data.date;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.ProjectLeave.leaveUpdate(leaveModel.dispose(this.leaveSerch)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.data.value = {};
              this.data.date = '';
              this.cancel();
              this.$Loading.close();
              this.$Message.success('修改成功');
              this.leaveSerch = leaveModel.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('修改失败');
            this.cancel();
            this.$Loading.close();
            this.leaveSerch = leaveModel.parse({});
            this.$parent.getData();
          }
        });
      }
    },
    cancel() {
      (this.leaveSerch = leaveModel.parse({})), (this.data.value = {});
      this.data.date = '';
      this.$parent.close();
    }
  }
};
</script>