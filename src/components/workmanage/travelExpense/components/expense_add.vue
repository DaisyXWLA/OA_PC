<template>
  <div class="app-home-vue frame-page">
    <Modal v-model="addtravel" :hasCloseIcon="hasCloseIcon" :hasDivider="hasDivider" :middle="true">
      <div slot="header" class="title">{{title}}<i class="h-icon-close" @click="close"></i></div>
      <div :labelPosition="labelPosition">
        <Form ref="form" :model="data" :label-width="120" :top="0.2"  >
          <FormItem label="出差费报销主题：" prop="theme">
            <input type="text" v-model="data.theme" />
          </FormItem>
          <FormItem label="总报销费用：" prop="allmoney">
            <input type="text" v-model="data.allmoney" />
          </FormItem>
          <FormItem label="关联出差：" prop="relevancetravel">
            <Select v-model="data.relevancetravel" class="select-demo" :datas="param5"></Select>
          </FormItem>
          <FormItem label="出差天数：" prop="daynumber">
            <Category :option="param3" type="object" multiple></Category>
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <RichTextEditor v-model="data.remark"></RichTextEditor>
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
  props: ['addtravel', 'title'],
  data() {
    return {
      options: {
        max_file_size: '1mb'
      },
      data: {
        theme: null,
        allmoney: null,
        relevancetravel: null,
        daynumber: null,
        remark:'<p><i>测试</i></p>',
        file: []
      },
      format: '',
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      param5: [{ title: '袁辉', key: 'a1', other: '其他值' }, { title: '李坡坡', key: 'a2' }, { title: '马利敏', key: 'a3' }],
      //项目成员输入框
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
      if (this.title == '出差费报销申请') {
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
      this.addtravel = false;
    },
    close() {
      this.addtravel = false;
    }
  }
};
</script>
<style lang="less">
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

