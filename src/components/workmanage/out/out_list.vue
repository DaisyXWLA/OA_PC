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
    <Row :space="12">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Row :space="2">
              <Cell width="5">
                外出时间段:
                <DateRangePicker v-model="param6"></DateRangePicker>
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
              <Cell width="4">
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
                <span>申请外出</span>
              </button>
              <button class="h-btn h-btn-green" @click="update">
                <i class="h-icon-edit"></i>
                <span>修改申请</span>
              </button>
              <button class="h-btn h-btn-red" @click="confirm">
                <i class="icon-circle-cross"></i>
                <span>批量删除</span>
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
                <TableItem :width="300" prop="task1" title="外出主题" align="left"></TableItem>
                <TableItem prop="task2" title="外出地点" align="center"></TableItem>
                <TableItem prop="task3" title="外出同行人" align="center"></TableItem>
                <TableItem prop="task4" title="外出时间段" align="center"></TableItem>
                <TableItem prop="task5" title="外出天数" align="center"></TableItem>
                <TableItem prop="task6" title="申请人" align="center"></TableItem>
                <TableItem title="审批状态" align="center">
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
                <TableItem :width="300" prop="task12" title="操作" align="center">
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
            </div>
          </div>
        </div>
      </Cell>
    </Row>
    <go :a="a" :title="title"></go>
  </div>
</template>

<script>
import go from './components/out_add';
export default {
  components: {
    go: go
  },
  data() {
    return {
      a: false,
      god: false,
      deletable: false,
      select: '----请选择----',
      param: ['----请选择----', '待审批', '已审批', '未通过'],
      param6: {},
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
    search(data) {
      this.getData(true);
    },
    add() {
      this.a = false;
      this.title = '外出申请';
      this.a = true;
    },
    update() {
      this.a = false;
      this.title = '外出修改';
      this.a = true;
    },
    view() {
      this.$router.push({ name: 'out_detail' });
    },
    confirm() {
      // heyui.$Confirm js调用也可以
      // title为空的时候无头部

      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Confirm('确定删除？')
            .then(() => {
              this.$Message.success('确定删除！');
            })
            .catch(() => {
              this.$Message.error('取消');
            });
        }
      }
    },
    getData(reload = false) {
      if (reload) {
      }
      this.isLoading = true;
      setTimeout(() => {
        this.datas = [
          {
            id: 5,
            task1: '海友科伟',
            task2: '事假',
            task3: '李拉拉',
            task4: '9',
            task5: '李拉拉',
            task6: '李拉拉',
            task8: '待审批'
          },
          {
            id: 5,
            task1: '海友科伟',
            task2: '事假',
            task3: '李拉拉',
            task4: '9',
            task5: '李拉拉',
            task6: '李拉拉',
            task8: '已审批'
          },
          {
            id: 5,
            task1: '海友科伟',
            task2: '事假',
            task3: '李拉拉',
            task4: '9',
            task5: '李拉拉',
            task6: '李拉拉',
            task8: '待审批'
          },
          {
            id: 5,
            task1: '海友科伟',
            task2: '事假',
            task3: '李拉拉',
            task4: '9',
            task5: '李拉拉',
            task6: '李拉拉',
            task8: '已审批'
          },
          {
            id: 5,
            task1: '海友科伟',
            task2: '事假',
            task3: '李拉拉',
            task4: '9',
            task5: '李拉拉',
            task6: '李拉拉',
            task8: '未通过'
          }
        ];
        this.isLoading = false;
      }, 1000);
    }
  }
};
</script>
