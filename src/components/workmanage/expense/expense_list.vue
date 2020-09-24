<style lang='less'>
</style>

<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <Row>
            <div class="h-panel-body">
            
              <Cell :width="5">
              费用发生日期：
                <DateRangePicker v-model="value" :format="format"></DateRangePicker>&nbsp;&nbsp;
              </Cell>
              <Cell :width="5">
                <Form :model="data" ref="form"  >
                  <FormItem label="审批状态：" prop="state">
                    <Select v-model="select" class="select-demo" :datas="param"></Select>
                  </FormItem>
                </Form>
              </Cell>
              <Cell :width="14">
                &nbsp;&nbsp;
                <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
              </Cell>
            </div>
          </Row>
        </div>
      </Cell>

      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add">申请报销</Button>
            <Button color="green" icon="h-icon-edit" @click="update">修改报销</Button>
            <Button color="red" icon="h-icon-close" @click="confirm">批量删除</Button>
            <div style="float: right">
              <span>上帝模式：</span>
              <h-switch v-model="check">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </h-switch>
            </div>

            <div v-height="15"></div>
            <Table ref="table" :datas="datas" :stripe="stripe" :loading="isLoading" checkbox>
              <TableItem title="序号" prop="$serial" :width="80"></TableItem>
              <TableItem title="招待费报销主题" prop="theme" align="center"></TableItem>
              <TableItem title="费用发生日期" prop="time" :width="200"></TableItem>
              <TableItem title="报销金额" prop="moneysum" :width="80"></TableItem>
              <TableItem title="备注" prop="remarks" align="center"></TableItem>
              <TableItem title="申请人" prop="name" :width="100"></TableItem>
              <TableItem title="审批状态" align="center" :width="100">
                <template slot-scope="{data}">
                  <div v-if="data.approvestate=='已审批'">
                    <button class="h-btn-s h-btn h-btn-blue h-btn-circle">{{data.approvestate}}</button>
                  </div>
                  <div v-else-if="data.approvestate=='待审批'">
                    <button class="h-btn-s h-btn h-btn-green h-btn-circle">{{data.approvestate}}</button>
                  </div>
                  <div v-else-if="data.approvestate=='未通过'">
                    <button class="h-btn-s h-btn h-btn-red h-btn-circle">{{data.approvestate}}</button>
                  </div>
                  <div v-else></div>
                </template>
              </TableItem>
              <TableItem title="操作" prop="operation" align="center" :width="100">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s"
                    v-bg-color:#8b04e4
                    v-color:white
                    @click="view(datas, data)"
                  >
                    <i class="icon-paper">&nbsp;&nbsp;详情</i>
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
    <Addreimbursement :addapply="addapply" :title="title"></Addreimbursement>
  </div>
</template>

<script>
// import { write } from 'fs';
import add from './components/expense_add';
export default {
  components: {
     Addreimbursement: add
  },
  data() {
    return {
      value: null,
      check: false,
      select: [],
      format: '',
      param: [{ title: '已审批', key: 'a1', other: '其他值' }, { title: '待审批', key: 'a2' }, { title: '未通过', key: 'a3' }],
      addapply: false,
      department: '',
      time: '',
      state: '',
      datas: [],
      title: '',
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      stripe: false,
      data: {},
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
    search(data) {
      this.getData(true);
      this.addapply = false;
    },
    changePage() {
      this.getData(true);
      this.addapply = false;
    },
    getData(reload = false) {
      if (reload) {
      }
      this.isLoading = true;
      setTimeout(() => {
        this.datas = [
          {
            id: 1,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '已审批'
          },
          {
            id: 2,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '待审批'
          },
          {
            id: 3,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '未通过'
          },
          {
            id: 4,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '已审批'
          },
          {
            id: 5,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '待审批'
          },
          {
            id: 6,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '未通过'
          },
          {
            id: 7,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '已审批'
          },
          {
            id: 8,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '待审批'
          },
          {
            id: 9,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            moneysum: '250.00',
            remarks: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '未通过'
          }
        ];
        this.isLoading = false;
      }, 500);
    },
    confirm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        if (this.$refs.table.getSelection().length >= 1) {
          this.$Confirm('确定删除？')
            .then(() => {
              this.$Message.success('删除成功！');
              this.getData(true);
              this.addapply = false;
            })
            .catch(() => {
              this.$Message.error('取消删除');
            });
        }
      }
    },
    reset() {
      this.addapply = false;
      this.value = '';
      this.select = '';
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    remove(index) {
      this.data.inputsData.splice(index, 1);
    },

    add() {
      this.addapply = false;
      this.addapply = true;
      this.title = '招待费报销申请';
    },

    update() {
      this.addapply = false;
      this.addapply = true;
      this.title = '招待费报销修改';
    },
    view() {
      this.$router.push({ name: 'expense_detail' });
    }
  }
};
</script>

