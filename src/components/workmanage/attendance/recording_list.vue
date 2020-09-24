<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            <span>
              部门：
              <input type="text" v-model="myAttSearch.department" />&nbsp;&nbsp;
            </span>
            <span>
              补录日期：
              <DatePicker v-model="myAttSearch.attrTime" :format="format"></DatePicker>&nbsp;&nbsp;
            </span>
            <span>
              审批状态：
              <Select
                v-model="myAttSearch.auditStatus"
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
              <Button color="blue" icon="h-icon-plus" @click="approve" v-has="'recordingapprove'">审批</Button>
              <Button color="red" icon="h-icon-completed" @click="batchAgree"  v-has="'recordingagree'">批量同意</Button>
              <Button color="yellow" @click="batchRefuse" v-has="'recordingrefuse'">
                <span>
                  <i class="icon-circle-cross" style="vertical-align: top"></i>&nbsp;批量拒绝
                </span>
              </Button>
            </div>
            <div style="margin-top: 10px">
              <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="checkbox">
                <TableItem :width="80" title="序号" prop="$serial" v-if="serial" align="center"></TableItem>
                <TableItem :width="100" prop="userName" title="姓名"></TableItem>
                <TableItem :width="100" prop="dept" title="部门">
                  <template slot-scope="{data}">
                    <div v-if="data.department==1">
                      <span>软件部</span>
                    </div>
                    <div v-else-if="data.attType==2">
                      <span>集成部</span>
                    </div>
                    <div v-else-if="data.attType==3">
                      <span>财务部</span>
                    </div>
                    <div v-else></div>
                  </template>
                </TableItem>
                <TableItem prop="attrTime" title="补录日期" :width="150"></TableItem>
                <TableItem prop="startAttrTime" title="上班打卡时间"></TableItem>
                <TableItem prop="endAttrTime" title="下班打卡时间"></TableItem>
                <TableItem :width="100" prop="auditUser" title="审核人"></TableItem>
                <TableItem :width="100" prop="status" title="审批状态" align="center">
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
                <TableItem prop="task12" title="操作" align="center">
                  <template slot-scope="{data}">
                    <button
                      class="h-btn h-btn-s h-btn-red"
                      @click="agree(data)"
                      v-bind:disabled="data.isAgree"
                       v-has="'recordingagree'"
                    >
                      <i class="h-icon-completed"></i>&nbsp;同意
                    </button>
                    <button
                      class="h-btn h-btn-s h-btn-yellow"
                      @click="refuse(data)"
                      v-bind:disabled="data.isRefuse"
                       v-has="'recordingrefuse'"
                    >
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
                       v-has="'recordingview'"
                    >
                      <span>
                        <i class="icon-paper" style="vertical-align: top"></i>&nbsp;详情
                      </span>
                    </button>
                  </template>
                </TableItem>
              </Table>
            </div>
            <p v-height="15"></p>
            <Pagination
              v-if="pagination.total>0"
              align="right"
              v-model="pagination"
              @change="changePage"
            />
          </div>
        </div>
      </Cell>
    </Row>
  </div>
</template>
<script>
import myAttModel from 'model/att/attModel';
export default {
  components: {},
  data() {
    return {
      myAttSearch: myAttModel.parse({}),
      deletable: false,
      param: [{ name: '待审核', code: 0 }, { name: '已审核', code: 1 }, { name: '未通过', code: 2 }],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      data: {
        isAgree: false,
        isRefuse: false,
      },
      select: [],
      format: '',
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
    changePage() {
      this.getData(true);
      this.myAttSearch.page = this.pagination.page;
      this.myAttSearch.size = this.pagination.size;
    },
    search(data) {
      this.getData(true);
      this.myAttSearch.page = this.pagination.page;
      this.myAttSearch.size = this.pagination.size;
    },
    reset() {
      this.myAttSearch.department = '';
      this.myAttSearch.attrTime = '';
      this.myAttSearch.auditStatus = '';
    },
    approve() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要审批的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('审批仅支持单条数据');
        } else {
          this.$router.push({ name: 'recording_detail', params: { dataId: this.$refs.table.getSelection()[0].id } });
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
          this.myAttSearch.ids = ids.join(',');
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
    batchRefuse() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要拒绝的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定拒绝？', '拒绝').then(() => {
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.myAttSearch.ids = ids.join(',');
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
    agree(data) {
      if (data.auditStatus == '2' || data.auditStatus == '1') {
        this.$Message('数据已审核过');
      } else {
        this.$Confirm('确定同意？', '同意').then(() => {
          this.myAttSearch.ids = data.id;
          R.ProjecetMyAtt.approvePass(myAttModel.dispose(this.myAttSearch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('已同意');
              setTimeout(() => {
                this.getData();
                this.data.isAgree = true;
                this.data.isRefuse = true;
              }, 1000);
            }
          });
        });
      }
    },
    refuse(data) {
      if (data.auditStatus == '2' || data.auditStatus == '1') {
        this.$Message('数据已审核过');
      } else {
        this.$Confirm('确定拒绝？', '拒绝').then(() => {
          this.myAttSearch.ids = data.id;
          R.ProjecetMyAtt.approveRefuse(myAttModel.dispose(this.myAttSearch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('已拒绝');
              setTimeout(() => {
                this.getData();
                this.data.isAgree = true;
                this.data.isRefuse = true;
              }, 1000);
            }
          });
        });
      }
    },
    view(data) {
      this.$router.push({ name: 'recording_detail', params: { dataId: data.id } });
    },
    getData() {
      this.$forceUpdate();
      this.isLoading = true;
      this.myAttSearch.page = this.pagination.page;
      this.myAttSearch.size = this.pagination.size;
      R.ProjecetMyAtt.approveList(myAttModel.dispose(this.myAttSearch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          // this.myAttSearch.auditStatus = resp.body.auditStatus;
          // if (this.myAttSearch.auditStatus == '2' || this.myAttSearch.auditStatus == '1') {
          //   this.data.isAgree = true;
          //   this.data.isRefuse = true;
          // }
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          this.isLoading = false;
        }
      });
    }
  }
};
</script>
