<style lang='less'>
</style>

<template>
  <div class="table-basic-vue frame-page">
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <Row>
            <div class="h-panel-body">
              <Cell :width="4">
                部门：
                <input type="text" v-model="department" />
              </Cell>
              <Cell :width="5">
                出差天数：
                <DateRangePicker v-model="value" :format="format"></DateRangePicker>
              </Cell>
              <Cell :width="5">
                <Form :model="data" ref="form"  >
                  <FormItem label="审批状态：" prop="mobile">
                    <Select v-model="select" class="select-demo" :datas="param"></Select>
                  </FormItem>
                </Form>
              </Cell>
              <Cell :width="6">
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
            <Button color="blue" icon="h-icon-plus" @click="view(datas, data)">审批</Button>
            <Button color="red" icon="h-icon-completed" @click="update">批量同意</Button>
            <Button color="yellow" icon="icon-circle-cross" @click="confirm">批量拒绝</Button>
            <div v-height="15"></div>
            <Table ref="table" :datas="datas" :stripe="stripe" :loading="isLoading" checkbox>
              <TableItem title="序号" prop="$serial" :width="80"></TableItem>
              <TableItem title="出差费报销主题" prop="theme" ></TableItem>
              <TableItem title="总报销费用" prop="allmoney" :width="150"></TableItem>
              <TableItem title="关联出差" prop="relevancetravel"></TableItem>
              <TableItem title="出差天数" prop="daynumber" :width="100"></TableItem>
              <TableItem title="部门" prop="department" :width="100"></TableItem>
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
              <TableItem title="操作" prop="operation" align="center">
                <template slot-scope="{data}">
                 <button class="h-btn h-btn-s h-btn-red" v-color:white @click="agree">
                    <i class="h-icon-completed">&nbsp;同意</i>
                  </button>
                  <button class="h-btn h-btn-s h-btn-yellow" @click="refuse">
                    <i class="icon-circle-cross">&nbsp;&nbsp;拒绝</i>
                  </button>
                  <button
                    class="h-btn h-btn-s"
                    v-bg-color:#8b04e4
                    v-color:white
                    @click="view(datas, data)"
                  >
                    <i class="icon-paper">&nbsp;详情</i>
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
    <Agreeovertime :agreeovertime="agreeovertime"></Agreeovertime>
    <Refuseovertime :refuseovertime="refuseovertime"></Refuseovertime>
  </div>
</template>

<script>
import { write } from 'fs';
import agree from './components/approve_agree';
import refuse from './components/approve_refuse';

export default {
  components: {
    Agreeovertime: agree,
    Refuseovertime: refuse
  },
  data() {
    return {
      agreeovertime:false,
      refuseovertime:false,
      value: null,
      check: false,
      select: [],
      format: '',
      param: [{ title: '已审批', key: 'a1', other: '其他值' }, { title: '待审批', key: 'a2' }, { title: '未通过', key: 'a3' }],
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
      this.refuseovertime = false;
      this.agreeovertime = false;
    },
    changePage() {
      this.getData(true);
      this.refuseovertime = false;
      this.agreeovertime = false;
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
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '已审批'
          },
          {
            id: 2,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '待审批'
          },
          {
            id: 3,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '未通过'
          },
          {
            id: 4,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '已审批'
          },
          {
            id: 5,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '待审批'
          },
          {
            id: 6,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '未通过'
          },
          {
            id: 7,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '已审批'
          },
          {
            id: 8,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '待审批'
          },
          {
            id: 9,
            theme: '大鹏老师2019-10-1的加班申请',
            allmoney: '250.00',
            daynumber: '7天',
            relevancetravel: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvestate: '未通过'
          }
        ];
        this.isLoading = false;
      }, 500);
    },
        update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要批量同意的数据');
      } else {
        if (this.$refs.table.getSelection().length >= 1) {
          this.$Confirm('确定同意？')
            .then(() => {
              this.$Message.success('已同意！');
            })
            .catch(() => {
              // this.$Message.error('已取消');
            });
        }
      }
    },
     confirm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要批量拒绝的数据');
      } else {
        if (this.$refs.table.getSelection().length >= 1) {
          this.$Confirm('确定拒绝？')
            .then(() => {
              this.$Message.success('已拒绝！');
            })
            .catch(() => {
              // this.$Message.error('已取消');
            });
        }
      }
    },
    reset() {
      this.department = '';
      this.value = '';
      this.select = '';
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
   agree() {
      this.agreeovertime = false;
      this.agreeovertime = true;
      this.refuseovertime = false;
    },
    refuse() {
      this.refuseovertime = false;
      this.refuseovertime = true;
      this.agreeovertime = false;
    },
    view() {
      this.$router.push({ name: 'approve_detail' });
    }
  }
};
</script>

