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
            <FormItem label="审批状态："> <button class="h-btn-s h-btn h-btn-blue h-btn-circle">已审批</button></FormItem>
          </Form>
          <Form class="info-basic" :label-width="200" readonly>
            <FormItem label="加班事由：">大鹏老师思想觉悟高，自觉开发项目，开发不完成，坚决不休息</FormItem>
          </Form>
          <p v-height="80"></p>
          <div class="text-center">
            <button class="h-btn h-btn-green" @click="black">
              <i class="icon-cross"></i>&nbsp;返回
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
    return {};
  },
  mounted() {},
  methods: {
    black() {
      this.$router.go(-1);
    },
  }
};
</script>

