<style lang='less'>
.app-home-vue {
  .h-table-header table {
    background-color: #ffffff;
  }
}
</style>
  <template>
  <div class="app-home-vue frame-page">
    <div class="h-panel">
      <div class="h-panel-body">
        <h3>基本信息</h3>
      </div>
      <div>
        <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
          <FormItem label="姓名:">{{datas[0].userName}}</FormItem>
          <FormItem label="上班打卡时间:">{{datas[0].startAttrTime}}</FormItem>
          <FormItem label="部门:">
            <div v-if="datas[0].department==1">
              <span>软件部</span>
            </div>
            <div v-else-if="datas[0].department==2">
              <span>集成部</span>
            </div>
            <div v-else-if="datas[0].department==3">
              <span>财务部</span>
            </div>
            <div v-else></div>
          </FormItem>
          <FormItem label="下班打卡时间:">{{datas[0].endAttrTime}}</FormItem>
        </Form>
      </div>
      <div class="h-panel-body">
        <h3>补录信息</h3>
      </div>
      <div style="width:80%;margin-left:7%">
        <Table ref="table" :datas="datas" :border="border">
          <TableItem :width="150" prop="userName" title="姓名" align="center"></TableItem>
          <TableItem :width="200" prop="recordingTime" title="补录日期" align="center"></TableItem>
          <TableItem prop="details" title="补录描述" align="center"></TableItem>
        </Table>
      </div>
      <div class="h-panel-body">
        <h3>审批信息</h3>
      </div>
      <div style="width:80%;margin-left:7%">
        <Table ref="table" :datas="datas" :border="border">
          <TableItem :width="150" prop="auditUser" title="审核人" align="center"></TableItem>
          <TableItem :width="200" prop="auditTime" title="审核日期" align="center"></TableItem>
          <TableItem :width="150" title="审核状态" align="center">
            <template slot-scope="{data}">
              <div v-if="data.auditStatus=='2'">
                <span class="h-tag h-tag-bg-red">未通过</span>
              </div>
              <div v-else-if="data.auditStatus=='1'">
                <span class="h-tag h-tag-bg-green">已审核</span>
              </div>
              <div v-else-if="data.auditStatus=='0'">
                <span class="h-tag h-tag-bg-blue">待审核</span>
              </div>
              <div v-else></div>
            </template>
          </TableItem>
          <TableItem prop="reason" title="拒绝理由" align="center"></TableItem>
        </Table>
      </div>
      <p v-height="80"></p>
      <div class="h-panel-body">
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
      <p v-height="50"></p>
    </div>
  </div>
</template>
<script>
import myAttModel from 'model/att/attModel';
export default {
  data() {
    return {
      myAttSearch: myAttModel.parse({}),
      border: true,
      datas: [],
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to,from) {
      if (this.$route.params.dataId!=null) {
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
      if (this.myAttSearch.auditStatus == 1 || this.myAttSearch.auditStatus == 2) {
        this.$Message('数据已审核过');
      } else {
      this.$Confirm('确定同意？', '同意').then(() => {
        this.myAttSearch.ids = this.$route.params.dataId;
        R.ProjecetMyAtt.approvePass(myAttModel.dispose(this.myAttSearch)).then(resp => {
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
      if (this.myAttSearch.auditStatus == 1 || this.myAttSearch.auditStatus == 2) {
        this.$Message('数据已审核过');
      } else {
      this.$Confirm('确定拒绝？', '拒绝').then(() => {
        this.myAttSearch.ids = this.$route.params.dataId;
        R.ProjecetMyAtt.approveRefuse(myAttModel.dispose(this.myAttSearch)).then(resp => {
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
      this.myAttSearch.id = this.$route.params.dataId;
      R.ProjecetMyAtt.approveView(myAttModel.dispose(this.myAttSearch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          
          // this.datas.userName = resp.body.userName;
          // this.myAttSearch.id = resp.body.id;
          this.myAttSearch.userName = resp.body.userName;
          // this.myAttSearch.department = resp.body.department;
          // this.myAttSearch.recordingTime = resp.body.recordingTime;
          // this.myAttSearch.details = resp.body.details;
          // this.myAttSearch.auditUser = resp.body.auditUser;
          // this.myAttSearch.auditTime = resp.body.auditTime;
          // this.myAttSearch.auditStatus = resp.body.auditStatus;
          // this.myAttSearch.reason = resp.body.reason;
          // this.myAttSearch.startAttrTime = resp.body.startAttrTime;
          // this.myAttSearch.endAttrTime = resp.body.endAttrTime;
        }
      });
    }
  }
};
</script>