<template>
  <Modal
    v-model="updateModule"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      编辑模块
      <i class="h-icon-close" @click="close"></i>
    </div>

    <div :labelPosition="labelPosition">
      <Form
        ref="form"
        :model="moduleList"
        :label-width="110"
        :top="0.2"
        :rules="validationRules"
        mode="twocolumn"
      >
        <FormItem label="所属模块：" prop="pid">
          <Select v-model="moduleList.pid" :datas="modules"></Select>
        </FormItem>
        <FormItem label="模块名称：" prop="modelName">
          <input type="text" v-model="moduleList.modelName" />
        </FormItem>
        <FormItem label="模块编号：" prop="modelCode">
          <input type="text" v-model="moduleList.modelCode" />
        </FormItem>
        <FormItem label="模块排行：" prop="sortValue">
          <input type="text" v-model="moduleList.sortValue" />
        </FormItem>
        <FormItem label="模块地址：" prop="modelUrl">
          <input type="text" v-model="moduleList.modelUrl" />
        </FormItem>
        <FormItem label="关联按钮：" prop="actionIds">
          <Select v-model="moduleList.actionIds" :datas="action" :multiple="true"></Select>
        </FormItem>
        <FormItem label="备注：" prop="taginputsData" single>
          <RichTextEditor></RichTextEditor>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="submit">更新</button>
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
import moduleModel from 'model/module/moduleModel';
export default {
  props: ['updateModule', 'action', 'modules'],
  data() {
    return {
      moduleList: moduleModel.parse({}),
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      validationRules: {
        required: ['modelName', 'modelCode', 'sortValue', 'actionIds']
      },
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    getData(id) {
      this.moduleList.id = id;
      R.moduleManage.moduleFindOne(moduleModel.dispose(this.moduleList)).then(resp => {
        if (resp.ok) {
          this.moduleList = moduleModel.parse(resp.body);
          if (resp.body.actionIds == '') {
            this.moduleList.actionIds = resp.body.actionIds;
          } else {
            this.moduleList.actionIds = resp.body.actionIds.split(',');
          }
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.moduleManage.moduleUpdate(moduleModel.dispose(this.moduleList)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.moduleList = moduleModel.parse({});
              this.$parent.findAll();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.$parent.close();
            this.$Loading.close();
          }
        });
      }
    },
    close() {
      this.$parent.close();
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
    font-size: 16px !important;
  }
}
</style>

