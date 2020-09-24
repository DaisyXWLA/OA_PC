<style lang='less'>
.app-home-vue {
  .h-table-header table {
    background-color: #ffffff;
  }
  .home-part-body {
    height: 350px;
    .echarts-vue {
      height: 350px;
    }
  }
  .home-part-body2 {
    height: 420px;
    .echarts-vue {
      height: 420px;
    }
  }
  .progress-div {
    > p {
      padding: 8px 0;
    }
    .h-progress {
      &-title {
        color: @dark2-color;
        font-size: 15px;
      }
      &-text {
        width: 40px;
      }
    }
  }
  .hed {
    margin-left: 80px;
  }
}
</style>
  <template>
  <div v-bg-color:gray2 v-padding="20">
    <div class="app-home-vue frame-page">
      <Row>
        <Cell>
          <div class="h-panel">
            <div class="home-part-body" style="height: 860px">
              <div class="h-panel-body">
                <Row :space="30">
                  <Cell>
                    <h3>基本信息</h3>
                    <div class="hed">
                      <Form class="info-basic" :label-width="90" mode="twocolumn" readonly>
                        <FormItem label="用车主题:">{{data.da1}}</FormItem>
                        <FormItem label="乘车同行人:">{{data.da6}}</FormItem>
                        <FormItem label="用车时间段:">{{data.da2}}</FormItem>
                        <FormItem label="部门:">{{data.da7}}</FormItem>
                        <FormItem label="用车天数:">{{data.da3}}</FormItem>
                        <FormItem label="申请人:">{{data.da8}}</FormItem>
                        <FormItem label="车牌号:">{{data.da4}}</FormItem>
                        <FormItem label="申请日期:">{{data.da9}}</FormItem>
                        <FormItem label="备注:">{{data.da5}}</FormItem>
                      </Form>
                    </div>
                  </Cell>
                  <Cell>
                    <h3>审批信息</h3>
                    <div class="hed">
                      <Table ref="table" :datas="datas1" :border="border">
                        <TableItem :width="200" prop="name" title="审批人" align="center"></TableItem>
                        <TableItem :width="260" prop="time" title="审批日期" align="center"></TableItem>
                        <TableItem :width="170" title="审批状态" align="center">
                          <template slot-scope="{data}">
                            <div v-if="data.task1=='未通过'">
                              <Button :circle="true" color="red">{{data.task1}}</Button>
                            </div>
                            <div v-else-if="data.task1=='已审批'">
                              <Button :circle="true" color="blue">{{data.task1}}</Button>
                            </div>
                            <div v-else-if="data.task1=='待审批'">
                              <Button :circle="true" color="green">{{data.task1}}</Button>
                            </div>
                            <div v-else></div>
                          </template>
                        </TableItem>
                        <TableItem prop="type" title="拒绝理由" align="center"></TableItem>
                      </Table>
                    </div>
                  </Cell>
                  <Cell>
                    <div style="text-align: center">
                      <button class="h-btn h-btn-red" @click="agree">
                        <i class="icon-circle-check"></i>
                        <span>同意</span>
                      </button>
                      <button class="h-btn h-btn-yellow">
                        <i class="icon-circle-cross"></i>
                        <span>拒绝</span>
                      </button>
                      <button class="h-btn h-btn-green">
                        <i class="icon-cross"></i>
                        <span>关闭</span>
                      </button>
                    </div>
                  </Cell>
                </Row>
              </div>
            </div>
          </div>
        </Cell>
      </Row>
 
    </div>
     <Agreeovertime :agreeovertime="agreeovertime" :title="title"></Agreeovertime>
    <Refuseovertime :refuseovertime="refuseovertime" :title="title"></Refuseovertime>
  </div>
</template>
<script>
import agree from './approve_agree';
import refuse from './approve_refuse';
export default {
  data() {
    return {
        agreeovertime: false,
      refuseovertime: false,
      border: true,
      datas1: [
        { name: '张一', time: '2019-06-09', task1: '已审批', type: '浪子回头浪子回头浪子回头' },
        { name: '张二', time: '2019-06-10', task1: '未通过', type: '浪子回头浪子回头浪子回头' },
        { name: '张三', time: '2019-06-11', task1: '已审批', type: '浪子回头浪子回头浪子回头' },
        { name: '张四', time: '2019-06-12', task1: '待审批', type: '浪子回头浪子回头浪子回头' }
      ],
      data: {
        da1: '结婚',
        da2: '事假',
        da3: '2019',
        da4: '2',
        da5: '浪子回头',
        da6: '软件部',
        da7: '哩啦啦',
        da8: '2019',
        da9: '2019-09-08'
      }
    };
  },
  mounted() {},
  methods: {
      agree() {
      this.agreeovertime = false;
      this.agreeovertime = true;
      this.refuseovertime = false;
    },
  }
};
</script>