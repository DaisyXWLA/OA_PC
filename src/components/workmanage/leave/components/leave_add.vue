<template>
  <Modal v-model="leaveAdd" v-bind="params">
    <div slot="header" class="title">请假申请<i @click="cancel">×</i></div>
    <div>
      <Form :label-width="110" :mode="mode" :model="leaveSerch" :rules="validationRules" ref="form" :top="0.2"  >
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
                :option="param"
                type="datehour"
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
          <Button class="h-btn" @click="cancel">取消</Button>
          <Button class="h-btn h-btn-primary" @click="submit">确定</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
import leaveModel from 'model/leave/leaveModel';
// import manba from 'manba';
export default {
  props: ['leaveAdd'],
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
      param: {
        // start: manba().add(-1, manba.DAY),
        // end: manba().add(30, manba.DAY)
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
        R.ProjectLeave.leaveAdd(leaveModel.dispose(this.leaveSerch)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.data.value = {};
              this.data.date = '';
              this.cancel();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.leaveSerch = leaveModel.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.data.value = {};
            this.data.date = '';
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
<style lang="less">
.title {
  background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  margin-left: -15px;
  i {
    font-size: 24px;
    font-style: normal;
    float: right;
    cursor: pointer;
  }
}
</style>
