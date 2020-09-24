<style lang='less'>
</style>

<template>
  <div class="app-form frame-page form-detail-vue">
    <div class="h-panel">
      <div style="height: 800px;">
        <div class="h-panel-body">
          <div class="info-title">
            <h3>基本信息</h3>
          </div>
          <!-- 基础信息 -->
          <Form class="info-basic" :label-width="200" mode="twocolumn" readonly>
            <FormItem label="出差费报销主题：">关于大鹏老师的十月一义务加班</FormItem>
            <FormItem label="总报销费用：">
              <span>22222</span>
            </FormItem>
            <FormItem label="关联出差：">
              <span>海友科伟办公开发</span>
            </FormItem>
            <FormItem label="出差天数：">
              <span>7天</span>
            </FormItem>
            <FormItem label="申请人：">
              <span>大鹏老师</span>
            </FormItem>
            <FormItem label="审批状态：">
              <Button :circle="true" color="green">已审批</Button>
            </FormItem>
            <FormItem label="备注：">
              <span>大鹏老师关于大鹏老师的十月一义务加班关于大鹏老师的十月一义务加班</span>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';

export default {
  data() {
    return {
      param3: [{ title: '测试1', key: 'test1' }, { title: '测试2', key: 'test2' }, { title: '测试3', key: 'test3' }],
      stripe: false,
      isLoading: false,
      title: '',
      datas: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    search(data) {
      this.getData(true);
      this.addPerson = false;
    },
    changePage() {
      this.getData(true);
      this.addPerson = false;
    },
    getData(reload = false) {
      if (reload) {
      }
      this.isLoading = true;
      setTimeout(() => {
        (this.datas = [
          { name: '张一', time: '2019-06-09', state: '已审批', type: '浪子回头浪子回头浪子回头' },
          { name: '张二', time: '2019-06-10', state: '未通过', type: '浪子回头浪子回头浪子回头' },
          { name: '张三', time: '2019-06-11', state: '已审批', type: '浪子回头浪子回头浪子回头' },
          { name: '张四', time: '2019-06-12', state: '待审批', type: '浪子回头浪子回头浪子回头' }
        ]),
          (this.isLoading = false);
      }, 500);
    },
    add() {
      this.title = '新增项目成员';
      this.addPerson = false;
      this.addPerson = true;
    },
    update() {
      this.title = '修改项目成员';
      this.addPerson = false;
      this.addPerson = true;
    },
    currentChange(value) {
      console.log(value);
    },
    remove(datas, data) {
      this.addPerson = false;
      this.addPerson = true;
      this.addPerson = false;
      datas.splice(datas.indexOf(data), 1);
    },
    confirm() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        if (this.$refs.table.getSelection().length >= 1) {
          this.$Confirm('确定删除？')
            .then(() => {
              this.$Message.success('删除成功！');
            })
            .catch(() => {
              this.$Message.error('取消删除');
            });
        }
      }
    },
    close() {
      this.addPerson = false;
    }
  }
};
</script>

