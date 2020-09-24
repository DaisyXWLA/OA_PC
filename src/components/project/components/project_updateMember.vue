<template>
  <div class="app-home-vue frame-page">
    <Modal v-model="updatePerson">
      <div slot="header" class="title">
        {{title}}
        <i class="h-icon-close" @click="close"></i>
      </div>
      <div :labelPosition="labelPosition">
        <Form
          ref="form"
          :model="projectManageModel"
          :label-width="110"
          :top="0.2"
          :rules="validationRules"
          mode="twocolumn"
        >
          <FormItem label="项目成员：" prop="team">
            <Select
              v-model="projectManageModel.team"
              class="select-demo"
              :datas="param"
              type="object"
            ></Select>
          </FormItem>
          <FormItem label="项目职位：" prop="position">
            <Select v-model="projectManageModel.position" class="select-demo" :datas="param2"></Select>
          </FormItem>
          <FormItem label="备注：" prop="describe" single>
            <RichTextEditor v-model="value"></RichTextEditor>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <button class="h-btn h-btn-primary" @click="confirm">更新</button>
        <button class="h-btn" @click="close">取消</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import projectmanageAdd from 'model/projectmanage/projectmanageModel';
export default {
  props: ['updatePerson', 'title', 'projectId'],
  data() {
    return {
      projectManageModel: projectmanageAdd.parse({}),
      value2: '0',
      param: [],
      param2: ['高层管理', '主管', '研发', '测试', '其他'],
      data: {
        persons: null,
        position: null
      },
      validationRules: {
        required: ['team', 'position']
      },
      labelPosition: 'right',

      value: null
    };
  },
  mounted() {},
  methods: {
    getData(Id) {
      R.Rms.ListT(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          this.param = resp.body;
        }
      });
      this.projectManageModel.id = Id;
      R.Projectmanage.memberFindOne(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
        if (resp.ok) {
          var k = resp.body.memberId;
          var t = resp.body.memberName;
          this.projectManageModel.team = { title: t, key: k };
          this.projectManageModel.position = resp.body.position;
        }
      });
    },
    confirm() {
      const vm = this;
      this.projectManageModel.projectInfo = vm.$props.projectId;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        this.projectManageModel.memberId = this.projectManageModel.team.key;
        this.projectManageModel.memberName = this.projectManageModel.team.title;
        R.Projectmanage.updateMember(projectmanageAdd.dispose(this.projectManageModel)).then(resp => {
          if (resp.ok) {
            // console.log(resp);
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message.success('保存成功');
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message.error('修改失败');
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

