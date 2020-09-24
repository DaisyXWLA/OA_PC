<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
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
              <Button color="blue" icon="h-icon-plus" @click="add">新增请假</Button>
              <Button color="green" icon="h-icon-edit" @click="update">修改请假</Button>
              <Button color="red" icon="h-icon-close" @click="del">批量删除</Button>
              <div style="float: right">
                上帝模式:
                <h-switch v-model="god">
                  <span slot="open">开启</span>
                  <span slot="close">关闭</span>
                </h-switch>
              </div>
            </div>
            <div style="margin-top: 10px">
              <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="checkbox">
                <TableItem :width="80" title="序号" prop="$serial"  v-if="serial" align="center"></TableItem>
                <TableItem  prop="leaveTitle" title="请假主题" ></TableItem>
                <TableItem prop="leaveType" title="请假类型" :width="150"></TableItem>
                <TableItem prop="task3" title="请假时间段">
                  <template slot-scope="{data}">
                    <span>{{data.leaveStartTime}}—{{data.leaveEndTime}}</span>
                  </template>
                </TableItem>
                <TableItem :width="150" prop="leaveDays" title="请假天数"></TableItem>
                <TableItem :width="100" prop="creator" title="申请人"></TableItem>

                <TableItem title="审批状态" align="center" :width="150">
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
                <TableItem prop="task12" title="操作" align="center" :width="150">
                  <template slot-scope="{data}">
                    <button
                      class="h-btn h-btn-s"
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
    <LeaveAdd :leaveAdd="leaveAdd"></LeaveAdd>
    <LeaveUpdate :leaveUpdate="leaveUpdate" ref="child"></LeaveUpdate>
  </div>
</template>
<script>
import leaveadd from './components/leave_add';
import leaveupdate from './components/leave_modify';
import leaveModel from 'model/leave/leaveModel';
export default {
  components: {
    LeaveAdd: leaveadd,
    LeaveUpdate: leaveupdate
  },
  data() {
    return {
      leaveSerch: leaveModel.parse({}),
      format: '',
      leaveAdd: false,
      leaveUpdate: false,
      god: false,
      deletable: false,
      param: [{ name: '待审核', code: 0 }, { name: '已审核', code: 1 }, { name: '未通过', code: 2 }],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      checkbox: true,
      datas: [],
      serial: true,
      isLoading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
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
      this.close();
      this.getData();
    },
    change(data) {},
    changePage() {
      this.getData(true);
      this.getPage();
      this.close();
    },
    add() {
      this.close();
      this.leaveAdd = true;
    },
    close() {
      this.leaveAdd = false;
      this.leaveUpdate = false;
    },
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要修改的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('修改仅支持单条数据');
        } else {
          this.$refs.child.getData(this.$refs.table.getSelection()[0].id);
          this.close();
          this.leaveUpdate = true;
        }
      }
    },
    view(data) {
      this.$router.push({ name: 'leave_detail', params: { dataId: data.id } });
    },

    del() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定删除？', '删除').then(() => {
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.leaveSerch.ids = ids.join(',');
          R.ProjectLeave.leaveDel(leaveModel.dispose(this.leaveSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('刪除成功');
              setTimeout(() => {
                this.getData();
              }, 1000);
              this.close();
            }
          });
        });
      }
    },
    getData() {
      this.isLoading = true;
      this.getPage();
      R.ProjectLeave.leaveList(leaveModel.dispose(this.leaveSerch)).then(resp => {
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

