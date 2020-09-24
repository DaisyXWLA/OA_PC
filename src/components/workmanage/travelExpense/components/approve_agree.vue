<template>
  <Modal v-model="agreeovertime" v-bind="params" :hasDivider="true">
    <div slot="header">出差费报销审批</div>
    <div class="h-panel-body">
      <Row>
        <Cell :width="6">
          <i class="h-icon-help" v-font="45" v-color:blue></i>
        </Cell>
        <Cell :width="18"><p>确定同意该条出差费报销吗？</p></Cell>
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
  props: ['agreeovertime', 'title'],
  data() {
    return {
      params: {
        hasCloseIcon: true
      }
    };
  },
  mounted() {},
  methods: {
    confirm() {
      this.agreeovertime = false;
    },
    close() {
      this.agreeovertime = false;
    }
  }
};
</script>

