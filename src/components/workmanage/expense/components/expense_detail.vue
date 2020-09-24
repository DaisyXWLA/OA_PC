<style lang='less'>
</style>

<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div style="height: 800px;">
        <div class="h-panel-body">
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
            <FormItem label="招待费报销主题：">关于大鹏老师的十月一义务加班</FormItem>
            <FormItem label="费用发生日期：">
              <span>2019-10-01</span>
            </FormItem>
            <FormItem label="报销金额：">
              <span>250.00</span>
            </FormItem>
            <FormItem label="备注：">
              <span>大鹏老师吃喝嫖赌抽欠债</span>
            </FormItem>
            <FormItem label="申请人：">
              <span>大鹏老师</span>
            </FormItem>
            <FormItem label="申请日期：">
              <span>2019-09-30</span>
            </FormItem>
          </Form>
        </div>
        <div class="h-panel-body">
          <div class="info-title">
            <h3>审批信息</h3>
          </div>
          <div style="width:85%;margin: 0 auto;">
            <Table ref="table" :datas="datas" :border="true">
              <TableItem prop="name" title="审批人" align="center"></TableItem>
              <TableItem prop="time" title="审批日期" align="center"></TableItem>
              <TableItem title="审批状态" align="center">
                <template slot-scope="{data}">
                  <div v-if="data.state=='未通过'">
                    <Button :circle="true" color="red">{{data.state}}</Button>
                  </div>
                  <div v-else-if="data.state=='已审批'">
                    <Button :circle="true" color="blue">{{data.state}}</Button>
                  </div>
                  <div v-else-if="data.state=='待审批'">
                    <Button :circle="true" color="green">{{data.state}}</Button>
                  </div>
                  <div v-else></div>
                </template>
              </TableItem>
              <TableItem prop="type" title="拒绝理由" align="center"></TableItem>
            </Table>
          </div>
          <p v-height="20"></p>
          <div style="text-align: center">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';

export default {
  data() {
    return {
      param3: [{ title: '测试1', key: 'test1' }, { title: '测试2', key: 'test2' }, { title: '测试3', key: 'test3' }],
      stripe: false,
      isLoading: false,
      title: '',
      datas: []
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
      this.addPerson = false;
    },
    changePage() {
      this.getData(true);
      this.addPerson = false;
    },
    getData(reload = false) {
      if (reload) {
      }
      this.isLoading = true;
      setTimeout(() => {
        (this.datas = [
          { name: '张一', time: '2019-06-09', state: '已审批', type: '浪子回头浪子回头浪子回头' },
          { name: '张二', time: '2019-06-10', state: '未通过', type: '浪子回头浪子回头浪子回头' },
          { name: '张三', time: '2019-06-11', state: '已审批', type: '浪子回头浪子回头浪子回头' },
          { name: '张四', time: '2019-06-12', state: '待审批', type: '浪子回头浪子回头浪子回头' }
        ]),
          (this.isLoading = false);
      }, 500);
    },
    add() {
      this.title = '新增项目成员';
      this.addPerson = false;
      this.addPerson = true;
    },
    update() {
      this.title = '修改项目成员';
      this.addPerson = false;
      this.addPerson = true;
    },
    currentChange(value) {
      console.log(value);
    },
    remove(datas, data) {
      this.addPerson = false;
      this.addPerson = true;
      this.addPerson = false;
      datas.splice(datas.indexOf(data), 1);
    },
    confirm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        if (this.$refs.table.getSelection().length >= 1) {
          this.$Confirm('确定删除？')
            .then(() => {
              this.$Message.success('删除成功！');
            })
            .catch(() => {
              this.$Message.error('取消删除');
            });
        }
      }
    },
    close() {
      this.addPerson = false;
    }
  }
};
</script>

