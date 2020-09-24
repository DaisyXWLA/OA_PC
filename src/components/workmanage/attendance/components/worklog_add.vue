<template>
  <div class="app-home-vue frame-page">
    <Modal v-model="addlog" :middle="true">
      <div slot="header" class="title">{{title}}<i @click="close">×</i></div>
      <div :labelPosition="labelPosition">
        <Form
          ref="form"
          :model="worklogModel"
          :label-width="110"
          :top="0.2"
          :rules="validationRules"
           
        >
          <FormItem label="日志标题：" prop="workLogTitle">
            <input type="text" v-model="worklogModel.workLogTitle" />
          </FormItem>
          <FormItem label="日志类型：" prop="workLogType">
            <Select v-model="worklogModel.workLogType" class="select-demo" :datas="param"></Select>
          </FormItem>
          <FormItem label="关联项目：" prop="projectInfo">
            <Select v-model="worklogModel.projectInfo" class="select-demo" :datas="param2"></Select>
          </FormItem>
          <FormItem label="日志日期：" prop="workLogDate">
            <DatePicker v-model="worklogModel.workLogDate" :format="format"></DatePicker>
          </FormItem>
          <FormItem label="日志内容：" prop="content">
            <RichTextEditor v-model="worklogModel.content"></RichTextEditor>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <button class="h-btn" @click="close">取消</button>
        <button class="h-btn h-btn-primary" @click="submit">确定</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import worklogList from 'model/worklog/worklogList';
export default {
  props: ['addlog', 'title'],
  data() {
    return {
      worklogModel: worklogList.parse({}),
      param: [{ title: '工作日志', key: '0' }, { title: '施工日志', key: '1' }],
      param2: [],
      format: '',
      validationRules: {
        required: ['workLogTitle', 'workLogType', 'workLogDate', 'content', 'projectInfo']
      },
      labelPosition: 'right'
    };
  },
  mounted() {},
  methods: {
    getList() {
      R.ProjectTask.projectNameAndIdList(worklogList.dispose(this.worklogModel)).then(resp => {
        if (resp.ok) {
          // console.log(resp.body);
          this.param2 = resp.body;
        }
      });
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.Worklog.worklogAdd(worklogList.dispose(this.worklogModel)).then(resp => {
          if (resp.ok) {
            this.$Message.success(resp.body.body);
            setTimeout(() => {
              this.worklogModel = worklogList.parse({});
              this.$parent.getData();
              this.$parent.close();
            }, 2000);
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

