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
              <input type="text" v-model="department" />&nbsp;&nbsp;
            </span>
            <span>
              加班日期：
              <DateRangePicker v-model="value" :format="format"></DateRangePicker>&nbsp;&nbsp;
            </span>
            <span>
              审批状态：
              <Select v-model="select" :datas="param" style="width: 12%;" :autosize="true"></Select>&nbsp;&nbsp;
            </span>
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>

      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="view(datas, data)">审批</Button>
            <Button color="red" icon="h-icon-completed" @click="update">批量同意</Button>
            <Button color="yellow" @click="confirm">
              <span>
                <i class="icon-circle-cross" style="vertical-align: top"></i>&nbsp;批量拒绝
              </span>
            </Button>

            <div v-height="15"></div>
            <Table ref="table" :datas="datas" :stripe="stripe" :loading="isLoading" checkbox>
              <TableItem title="序号" prop="$serial" :width="80"></TableItem>
              <TableItem title="加班主题" prop="theme"></TableItem>
              <TableItem title="加班时间段" prop="time"></TableItem>
              <TableItem title="加班天数" prop="daynumber" :width="100"></TableItem>
              <TableItem title="关联项目" prop="relatedprojects"></TableItem>
              <TableItem title="部门" prop="department" :width="100"></TableItem>
              <TableItem title="申请人" prop="name" :width="100"></TableItem>
              <TableItem title="审批人" prop="approvename" :width="100"></TableItem>
              <TableItem title="审批状态" align="center" :width="100">
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
              <TableItem title="操作" prop="operation" align="center" :width="300">
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
    <Agreeovertime :agreeovertime="agreeovertime" :title="title"></Agreeovertime>
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
      agreeovertime: false,
      refuseovertime: false,
      value: null,
      select: [],
      format: '',
      viewShow: false,
      approvestate: '',
      department: null,
      date: null,
      title: '',
      datas: [],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      param: [{ title: '已审批', key: 'a1', other: '其他值' }, { title: '待审批', key: 'a2' }, { title: '未通过', key: 'a3' }],
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
      this.agreeovertime = false;
      this.refuseovertime = false;
    },
    changePage() {
      this.getData(true);
      this.agreeovertime = false;
      this.refuseovertime = false;
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
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '已审批'
          },
          {
            id: 2,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '待审批'
          },
          {
            id: 3,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '未通过'
          },
          {
            id: 4,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '已审批'
          },
          {
            id: 5,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '待审批'
          },
          {
            id: 6,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '未通过'
          },
          {
            id: 7,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '已审批'
          },
          {
            id: 8,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
            approvestate: '待审批'
          },
          {
            id: 9,
            theme: '大鹏老师2019-10-1的加班申请',
            time: '2019-10-1——2019-10-7',
            daynumber: '7天',
            relatedprojects: '公司官网开发',
            department: '软件部',
            name: '大鹏老师',
            approvename: '海友科伟',
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
    close() {},

    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    agree() {
      this.agreeovertime = false;
      this.agreeovertime = true;
      this.refuseovertime = false;
      this.title = '加班审批';
    },
    refuse() {
      this.refuseovertime = false;
      this.refuseovertime = true;
      this.agreeovertime = false;
    },

    view(datas, data) {
      // console.log(datas.indexOf(data));
      this.$router.push({ name: 'approve_detail' });
    }
  }
};
</script>

