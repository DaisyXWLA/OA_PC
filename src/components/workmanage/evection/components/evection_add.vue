<template>
  <Modal v-model="isAddShow" v-bind="params">
    <div slot="header" class="title">{{title}}<i @click="ceshi">×</i></div>
    <div>
      <Form :label-width="110" :mode="mode" :model="data" ref="form" :top="0.2"  >
        <FormItem label="出差主题" prop="param2">
          <input
            type="text"
            v-model="evectionSearch.travelTitle"
            placeholder="请输入"
            v-wordlimit="30"
          />
        </FormItem>
        <FormItem label="出差地点" prop="param3">
          <input
            type="text"
            v-model="evectionSearch.travelAddrCity"
            placeholder="请输入"
            v-wordlimit="30"
          />
        </FormItem>
        <FormItem label="出差同行人" prop="select3Data">
          <Select v-model="evectionSearch.select3Data" dict="simple" :multiple="true"></Select>
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
              <input
                type="text"
                style="border: 1px solid #d3d3d3"
                v-model="evectionSearch.planDays"
              />
            </Cell>
          </Row>
        </FormItem>
        <FormItem label="出差事由" prop="taginputsData">
          <RichTextEditor v-model="evectionSearch.content"></RichTextEditor>
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
import evectionList from 'model/evection/evection';
export default {
  props: ['isAddShow', 'title', 'select'],
  data() {
    return {
      evectionSearch: evectionList.parse({}),
      params: {
        closeOnMask: false
        //hasCloseIcon: true
      },
      mode: 'single',
      data: {
        param1: '',
        param2: '',
        param3: '',
        param4: '',
        param5: '',
        param6: '',
        param7: '<p></p>'
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
      this.evectionSearch.planStartTime = this.data.param6.start;
      this.evectionSearch.planEndTime = this.data.param6.end;
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.Projecevection.evectionAdd(evectionList.dispose(this.evectionSearch)).then(resp => {
          // if (resp.ok) {
          //   if (resp.ok) {
          //     this.$Message('保存成功');
          //     setTimeout(() => {
          //       this.$parent.getData();
          //       this.$parent.close();
          //     }, 2000);
          //   } else {
          //     this.$Message('保存失败');
          //   }
          // }
          if (resp.ok) {
            setTimeout(() => {
              this.$parent.close();
              this.$Loading.close();
              this.$Message('保存成功');
              this.$parent.getData();
            }, 1000);
          } else {
            this.$Message('保存失败');
            this.$parent.close();
            this.$Loading.close();
            this.$parent.getData();
          }
        });
      }
    }
  }
};
</script>