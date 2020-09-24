<template>
  <Modal v-model="copyimage" :middle="true" :hasDivider="true" v-bind="params">
    <div slot="header">复制到</div>
    <div :labelPosition="labelPosition" style="margin-top:10px">
      <Checkbox v-model="value" :datas="param" ></Checkbox>
          <br><br>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="confirm">确认</button>
      <button class="h-btn" @click="cancel">关闭</button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: ['copyimage'],
  data() {
    return {
      data: {
        theme: null,
        num: ''
      },
      value: '',
      param: ['hykw','hykw_2','hykw_3' ],
      params: {
        closeOnMask: false,
        hasDivider: true
      },
      format: '',
      labelPosition: 'right'
    };
  },
  mounted() {},
  methods: {
    confirm() {
      this.$Message({
        type: 'success',
        text: '添加成功'
      });
      this.copyimage = false;
    },
    cancel() {
      this.$parent.close();
    }
  }
};
</script>

