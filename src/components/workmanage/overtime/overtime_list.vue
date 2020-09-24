<style lang='less'>
</style>

<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            <span>
              部门：
              <input type="text" v-model="overtimeSerch.departmentName" />&nbsp;&nbsp;
            </span>
            <span>
            加班时间段：
            <DateRangePicker v-model="overtimeSerch.value" :format="format"></DateRangePicker>&nbsp;&nbsp;
            </span>
            <span>
            审批状态：
              <Select
                v-model="overtimeSerch.status"
                :datas="param"
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
            <Button color="blue" icon="h-icon-plus" @click="add">新增加班</Button>
            <Button color="green" icon="h-icon-edit" @click="update">修改加班</Button>
            <Button color="red" icon="h-icon-close" @click="del">批量删除</Button>
            <div style="float: right">
              <span>上帝模式：</span>
              <h-switch v-model="check">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </h-switch>
            </div>
            <div v-height="15"></div>
            <Table ref="table" :datas="datas" :stripe="stripe" :loading="isLoading" checkbox>
              <TableItem title="序号" prop="$serial" :width="80" align="center"></TableItem>
              <TableItem title="加班主题" prop="title"></TableItem>
              <TableItem prop="task3" title="加班时间段">
                  <template slot-scope="{data}">
                    <span>{{data.overtimeStartTime}}—{{data.overtimeEndTime}}</span>
                  </template>
                </TableItem>
              <TableItem title="加班天数" prop="overtimeDays" :width="150"></TableItem>
              <TableItem title="关联项目" prop="projectInfo"></TableItem>
              <TableItem title="部门" prop="departmentName" :width="150"></TableItem>
              <TableItem title="申请人" prop="creator" :width="150"></TableItem>
              <TableItem title="审批状态" align="center" :width="100">
                <template slot-scope="{data}">
                    <div v-if="data.status=='2'">
                      <span class="h-tag h-tag-bg-red">{{overtimeSerch.status}}</span>
                    </div>
                    <div v-else-if="data.status=='1'">
                      <span class="h-tag h-tag-bg-green">{{overtimeSerch.status}}</span>
                    </div>
                    <div v-else-if="data.status=='0'">
                      <span class="h-tag h-tag-bg-blue">{{overtimeSerch.status}}</span>
                    </div>
                    <div v-else></div>
                  </template>
              </TableItem>
              <TableItem title="操作" prop="operation" align="center" :width="150">
                <template slot-scope="{data}">
                  <button
                      class="h-btn h-btn-s"
                      v-bg-color:#8b04e4
                      v-color:white
                      @click="view(data)"
                      style="border-block-color:#8b04e4"
                    >
                      <span>
                        <i class="icon-paper" style="vertical-align: top"></i>&nbsp;详情
                      </span>
                    </button>
                </template>
              </TableItem>
              <div slot="empty">暂时无数据</div>
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
      </Cell>
    </Row>
    <AddOvertime :addOvertime="addOvertime"></AddOvertime>
    <UpdateOvertime :updateOvertime="updateOvertime" ref="child"></UpdateOvertime>
  </div>
</template>

<script>
import add from './components/overtime_add';
import update from './components/overtime_modify';
import overtimeModel from 'model/overtime/overtimeModel';
export default {
  components: {
    AddOvertime: add,
    UpdateOvertime: update
  },
  data() {
    return {
      overtimeSerch: overtimeModel.parse({}),
      check: false,
      format: '',
      param: [{ name: '待审核', code: 0 }, { name: '已审核', code: 1 }, { name: '未通过', code: 2 }],
      addOvertime: false,
      updateOvertime: false,
      datas: [],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      stripe: false,
      isLoading: false
    };
  },
  mounted() {
    R.ProjectOverTime.projectNameList(overtimeModel.dispose(this.overtimeSerch)).then(resp => {
      if (resp.ok) {
        this.param = resp.body;
      }
    });
    this.init();
  },
  methods: {
     init() {
      this.getData();
    },
    add() {
      this.close();
      this.addOvertime = true;
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
          this.updateOvertime = true;
        }
      }
    },
    view() {
      this.$router.push({ name: 'overtime_detail' });
    },
    getData() {
      this.isLoading = true;
      this.getPage();
      R.ProjectOverTime.overtimeList(overtimeModel.dispose(this.overtimeSerch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          this.isLoading = false;
        }
      });
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
          this.overtimeSerch.ids = ids.join(',');
          R.ProjectOverTime.overtimeDel(overtimeModel.dispose(this.overtimeSerch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('刪除成功');
              setTimeout(() => {
                this.getData();
              }, 1000);
              this.close();
            }
          });
        }).catch(()=>{
          this.$Message.error('取消')
        });
      }
    },
    getPage() {
      this.overtimeSerch.page = this.pagination.page;
      this.overtimeSerch.size = this.pagination.size;
    },
    search() {
      if (this.overtimeSerch.value != null) {
        this.overtimeSerch.leaveStartTime = this.overtimeSerch.value.start;
        this.overtimeSerch.leaveEndTime = this.overtimeSerch.value.end;
      }
      this.getData();
      this.getPage();
    },
    reset() {
      this.overtimeSerch.departmentName = '';
      this.overtimeSerch.value = null;
      this.overtimeSerch.status = '';
      this.close();
    },
    changePage() {
      this.getData(true);
      this.getPage();
      this.close();
    },
    close() {
      this.addOvertime = false;
      this.updateOvertime = false;
    },
  }
};
</script>

