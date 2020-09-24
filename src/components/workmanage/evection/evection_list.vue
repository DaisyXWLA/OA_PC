<style lang='less'>
.basic-form-vue {
  .h-panel-body {
    padding-right: 60px;
  }
  .divd {
    height: 70%;
  }
}
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Row :space="10">
              <Cell width="6">
                <span>出差时间段:</span>
                <DateRangePicker style="width:268px" v-model="param6"></DateRangePicker>
              </Cell>
              <Cell width="3">
                <div>
                  <Form :label-width="80" :mode="mode" ref="form"  >
                    <FormItem label="审批状态" prop="param3">
                      <Select v-model="select" :datas="param" :deletable="deletable"></Select>
                    </FormItem>
                  </Form>
                </div>
              </Cell>
              <Cell width="3">
                &nbsp;&nbsp;
                <Button color="green" :circle="true" @click="search">
                  <i class="icon-search"></i>搜索
                </Button>&nbsp;
                <Button color="yellow" :circle="true">
                  <i class="icon-repeat"></i>重置
                </Button>
              </Cell>
            </Row>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div>
              <button class="h-btn h-btn-blue" @click="add">
                <i class="icon-plus"></i>
                <span>新增出差</span>
              </button>
              <button class="h-btn h-btn-green" @click="update">
                <i class="h-icon-edit"></i>
                <span>修改出差</span>
              </button>
              <button class="h-btn h-btn-red" @click="del">
                <i class="icon-cross"></i>
                <span>批量删除</span>
              </button>
              <button class="h-btn h-btn-yellow" @click="delay">
                <i class="icon-clock"></i>
                <span>出差延期</span>
              </button>
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
                <TableItem :width="50" title="序号" prop="$serial" align="center" v-if="serial"></TableItem>
                <TableItem :width="500" prop="travelTitle" title="出差主题" align="left"></TableItem>
                <TableItem prop="travelAddrCity" title="出差地点" align="center"></TableItem>
                <TableItem prop="travelPeerPerson" title="出差同行人" align="center"></TableItem>
                <TableItem title="出差时间段" align="center">
                  <template slot-scope="{data}">{{data.planStartTime}}-{{data.planEndTime}}</template>
                </TableItem>
                <TableItem prop="planDays" title="出差天数" align="center"></TableItem>
                <TableItem prop="creator" title="申请人" align="center"></TableItem>
                <TableItem title="是否延期" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.isDelay==0">否</div>
                    <div v-else>是</div>
                  </template>
                </TableItem>
                <TableItem prop="task9" title="审批状态" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.task8=='未通过'">
                      <Button :circle="true" color="red">{{data.task8}}</Button>
                    </div>
                    <div v-else-if="data.task8=='已审批'">
                      <Button :circle="true" color="blue">{{data.task8}}</Button>
                    </div>
                    <div v-else-if="data.task8=='待审批'">
                      <Button :circle="true" color="green">{{data.task8}}</Button>
                    </div>
                    <div v-else></div>
                  </template>
                </TableItem>
                <TableItem prop="task12" title="操作" align="center">
                  <template slot-scope="{}">
                    <button
                      class="h-btn h-btn-s"
                      style="border-block-color:#8b04e4"
                      v-bg-color:#8b04e4
                      v-color:white
                      @click="view"
                    >
                      <i class="icon-paper"></i>&nbsp;详情
                    </button>
                  </template>
                </TableItem>
              </Table>
              <p></p>
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
    <evection-Add :isAddShow="isAddShow" :title="title"></evection-Add>
    <evection-Update :isUpdateShow="isUpdateShow" :title="title"></evection-Update>
    <evection-Delay :isDelayShow="isDelayShow" :title="title"></evection-Delay>
  </div>
</template>
<script>
import evectionAdd from './components/evection_add';
import evectionUpdate from './components/evection_modify';
import evectionDelay from './components/evection_delay';
import evectionList from 'model/evection/evection';
export default {
  components: {
    'evection-Add': evectionAdd,
    'evection-Update': evectionUpdate,
    'evection-Delay': evectionDelay
  },
  data() {
    return {
      evectionSearch: evectionList.parse({}),
      // param6: { start: '2019-09-21', end: '2019-10-21' },
      param6: {},
      god: false,
      deletable: false,
      select: '----请选择----',
      param: ['----请选择----', '待审批', '已审批', '未通过'],
      isAddShow: false,
      isUpdateShow: false,
      isDelayShow: false,
      title: '',
      mode: 'single',
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      type: 'China',
      checkbox: true,
      datas: [],
      realName: '',
      loginName: '',
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
    },
    search(data) {
      this.getData(true);
    },
    add() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isDelayShow = false;
      this.title = '出差申请';
      this.isAddShow = true;
    },
    update() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isDelayShow = false;
      this.title = '出差修改';
      this.isUpdateShow = true;
    },
    view() {
      this.$router.push({ name: 'evection_detail' });
    },
    delay() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isDelayShow = false;
      this.title = '延期';
      this.isDelayShow = true;
    },
    del() {},
    close() {
      this.isAddShow = false;
      this.isUpdateShow = false;
      this.isViewShow = false;
      this.isDelayShow = false;
    },
    getData() {
      this.evectionSearch.page = this.pagination.page;
      this.evectionSearch.size = this.pagination.size;
      R.Projecevection.evectionList(evectionList.dispose(this.evectionSearch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
        }
      });
    }
  }
};
</script>
