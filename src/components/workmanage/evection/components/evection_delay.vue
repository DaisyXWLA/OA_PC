<template>
  <Modal v-model="isDelayShow" v-bind="params">
    <div slot="header" class="title">{{title}}<i @click="ceshi">×</i></div>
    <div>
      <Form :label-width="110" :mode="mode" :model="data" ref="form" :top="0.2"  >
        <FormItem label="延迟时间到" prop="param6">
          <DatePicker v-model="value"></DatePicker>
        </FormItem>
        <FormItem label="延迟事由" prop="taginputsData">
          <RichTextEditor v-model="data.param7"></RichTextEditor>
        </FormItem>
        <FormItem :no-padding="true" style="text-align: right">
          <Button @click="ceshi">取消</Button>
          <Button class="h-btn-primary" @click="reset">确定</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ['isDelayShow', 'title'],
  data() {
    return {
      params: {
        closeOnMask: false
        //hasCloseIcon: true
      },
      mode: 'single',
      value: '',
      data: {
        param1: '',
        param2: '',
        param3: '',
        param4: '',
        param5: '',
        param6: '',
        param7: '<p></p>'
      },
      isLoading: false,
      isInputAsyncError: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    ceshi() {
      this.$parent.close();
    },

    reset() {
      this.isLoading = false;
      this.$refs.form.resetValid();
    }
  }
};
</script>