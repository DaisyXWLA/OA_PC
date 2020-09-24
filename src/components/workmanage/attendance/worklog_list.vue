<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            姓名：
            <input type="text" v-model="realName" />&nbsp;&nbsp;
            日志日期：
            <DatePicker v-model="value" :format="format"></DatePicker>&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add">新增</Button>
            <Button color="green" icon="h-icon-edit" @click="update">修改</Button>
            <Button color="red" icon="h-icon-close" @click="del">删除</Button>
            <div v-height="15"></div>
            <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="checkbox">
              <TableItem :width="80" title="序号" prop="$serial" v-if="serial" align="center"></TableItem>
              <TableItem prop="workLogTitle" title="日志标题"></TableItem>
              <TableItem :width="150" prop="workLog" title="日志类型">
                <template slot-scope="{data}">
                  <div v-if="data.workLogType==0">工作日志</div>
                  <div v-else>施工日志</div>
                </template>
              </TableItem>
              <TableItem prop="projectName" title="关联项目"></TableItem>
              <TableItem :width="200" prop="workLogDate" title="日志日期"></TableItem>
              <TableItem prop="creator" title="姓名" :width="100"></TableItem>
              <TableItem :width="100" prop="workLog" title="操作" align="center">
                <template slot-scope="{data}">
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
      </Cell>
    </Row>
    <Addlog ref="child" :addlog="addlog" :title="title"></Addlog>
    <UpdateLog ref="childT" :updateLog="updateLog" :title="title"></UpdateLog>
  </div>
</template>

<script>
import worklogList from 'model/worklog/worklogList';
import addlog from './components/worklog_add';
import updateLog from './components/worklog_modify';
export default {
  components: {
    Addlog: addlog,
    UpdateLog: updateLog
  },
  data() {
    return {
      worklogModel: worklogList.parse({}),
      addlog: false,
      updateLog: false,
      title: '',
      format: '',
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      checkbox: true,
      datas: [],
      realName: '',
      value: '',
      serial: true,
      isLoading: false,
      index: 0
    };
  },
  mounted() {
    this.init();
    this.timer();
  },
  methods: {
    init() {
      this.getData();
    },
    change(data) {},
    changePage() {
      this.getData(true);
      this.close();
    },
    search(data) {
      this.getData(true);
      this.close();
    },
    close() {
      this.addlog = false;
      this.updateLog = false;
    },
    timer() {
      setInterval(() => {
        if (this.$route.params.index > 0) {
          this.$route.params.index = 0;
          this.index = 1;
        }
        if (this.index > 0) {
          this.$router.go(0);
          this.index = 0;
        }
      }, 2000);
    },
    add() {
      this.close();
      this.$refs.child.getList();
      this.title = '新增工作日志';
      this.addlog = true;
    },
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要编辑的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('编辑仅支持单条数据');
        } else {
          this.close();
          this.title = '修改工作日志';
          this.$refs.childT.findOne(this.$refs.table.getSelection()[0].id);
          this.updateLog = true;
        }
      }
    },
    reset() {
      this.realName = '';
      this.value = '';
      this.close();
    },
    view(data) {
      this.$router.push({ name: 'worklog_detail', params: { Id: data.id } });
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
          this.worklogModel.ids = ids.join(',');
          R.Worklog.worklogDel(worklogList.dispose(this.worklogModel)).then(resp => {
            if (resp.ok) {
              this.$Message.success('刪除成功');
              setTimeout(() => {
                this.getData();
              }, 1000);
            }
          });
        });
      }
    },
    getData() {
      this.worklogModel.page = this.pagination.page;
      this.worklogModel.size = this.pagination.size;
      R.Worklog.worklogList(worklogList.dispose(this.worklogModel)).then(resp => {
        if (resp.ok) {
          // console.log(resp);
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
    }
  }
};
</script>
