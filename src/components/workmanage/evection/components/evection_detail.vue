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
                <Row :space="15">
                  <Cell>
                    <h3>基本信息</h3>
                    <div class="hed">
                      <Form class="info-basic" :label-width="90" mode="twocolumn" readonly>
                        <FormItem label="出差主题:">{{data.da11}}</FormItem>
                        <FormItem label="出差天数:">{{data.da12}}</FormItem>
                        <FormItem label="出差地点:">{{data.da13}}</FormItem>
                        <FormItem label="部门:">{{data.da14}}</FormItem>
                        <FormItem label="出差同行人:">{{data.da15}}</FormItem>
                        <FormItem label="申请人:">{{data.da16}}</FormItem>
                        <FormItem label="出差时间段:">{{data.da17}}</FormItem>
                        <FormItem label="申请日期:">{{data.da18}}</FormItem>
                        <FormItem label="出差事由:">{{data.da19}}</FormItem>
                      </Form>
                    </div>
                  </Cell>
                  <Cell>
                    <h3>延期信息</h3>
                    <div class="hed">
                      <Table ref="table" :datas="datas" :border="border">
                        <TableItem :width="80" prop="name" title="姓名" align="center"></TableItem>
                        <TableItem :width="120" prop="time" title="延期时间到" align="center"></TableItem>
                        <TableItem prop="type" title="延期事由" align="left"></TableItem>
                      </Table>
                    </div>
                  </Cell>
                  <Cell>
                    <h3>审批信息</h3>
                    <div class="hed">
                      <Table ref="table" :datas="datas1" :border="border">
                        <TableItem :width="80" prop="name" title="审批人" align="center"></TableItem>
                        <TableItem :width="120" prop="time" title="审批日期" align="center"></TableItem>
                        <TableItem :width="120" title="审批状态" align="center">
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
                        <TableItem prop="type" title="拒绝理由" align="left"></TableItem>
                      </Table>
                    </div>
                  </Cell>
                  <Cell>
                    <div style="text-align: center;margin-top:30px;">
                      <button class="h-btn h-btn-red">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      border: true,
      datas: [
        { name: '张一', time: '2019-06-09', type: '临时任务需要延期12312412421421' },
        { name: '张二', time: '2019-06-10', type: '临时任务需要延期12312412421422' },
        { name: '张三', time: '2019-06-11', type: '临时任务需要延期12312412421423' },
        { name: '张四', time: '2019-06-12', type: '临时任务需要延期12312412421424' }
      ],
      datas1: [
        { name: '张一', time: '2019-06-09', task1: '已审批', type: '临时任务需要延期12312412421421' },
        { name: '张二', time: '2019-06-10', task1: '未通过', type: '临时任务需要延期12312412421422' },
        { name: '张三', time: '2019-06-11', task1: '已审批', type: '临时任务需要延期12312412421423' },
        { name: '张四', time: '2019-06-12', task1: '待审批', type: '临时任务需要延期12312412421424' }
      ],
      data: {
        da11: '李奎出差申请',
        da12: '24小时',
        da13: '郑州',
        da14: '软件部',
        da15: '李逵，李奎',
        da16: '李魁',
        da17: '2019-09-24-2019-09-25',
        da18: '2019-09-24',
        da19: '我是李魁我要出差啦啦啊啊啊啊，，，我是李魁我要出差啦啦啊啊啊啊，，我是李魁我要出差啦啦啊啊啊啊，，'
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>
