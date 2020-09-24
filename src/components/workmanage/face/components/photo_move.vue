<template>
  <div class="app-home-vue frame-page">
    <Modal v-model="moveimage" :middle="true" :hasDivider="true" v-bind="params">
      <div slot="header">移动到</div>
      <div :labelPosition="labelPosition" style="margin-top:10px">
        <Form ref="form" :model="data" :label-width="110" :top="0.2"  >
          <Checkbox v-model="value" :datas="param" ></Checkbox>
          <br><br>
        </Form>
      </div>
      <div slot="footer">
        <button class="h-btn h-btn-primary" @click="confirm">确认</button>
        <button class="h-btn" @click="cancel">关闭</button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: ['moveimage'],
  data() {
    return {
      data: {
        theme: null,
        num: ''
      },
      value: [],
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
      this.moveimage = false;
    },
    cancel() {
      this.$parent.close();
    }
  }
};
</script>

