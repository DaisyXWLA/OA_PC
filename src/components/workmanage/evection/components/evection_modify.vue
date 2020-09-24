<template>
  <Modal v-model="isUpdateShow" v-bind="params">
    <div slot="header" class="title">{{title}}<i @click="ceshi">×</i></div>
    <div>
      <Form :label-width="110" :mode="mode" :model="data" ref="form" :top="0.2"  >
        <FormItem label="出差主题" prop="param2">
          <input type="text" v-model="data.param2" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="出差地点" prop="param3">
          <input type="text" v-model="data.param3" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="出差同行人" prop="select3Data">
          <Select v-model="data.select3Data" dict="simple" :multiple="true"></Select>
        </FormItem>
        <FormItem label="出差时间段" prop="param6">
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
              <input type="text" style="border: 1px solid #d3d3d3" v-model="data.param8" />
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="出差事由" prop="taginputsData">
          <RichTextEditor v-model="data.param7"></RichTextEditor>
        </FormItem>
        <FormItem :no-padding="true" style="text-align: right">
          <Button @click="ceshi">取消</Button>
          <Button class="h-btn-primary" @click="reset">确定</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
export default {
  props: ['isUpdateShow', 'title'],
  data() {
    return {
      params: {
        closeOnMask: false,
       // hasCloseIcon: true
      },
      mode: 'single',
      data: {
        param2: '李魁出差申请',
        param3: '郑州',
        param6: { start: '2019-09-21', end: '2019-10-21' },
        param8: '8',
        param7: '<p>这是一个出差事由</p>'
      },
      isLoading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    ceshi() {
      this.$parent.close();
    },
    reset() {
      this.isLoading = false;
      this.$refs.form.resetValid();
    }
  }
};
</script>