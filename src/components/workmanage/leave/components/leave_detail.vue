<style lang='less'>
</style>
<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div style="height: 800px;">
        <div class="h-panel-body">
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
            <FormItem label="请假主题：">{{leaveSerch.leaveTitle}}</FormItem>
            <FormItem label="部门：">
              <span>{{leaveSerch.departmentName}}</span>
            </FormItem>
            <FormItem label="请假类型：">
              <span>{{leaveSerch.leaveType}}</span>
            </FormItem>
            <FormItem label="申请人：">
              <span>{{leaveSerch.creator}}</span>
            </FormItem>
            <FormItem label="请假时间段：">
              <span>{{data.value.start}}—{{data.value.end}}</span>
            </FormItem>
            <FormItem label="申请日期：">
              <span>{{leaveSerch.createTime}}</span>
            </FormItem>
          </Form>
          <Form class="info-basic" :label-width="200" readonly>
            <FormItem label="请假事由："><p v-html="leaveSerch.content"></p></FormItem>
          </Form>
          <div class="info-title">
            <h3>审批信息</h3>
          </div>
          <div style="width:85%;margin: 0 auto;">
            <Table ref="table" :datas="datas" :border="true">
              <TableItem prop="approver" title="审批人" align="center"></TableItem>
              <TableItem prop="time" title="审批日期" align="center"></TableItem>
              <TableItem title="审批状态" align="center">
                <template slot-scope="{data}">
                  <div v-if="data.status=='未通过'">
                    <Button :circle="true" color="red">{{data.status}}</Button>
                  </div>
                  <div v-else-if="data.status=='已审批'">
                    <Button :circle="true" color="blue">{{data.status}}</Button>
                  </div>
                  <div v-else-if="data.status=='待审批'">
                    <Button :circle="true" color="green">{{data.status}}</Button>
                  </div>
                  <div v-else></div>
                </template>
              </TableItem>
              <TableItem prop="type" title="拒绝理由" align="center"></TableItem>
            </Table>
          </div>
          <p v-height="80"></p>
          <div class="text-center">
            <button class="h-btn h-btn-green" @click="black">
              <i class="icon-cross"></i>&nbsp;返回
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leaveModel from 'model/leave/leaveModel';
export default {
  data() {
    return {
      leaveSerch: leaveModel.parse({}),
      isLoading: false,
      datas: [],
      data: {
        value: {},
        date: null
      }
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
    getData() {
      this.leaveSerch.id = this.$route.params.dataId;
      R.ProjectLeave.leaveFindOne(leaveModel.dispose(this.leaveSerch)).then(resp => {
        if (resp.ok) {
          this.data.date = resp.body.leaveDays;
          var start = resp.body.leaveStartTime;
          var end = resp.body.leaveEndTime;
          this.data.value = { start, end };
          this.leaveSerch.id = resp.body.id;
          this.leaveSerch.creator = resp.body.creator;
          this.leaveSerch.leaveTitle = resp.body.leaveTitle;
          this.leaveSerch.createTime = resp.body.createTime;
          this.leaveSerch.departmentName = resp.body.departmentName;
          this.leaveSerch.leaveType = resp.body.leaveType;
          this.leaveSerch.content = resp.body.content;
        }
      });
    }
  }
};
</script>
