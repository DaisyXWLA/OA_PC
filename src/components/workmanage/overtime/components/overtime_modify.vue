<template>
  <Modal
    v-model="updateOvertime"
    v-bind="params"
  >
    <div slot="header" class="title">修改加班<i @click="cancel">×</i></div>
    <div :labelPosition="labelPosition">
      <Form ref="form" :model="overtimeSerch" :label-width="110" :top="0.2"  >
        <FormItem label="加班主题：" prop="theme">
          <input type="text" v-model="overtimeSerch.title" />
        </FormItem>
        <FormItem label="关联项目：" prop="relatedprojects">
          <Select v-model="data.relatedprojects" class="select-demo" :datas="param"></Select>
        </FormItem>
        <FormItem label="加班时间：" prop="time">
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
              <input type="text" style="border: 1px solid #d3d3d3" v-model="data.date" />
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="加班理由：" prop="reason">
          <RichTextEditor v-model="overtimeSerch.content"></RichTextEditor>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn" @click="cancel">取消</button>
      <button class="h-btn h-btn-primary" @click="submit">确定</button>  
    </div>
  </Modal>
</template>
<script>
import overtimeModel from 'model/overtime/overtimeModel';
export default {
  props: ['updateOvertime'],
  data() {
    return {
      overtimeSerch: overtimeModel.parse({}),
      param: [
        { title: '海友科伟官网开发', key: 'a1', other: '其他值' },
        { title: '办公平台开发', key: 'a2' },
        { title: '郑州师院固定资产', key: 'a3' }
      ],
      params: {
        closeOnMask: false,
        hasDivider: false
      },
      data: {
        value: {},
        date: null
      },
      format: '',
      labelPosition: 'right'
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const vm = this;
    },
    submit() {
      this.overtimeSerch.leaveStartTime = this.data.value.start;
      this.overtimeSerch.leaveEndTime = this.data.value.end;
      this.overtimeSerch.leaveDays = this.data.date;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.ProjectOverTime.overtimeUpdate(overtimeModel.dispose(this.overtimeSerch)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.data.value = {};
              this.data.date = '';
              this.cancel();
              this.$Loading.close();
              this.$Message.success('修改成功');
              this.overtimeSerch = overtimeModel.parse({});
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('修改失败');
            this.cancel();
            this.$Loading.close();
            this.overtimeSerch = overtimeModel.parse({});
            this.$parent.getData();
          }
        });
      }
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
    getData(Id) {
      this.overtimeSerch.id = Id;
      R.ProjectOverTime.overtimeFindOne(overtimeModel.dispose(this.overtimeSerch)).then(resp => {
        if (resp.ok) {
          this.data.date = resp.body.overtimeDays;
          var start = resp.body.overtimeStartTime;
          var end = resp.body.overtimeEndTime;
          this.data.value = { start, end };
          this.overtimeSerch.title = resp.body.title;
          this.overtimeSerch.departmentName = resp.body.departmentName;
          this.overtimeSerch.content = resp.body.content;
          this.overtimeSerch.creator = resp.body.creator;
          this.overtimeSerch.createTime = resp.body.createTime;
          this.overtimeSerch.content = resp.body.content;
          this.overtimeSerch.projectInfo = resp.body.projectInfo;
        }
      });
    },
    cancel() {
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

