<style lang='less'>
.approveMassage {
  width: 70%;
  margin-left: 7%;
  font-size: 16px;
  border-collapse: collapse;
}
.approveMassage tr {
  height: 30px;
}
.approveMassage td {
  height: 40px;
  border: 1px solid black;
}
</style>

<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div style="height: 800px;">
        <div class="h-panel-body">
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <div class="h-panel-body">
            <Form class="info-basic" :label-width="180" mode="twocolumn" readonly>
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
            <Form class="info-basic" :label-width="180" readonly>
              <FormItem label="请假天数：">{{leaveSerch.leaveDays}}</FormItem>
            </Form>
            <Form class="info-basic" :label-width="180" readonly>
              <FormItem label="请假事由：">{{leaveSerch.content}}</FormItem>
            </Form>
          </div>
          <div class="info-title">
            <h3>审批信息</h3>
          </div>
          <div class="h-panel-body">
            <!-- <Table ref="table" :datas="datas" :border="true">
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
            </Table>-->
            <table ref="table" class="text-center approveMassage">
              <colgroup span="2" style="width: 20%"></colgroup>
              <colgroup span="3" style="width: 25%"></colgroup>
              <colgroup span="4" style="width: 50%"></colgroup>
              <tr>
                <td>审批人</td>
                <td>审批日期</td>
                <td>审批状态</td>
                <td>拒绝理由</td>
              </tr>
              <tr>
                <td>{{leaveSerch.approver}}</td>
                <td>{{leaveSerch.createTime}}</td>
                <td>
                  <div v-if="leaveSerch.status=='2'">
                    <span class="h-tag h-tag-bg-red">未通过</span>
                  </div>
                  <div v-else-if="leaveSerch.status=='1'">
                    <span class="h-tag h-tag-bg-green">已审核</span>
                  </div>
                  <div v-else-if="leaveSerch.status=='0'">
                    <span class="h-tag h-tag-bg-blue">待审核</span>
                  </div>
                  <div v-else></div>
                </td>
                <td>无</td>
              </tr>
            </table>
          </div>
          <p v-height="80"></p>
          <div class="text-center">
            <Button color="red" icon="h-icon-completed" @click="agree">同意</Button>
            <Button color="yellow" @click="refuse">
              <span>
                <i class="icon-circle-cross" style="vertical-align: top"></i>&nbsp;拒绝
              </span>
            </Button>
            <Button color="green" icon="h-icon-close" @click="black">关闭</Button>
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
    agree() {
      if (this.leaveSerch.status == 1 || this.leaveSerch.status == 2) {
        this.$Message('数据已审核过');
      } else {
        this.$Confirm('确定同意？', '同意').then(() => {
          this.leaveSerch.ids = this.$route.params.dataId;
          R.ProjectLeave.leaveAgree(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('已同意');
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    refuse() {
      if (this.leaveSerch.status == 1 || this.leaveSerch.status == 2) {
        this.$Message('数据已审核过');
      } else {
        this.$Confirm('确定拒绝？', '拒绝').then(() => {
          this.leaveSerch.ids = this.$route.params.dataId;
          R.ProjectLeave.leaveRefuse(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('已拒绝');
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    getData() {
      this.leaveSerch.id = this.$route.params.dataId;
      R.ProjectLeave.leaveFindOne(leaveModel.dispose(this.leaveSerch)).then(resp => {
        if (resp.ok) {
          this.leaveSerch.leaveDays = resp.body.leaveDays;
          var start = resp.body.leaveStartTime;
          var end = resp.body.leaveEndTime;
          this.data.value = { start, end };
          this.leaveSerch.id = resp.body.id;
          this.leaveSerch.creator = resp.body.creator;
          this.leaveSerch.status = resp.body.status;
          this.leaveSerch.approver = resp.body.approver;
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
