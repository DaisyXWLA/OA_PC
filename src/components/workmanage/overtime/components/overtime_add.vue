<template>
  <Modal v-model="addOvertime" :hasCloseIcon="hasCloseIcon" :hasDivider="hasDivider" :middle="true">
    <div slot="header" class="title">新增加班<i @click="close">×</i></div>
    <div :labelPosition="labelPosition">
      <Form ref="form" :model="data" :label-width="110" :top="0.2"  >
        <FormItem label="加班主题：" prop="theme">
          <input type="text" v-model="data.theme" />
        </FormItem>
        <FormItem label="关联项目：" prop="relatedprojects">
          <Select v-model="data.relatedprojects" class="select-demo" :datas="param"></Select>
        </FormItem>
        <FormItem label="加班时间：" prop="time">
          <Row :space="0">
            <Cell width="20">
              <DateRangePicker v-model="data.time" :format="format"></DateRangePicker>
            </Cell>
            <Cell width="2">
              <button class="h-btn" style="width: 60px;">
                <span>预计</span>
              </button>
            </Cell>
            <Cell width="2">
              <input type="text" style="border: 1px solid #d3d3d3" v-model="data.param5" />
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="加班理由：" prop="reason">
          <RichTextEditor v-model="data.value"></RichTextEditor>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn" @click="close">取消</button>
      <button class="h-btn h-btn-primary" @click="confirm">确定</button>   
    </div>
  </Modal>
</template>
<script>
export default {
  props: ['addOvertime'],
  data() {
    return {
      param: [
        { title: '海友科伟官网开发', key: 'a1', other: '其他值' },
        { title: '办公平台开发', key: 'a2' },
        { title: '郑州师院固定资产', key: 'a3' }
      ],
      data: {
        theme: null,
        relatedprojects: null,
        time: null,
        reason: null,
        value: null,
      },
      format: '',
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
    };
  },
  mounted() {},
  methods: {
    confirm() {
      if (this.title == '加班申请') {
        this.$Message({
          type: 'success',
          text: '添加成功'
        });
      } else {
        this.$Message({
          type: 'success',
          text: '修改成功'
        });
      }
      this.$parent.close();
    },
    close() {
      this.$parent.close();
    }
  }
};
</script>
<style lang="less">
/**修改弹框默认样式 */
.h-modal .h-notify-container .h-modal-header, .h-modal .h-notify-container header:first-child{
  background: #2d7bf4;
  color: #fff;
}
  .h-icon-close:before{
    color: #fff;
    // font-size: 8px;
  }
  .title {
    background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  margin-left: -15px;
    i{
      color: #fff;
      font-style: normal;
      float: right;
      cursor: pointer;
    }
  }
  
</style>
