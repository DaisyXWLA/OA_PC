<style lang='less'>
.app-home-vue {
  .h-table-header table {
    background-color: #ffffff;
  }
}
.h-table-header table {
  background-color: #ffffff;
}
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
            <FormItem label="加班主题：">关于大鹏老师的十月一义务加班</FormItem>
            <FormItem label="部门：">
              <span>软件部</span>
            </FormItem>
            <FormItem label="加班时间段：">
              <span>2019-10-01——2019-10-07</span>
            </FormItem>
            <FormItem label="申请人：">
              <span>大鹏老师</span>
            </FormItem>
            <FormItem label="加班天数：">
              <span>7天</span>
            </FormItem>
            <FormItem label="申请日期：">
              <span>2019-09-30</span>
            </FormItem>
          </Form>
          <Form class="info-basic" :label-width="200" readonly>
            <FormItem label="关联项目：">海友科伟办公开发</FormItem>
          </Form>
          <Form class="info-basic" :label-width="200" readonly>
            <FormItem label="加班事由：">大鹏老师思想觉悟高，自觉开发项目，开发不完成，坚决不休息</FormItem>
          </Form>
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
          <div class="text-center">
            <button class="h-btn h-btn-red" @click="agree">
              <i class="icon-circle-check"></i>
              <span>同意</span>
            </button>
            <button class="h-btn h-btn-yellow" @click="refuse">
              <i class="icon-circle-cross"></i>
              <span>拒绝</span>
            </button>
            <button class="h-btn h-btn-green" @click="close">
              <i class="icon-cross"></i>
              <span>关闭</span>
            </button>
          </div>
        </div>
      </div>
      <Agreeovertime :agreeovertime="agreeovertime" :title="title"></Agreeovertime>
      <Refuseovertime :refuseovertime="refuseovertime"></Refuseovertime>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';
import agree from './approve_agree';
import refuse from './approve_refuse';

export default {
  components: {
    Agreeovertime: agree,
    Refuseovertime: refuse
  },
  data() {
    return {
      agreeovertime: false,
      refuseovertime: false,
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
    currentChange(value) {
      console.log(value);
    },
    close() {
      this.$router.go(-1);
    }
  }
};
</script>

