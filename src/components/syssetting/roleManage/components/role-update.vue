<template>
  <Modal
    v-model="updateRole"
    :hasCloseIcon="hasCloseIcon"
    :hasDivider="hasDivider"
    :middle="true"
    :closeOnMask="closeOnMask"
  >
    <div slot="header" class="title">
      编辑角色
      <i class="h-icon-close" @click="close"></i>
    </div>
    <div :labelPosition="labelPosition">
      <Form ref="form" :model="roleList" :label-width="110" :top="0.2" :rules="validationRules">
        <FormItem label="角色名称：" prop="roleName">
          <input type="text" v-model="roleList.roleName" />
        </FormItem>
        <FormItem label="角色代码：" prop="roleCode">
          <input type="text" v-model="roleList.roleCode" />
        </FormItem>
        <FormItem label="备注：" prop="remarks">
          <RichTextEditor v-model="roleList.remarks"></RichTextEditor>
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
import roleModel from 'model/role/roleModel';
export default {
  props: ['updateRole'],
  data() {
    return {
      roleList: roleModel.parse({}),
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      validationRules: {
        required: ['roleName', 'roleCode']
      },
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    getData(id) {
      this.roleList.id = id;
      R.roleManage.roleFindOne(roleModel.dispose(this.roleList)).then(resp => {
        if (resp.ok) {
          this.roleList.id = resp.body.id;
          this.roleList.roleName = resp.body.roleName;
          this.roleList.roleCode = resp.body.roleCode;
          this.roleList.remarks = resp.body.remarks;
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.roleManage.roleUpdate(roleModel.dispose(this.roleList)).then(resp => {
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.roleList = roleModel.parse({});
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

