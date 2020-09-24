<template>
  <Modal v-model="recordingAdd" :middle="true" v-bind="params">
    <div slot="header">补录</div>
    <div :labelPosition="labelPosition">
      <Form
        ref="form"
        :model="myAttSearch"
        :label-width="130"
        :top="0.2"
        :rules="validationRules"
      >
        <FormItem label="补录日期：" prop="attrTime">
          <DatePicker v-model="myAttSearch.attrTime" :format="format"></DatePicker>
        </FormItem>
        <FormItem label="上班打卡时间：" prop="startAttrTime">
          <DatePicker v-model="myAttSearch.startAttrTime" type="datetime"></DatePicker>
        </FormItem>
        <FormItem label="下班打卡时间：" prop="endAttrTime">
          <DatePicker v-model="myAttSearch.endAttrTime" type="datetime"></DatePicker>
        </FormItem>
        <FormItem label="描述：" prop="bak">
          <RichTextEditor v-model="myAttSearch.bak"></RichTextEditor>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn h-btn-primary" @click="submit">提交</button>
      <button class="h-btn" @click="cancel">关闭</button>
    </div>
  </Modal>
</template>
<script>
import myAttModel from 'model/att/attModel';
export default {
  props: ['recordingAdd'],
  data() {
    return {
      myAttSearch: myAttModel.parse({}),
      format: '',
      params: {
        closeOnMask: false,
        hasDivider: true
      },
      validationRules: {
        required: ['attrTime', 'startAttrTime', 'endAttrTime']
      },
      labelPosition: 'right'
    };
  },
  mounted() {},
  methods: {
    init() {
      const vm = this;
      this.getData();
    },
    getData(Id) {
      this.myAttSearch.id=Id;
      R.ProjecetMyAtt.attFindOne(myAttModel.dispose(this.myAttSearch)).then(resp => {
        if (resp.ok) {
          this.myAttSearch.id=resp.body.id;
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.ProjecetMyAtt.attSave(myAttModel.dispose(this.myAttSearch)).then(resp => {
          this.cancel();
          if (resp.ok) {
            this.myAttSearch = myAttModel.parse({});
            this.$Message.success('补录成功');
            setTimeout(() => {
              this.myAttSearch = myAttModel.parse({});
              this.$parent.getData();
            }, 2000);
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

