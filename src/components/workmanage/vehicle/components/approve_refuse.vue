<template>
  <Modal v-model="refuseovertime" v-bind="params" :hasDivider="true">
    <div slot="header">{{title}}</div>
    <div class="h-panel-body">
      <Row>
        <Cell :width="6">
          <i class="h-icon-help" v-font="45" v-color:blue></i>
        </Cell>
        <Cell :width="18">
          <p>确定拒绝该条调休信息吗？</p>
          <textarea v-model="value"></textarea></Cell>
      </Row> 
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="confirm">确定</button>
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: ['refuseovertime', 'title'],
  data() {
    return {
      value: '',
      params: {
        hasCloseIcon: true
      }
    };
  },
  mounted() {},
  methods: {
    confirm() {
      this.refuseovertime = false;
    },
    close() {
      this.refuseovertime = false;
    }
  }
};
</script>