<template>
  <div class="app-home-vue frame-page">
    <Modal v-model="addapply" :hasCloseIcon="hasCloseIcon" :hasDivider="hasDivider" :middle="true">
      <div slot="header" class="title">{{title}}<i class="h-icon-close" @click="close"></i></div>
      <div :labelPosition="labelPosition">
        <Form ref="form" :model="data" :label-width="120" :top="0.2"  >
          <FormItem label="招待费报销主题：" prop="theme">
            <Category :option="param3" type="object" multiple></Category>
          </FormItem>
          <FormItem label="报销金额：" prop="moneynum">
            <input type="text" v-model="data.moneynum" />
          </FormItem>
          <FormItem label="费用发生日期：" prop="time">
            <DateRangePicker v-model="data.value" :format="format" placeholder="开始—结束"></DateRangePicker>
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <RichTextEditor v-model="value"></RichTextEditor>
          </FormItem>
          <FormItem label="附件：" prop="accessory">
            <Qiniu :options="options" type="image" :limit="2" data-type="file" v-model="data.file"></Qiniu>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <button class="h-btn" @click="close">取消</button>
        <button class="h-btn h-btn-primary" @click="confirm">确定</button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  props: ['addapply','title'],
  data() {
    return {
      value2: '0',
      data: {
        persons: null,
        position: null
      },
      options:'',
      format:'',
      labelPosition: 'right',
      // addPerson: false,
      hasCloseIcon: false,
      hasDivider: true,
      value: null,
      param3: {
        keyName: 'id',
        titleName: 'name',
        datas: []
      }
    };
  },
  mounted() {
  },
  methods: {
    confirm() {
      this.$Message({
        type: 'success',
        text: '添加成功'
      });
      this.addapply = false;
    },
    close() {
      this.addapply = false;
    }
  }
};
</script>
<style lang="less">
.h-icon-close:before{
    color: #fff;
    // font-size: 8px;
  }
.title {
  background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  margin-left: -15px;
  overflow: hidden;
  .h-icon-close {
    float: right;
    line-height: 40px;
    font-size: 16px!important;
  }
}
</style>
