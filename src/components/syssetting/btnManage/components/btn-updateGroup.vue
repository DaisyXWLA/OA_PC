<template>
  <Modal
    v-model="updateBtnGroup"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      编辑分组
      <i class="h-icon-close" @click="close"></i>
    </div>

    <div :labelPosition="labelPosition">
      <Form
        ref="form"
        :model="btnGroupList"
        :label-width="110"
        :top="0.2"
        mode="twocolumn"
        :rules="validationRules"
      >
        <FormItem label="上级分组：" prop="actionGroup">
          <Select v-model="btnGroupList.actionGroup" class="select-demo" :datas="btnGroup"></Select>
        </FormItem>
        <FormItem label="分组名称：" prop="groupName">
          <input type="text" v-model="btnGroupList.groupName" />
        </FormItem>
        <!-- <FormItem label="按钮代码：" prop="actionCode">
          <input type="text" v-model="btnGroupList.actionCode" />
        </FormItem>-->
        <FormItem label="分组排序：" prop="sortValue">
          <input type="text" v-model="btnGroupList.sortValue" />
        </FormItem>
        <FormItem label="分组描述：" prop="remarks" single>
          <RichTextEditor v-model="btnGroupList.remarks"></RichTextEditor>
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
import btnGroupModel from 'model/button/buttonGroupModel';
export default {
  props: ['updateBtnGroup', 'btnGroup'],
  data() {
    return {
      btnGroupList: btnGroupModel.parse({}),
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      validationRules: {
        required: ['groupName', 'sortValue']
      },
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    getData(id) {
      this.btnGroupList.id = id;
      R.buttonManage.buttonFindOne(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
        if (resp.ok) {
          this.btnGroupList = btnGroupModel.parse(resp.body);
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.buttonManage.buttonAddGroup(btnGroupModel.dispose(this.btnGroupList)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.btnGroupList = btnGroupModel.parse({});
              this.$parent.getData();
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

