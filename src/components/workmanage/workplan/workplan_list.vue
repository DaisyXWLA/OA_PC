<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            用户名：
            <input type="text" v-model="workplanSerch.creator" />&nbsp;&nbsp;
            计划日期：
            <DateRangePicker
              v-model="workplanSerch.value"
              :format="format"
              :option="param"
              placeholder="开始 - 结束"
            ></DateRangePicker>&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div>
              <Button color="blue" icon="h-icon-plus" @click="add">新增计划</Button>
              <Button color="green" icon="h-icon-edit" @click="update">修改计划</Button>
              <Button color="red" icon="h-icon-close" @click="del">批量删除</Button>
            </div>
            <div style="margin-top: 10px">
              <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="true">
                <TableItem :width="80" title="序号" prop="$serial" v-if="serial" align="center"></TableItem>
                <TableItem prop="planTitle" title="计划标题"></TableItem>
                <TableItem :width="150" prop="planType" title="计划类型"></TableItem>
                <TableItem :width="200" title="计划日期">
                  <template slot-scope="{data}">
                    <span>{{data.planStartDate}}—{{data.planEndDate}}</span>
                  </template>
                </TableItem>
                <TableItem :width="150" prop="days" title="计划天数"></TableItem>
                <TableItem :width="100" prop="creator" title="姓名"></TableItem>
                <TableItem :width="100" prop="task12" title="操作" align="center">
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
    <WorkplanAdd :AddPlan="AddPlan"></WorkplanAdd>
    <WorkplanUpdate ref="child" :UpdatePlan="UpdatePlan"></WorkplanUpdate>
  </div>
</template>

<script>
import workplan from './components/workplan_add';
import workplanUpdate from './components/workplan_modify';
import workplanModel from 'model/workplan/workplanModel';
export default {
  components: {
    WorkplanAdd: workplan,
    WorkplanUpdate: workplanUpdate
  },
  data() {
    return {
      workplanSerch: workplanModel.parse({}),
      AddPlan: false,
      UpdatePlan: false,
      format: '',
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      param: {
        planStartDate: '',
        planEndDate: ''
      },
      datas: [],
      serial: true,
      isLoading: false,
      index: 0
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
      this.workplanSerch.page = this.pagination.page;
      this.workplanSerch.size = this.pagination.size;
    },
    search() {
      if (this.workplanSerch.value != null) {
        this.workplanSerch.planStartDate = this.workplanSerch.value.start;
        this.workplanSerch.planEndDate = this.workplanSerch.value.end;
      }
      this.getData();
      this.getPage();
    },
    reset() {
      this.workplanSerch.creator = '';
      this.workplanSerch.value = '';
      this.close();
    },
    changePage() {
      this.getData(true);
      this.getPage();
      this.close();
    },
    add() {
      this.close();
      this.AddPlan = true;
    },
    close() {
      this.AddPlan = false;
      this.UpdatePlan = false;
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
          this.UpdatePlan = true;
        }
      }
    },
    view(data) {
      this.$router.push({ name: 'workplan-View', params: { dataId: data.id } });
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
          this.workplanSerch.ids = ids.join(',');
          R.ProjectPlan.planDel(workplanModel.dispose(this.workplanSerch)).then(resp => {
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
      R.ProjectPlan.planList(workplanModel.dispose(this.workplanSerch)).then(resp => {
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
