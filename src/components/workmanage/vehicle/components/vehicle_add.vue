<template>
  <Modal v-model="a" v-bind="params">
    <div slot="header" class="title">{{title}}<i class="h-icon-close" @click="modalDelete"></i></div>
    <div>
      <Form
        :label-width="110"
        :mode="mode"
        :model="data"
        :rules="validationRules"
        ref="form"
        :top="0.2"      
      >
        <FormItem label="用车主题：" prop="param2">
          <input type="text" v-model="data.param2" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="车牌号：" prop="param3">
          <Select v-model="data.param3" dict="simple"></Select>
        </FormItem>
        <FormItem label="用车时间段：" prop="param6">
          <Row :space="0">
            <Cell width="20">
              <DateRangePicker v-model="data.param6"></DateRangePicker>
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
         <FormItem label="乘车同行人：" prop="param2">
          <input type="text" v-model="data.param2" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="用车事由：" prop="taginputsData">
          <RichTextEditor v-model="data.param7"></RichTextEditor>
        </FormItem>
        <FormItem :no-padding="true" style="text-align: right">
          <Button @click="modalDelete">取消</Button>
          <Button color="primary" @click="modalConfirm">确定</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ['a', 'title'],
  data() {
    return {
      value8: '1',
      param8: { 1: '继续为该需求添加任务', 2: '返回任务列表', 3: '返回需求列表' },
      value6: '',

      params: {
        closeOnMask: false,
        hasCloseIcon: false
      },
      mode: 'single',
      data: {
        param1: '',
        param2: '',
        param3: '',
        param4: '',
        param5: '',
        param6: ''
      },
      isLoading: false,
      isInputAsyncError: false,
      //定义验证规则
      validationRules: {
        rules: {
          textareaData: {
            maxLen: 50,
            minLen: 10
          },
          inputData: {
            validAsync(value, next, parent, data) {
              log(value);
              setTimeout(() => {
                if (value == 15) {
                  next();
                } else {
                  next('ID不等于15');
                }
              }, 1000);
            }
          }
        }
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.check();
    },
    check() {
      if (this.title == '修改') {
      }
    },
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Message('验证成功');
      }
    },
    submitAsync() {
      this.isLoading = true;
      this.$refs.form.validAsync().then(result => {
        if (result.result) {
          this.$Message('验证成功');
        }
        this.isLoading = false;
      });
    },
    open() {
      this.$Modal({
        title: '处理',
        content: '我要去做特殊的处理'
      });
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    remove(index) {
      this.data.inputsData.splice(index, 1);
    },
    modalConfirm() {
      this.$Message.info('确认');
      this.a = false;

    },
    modalDelete() {
      
      this.$Message.error('关闭');
      this.a = false;
    }
  }
};
</script>
<style lang="less">
  .h-icon-close:before{
    color: #fff;
    // font-size: 8px;
  }
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