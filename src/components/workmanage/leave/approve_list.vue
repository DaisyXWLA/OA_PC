<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            部门：
            <input type="text" v-model="leaveSerch.departmentName" />&nbsp;&nbsp;
            请假时间段：
            <DateRangePicker v-model="leaveSerch.value" :format="format" placeholder="开始 - 结束"></DateRangePicker>&nbsp;&nbsp;
            <span>
              审批状态：
              <Select
                v-model="leaveSerch.status"
                :datas="param"
                :deletable="deletable"
                keyName="code"
                titleName="name"
                :autosize="true"
                style="width: 12%;"
              ></Select>&nbsp;&nbsp;
            </span>
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div>
              <Button color="blue" icon="h-icon-plus" @click="approve">审批</Button>
              <Button color="red" icon="h-icon-completed" @click="batchAgree">批量同意</Button>
              <Button color="yellow" @click="batchRefuse">
                <span>
                  <i class="icon-circle-cross" style="vertical-align: top"></i>&nbsp;批量拒绝
                </span>
              </Button>
            </div>
            <div style="margin-top: 10px">
              <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="checkbox">
                <TableItem :width="80" title="序号" prop="$serial" align="center"></TableItem>
                <TableItem prop="leaveTitle" title="请假主题"></TableItem>
                <TableItem :width="100" prop="leaveType" title="请假类型"></TableItem>
                <TableItem prop="task3" title="请假时间段">
                  <template slot-scope="{data}">
                    <span>{{data.leaveStartTime}}—{{data.leaveEndTime}}</span>
                  </template>
                </TableItem>
                <TableItem :width="150" prop="leaveDays" title="请假天数"></TableItem>
                <TableItem :width="100" prop="departmentName" title="部门"></TableItem>
                <TableItem :width="100" prop="creator" title="申请人"></TableItem>
                <TableItem :width="100" prop="approver" title="审批人"></TableItem>
                <TableItem :width="150" prop="task9" title="审批状态" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.status=='2'">
                      <span class="h-tag h-tag-bg-red">未通过</span>
                    </div>
                    <div v-else-if="data.status=='1'">
                      <span class="h-tag h-tag-bg-green">已审核</span>
                    </div>
                    <div v-else-if="data.status=='0'">
                      <span class="h-tag h-tag-bg-blue">待审核</span>
                    </div>
                    <div v-else></div>
                  </template>
                </TableItem>
                <TableItem :width="300" prop="task12" title="操作" align="center">
                  <template slot-scope="{data}">
                    <button class="h-btn h-btn-s h-btn-red" @click="agree(data)">
                      <i class="h-icon-completed"></i>&nbsp;同意
                    </button>
                    <button class="h-btn h-btn-s h-btn-yellow" @click="refuse(data)">
                      <span>
                        <i class="icon-circle-cross" style="vertical-align: top"></i>&nbsp;拒绝
                      </span>
                    </button>
                    <button
                      class="h-btn h-btn-s"
                      style="border-block-color:#8b04e4"
                      v-bg-color:#8b04e4
                      v-color:white
                      @click="view(data)"
                    >
                      <span>
                        <i class="icon-paper" style="vertical-align: top"></i>&nbsp;详情
                      </span>
                    </button>
                  </template>
                </TableItem>
              </Table>
              <p v-height="15"></p>
              <div>
                <Pagination
                  v-if="pagination.total>0"
                  align="right"
                  v-model="pagination"
                  @change="changePage"
                />
              </div>
            </div>
          </div>
        </div>
      </Cell>
    </Row>
    <leave :a="a" :title="title"></leave>
    <Agreeovertime :agreeovertime="agreeovertime" :title="title"></Agreeovertime>
    <Refuseovertime :refuseovertime="refuseovertime" :title="title"></Refuseovertime>
  </div>
</template>
<script>
import leave from './components/leave_add';
import agree from './components/approve_agree';
import refuse from './components/approve_refuse';
import leaveModel from 'model/leave/leaveModel';
export default {
  components: {
    leave: leave,
    Agreeovertime: agree,
    Refuseovertime: refuse
  },
  data() {
    return {
      leaveSerch: leaveModel.parse({}),
      a: false,
      format: '',
      agreeovertime: false,
      refuseovertime: false,
      deletable: false,
      title: '',
      param: [{ name: '待审核', code: 0 }, { name: '已审核', code: 1 }, { name: '未通过', code: 2 }],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      data: {
        value: {},
        date: null,
      },
      checkbox: true,
      datas: [],
      serial: true,
      isLoading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const vm = this;
      this.getData();
    },
    getPage() {
      this.leaveSerch.page = this.pagination.page;
      this.leaveSerch.size = this.pagination.size;
    },
    search() {
      if (this.leaveSerch.value != null) {
        this.leaveSerch.leaveStartTime = this.leaveSerch.value.start;
        this.leaveSerch.leaveEndTime = this.leaveSerch.value.end;
      }
      this.getData();
      this.getPage();
    },
    reset() {
      this.leaveSerch.status = '';
      this.leaveSerch.value = null;
      this.leaveSerch.departmentName = '';
      this.getData();
    },
    changePage() {
      this.getData(true);
      this.getPage();
    },
    approve() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要审批的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('审批仅支持单条数据');
        } else {
          this.$router.push({ name: 'approve_detail', params: { dataId: this.$refs.table.getSelection()[0].id } });
        }
      }
    },
    batchAgree() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要同意的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定同意？', '同意').then(() => {
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.leaveSerch.ids = ids.join(',');
          R.ProjectLeave.leaveAgree(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success("已同意");
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    batchRefuse() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要拒绝的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定拒绝？', '拒绝').then(() => {
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.leaveSerch.ids = ids.join(',');
          R.ProjectLeave.leaveRefuse(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success("已拒绝");
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    agree(data) {
        if (data.status == '2' || data.status == '1') {
        this.$Message('数据已审核过');
      } else {
        this.$Confirm('确定同意？', '同意').then(() => {
          this.leaveSerch.ids = data.id;
          R.ProjectLeave.leaveAgree(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success("已同意");
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    refuse(data) {
      if (data.status == '2' || data.status == '1') {
        this.$Message('数据已审核过');
      } else {
        this.$Confirm('确定拒绝？', '拒绝').then(() => {
          this.leaveSerch.ids = data.id;
          R.ProjectLeave.leaveRefuse(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success("已拒绝");
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    view(data) {
      this.$router.push({ name: 'approve_detail', params: { dataId: data.id } });
    },
    getData() {
      this.isLoading = true;
      this.getPage();
      R.ProjectLeave.leaveApproveList(leaveModel.dispose(this.leaveSerch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          this.isLoading = false;
        }
      });
    }
  }
};
</script>
