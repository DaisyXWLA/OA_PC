<template>
  <Modal v-model="addUserGroup" :middle="true" :hasDivider="true" v-bind="params">
    <div slot="header" class="title">新增用户组<i @click="cancel">×</i></div>
    <div :labelPosition="labelPosition" style="margin-top:10px">
      <Form ref="form" :mode="mode" :model="faceSearch" :label-width="110" :top="0.2" :rules="validationRules">
        <FormItem label="用户组ID：" prop="group_id">
          <input type="text" v-model="faceSearch.group_id" style="width:500px" placeholder="由数字、字母下划线组成" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn" @click="cancel">取消</button>
      <button class="h-btn h-btn-primary" @click="submit">确定</button>
    </div>
  </Modal>
</template>
<script>
import faceModel from 'model/face/faceModel';
export default {
  props: ['addUserGroup'],
  data() {
    return {
      faceSearch: faceModel.parse({}),
      mode: 'single',
      params: {
        closeOnMask: false,
        hasDivider: true
      },
      validationRules: {
        required: ['group_id']
      },
      format: '',
      labelPosition: 'right'
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const vm = this;
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.ProjectFace.faceGroupAdd(faceModel.dispose(this.faceSearch)).then(resp => {
          console.log(resp)
          if (resp.ok) {
            this.$Message.success('保存成功');
            this.faceSearch = faceModel.parse({});
            this.$parent.close();
            setTimeout(() => {
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('保存失败');
            this.faceSearch = faceModel.parse({});
            this.$parent.close();
            setTimeout(() => {
              this.$parent.getData();
            }, 1000);
          }
        });
      }
    },
    cancel() {
      this.$parent.close();
    }
  }
};
</script>

