<template>
  <Modal
    v-model="addDept"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      新增部门
      <i class="h-icon-close" @click="close"></i>
    </div>

    <div :labelPosition="labelPosition">
      <Form ref="form" :model="deptList" :label-width="110" :top="0.2" mode="twocolumn" :rules="validationRules">
        <FormItem label="上级部门：" prop="pid">
          <Select v-model="deptList.pid" class="select-demo" :datas="department"></Select>
        </FormItem>
        <FormItem label="部门名称：" prop="departmentName">
          <input type="text" v-model="deptList.departmentName" />
        </FormItem>
        <FormItem label="部门编号：" prop="departmentCode">
          <input type="text" v-model="deptList.departmentCode" />
        </FormItem>
        <FormItem label="排序值：" prop="sortValue">
          <input type="text" v-model="deptList.sortValue" />
        </FormItem>
        <FormItem label="备注：" prop="taginputsData" single>
          <RichTextEditor></RichTextEditor>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="submit">保存</button>
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
import deptModel from 'model/department/deptModel';
export default {
  props: ['addDept', 'department'],
  data() {
    return {
      deptList: deptModel.parse({}),
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      validationRules: {
        required: ['departmentName', 'departmentCode']
      },
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.deptManage.departmentAdd(deptModel.dispose(this.deptList)).then(resp => {
          // console.log(resp)
          if (resp.ok) {
            if (resp.msg == '') {
              this.$Message.error(resp.body);
              this.$parent.close();
              this.$Loading.close();
            } else {
              setTimeout(() => {
                this.$parent.close();
                this.$Loading.close();
                this.$Message.success('保存成功');
                this.deptList = deptModel.parse({});
                this.$parent.getData();
              }, 1000);
            }
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

