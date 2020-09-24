    <style lang="less">
    .zdyheadertable{
        background-color: #ffffff;
        border: none;
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
    <template>
    <div class="app-home-vue frame-page">
  <Modal v-model="adddetail" :hasCloseIcon="false" :hasDivider="hasDivider" :middle="true">
    <div slot="header" class="title">{{title}}<i class="h-icon-close" @click="modalDelete"></i></div>
    <div class="h-panel-body">
      <Table :datas="datas2" :stripe="true" :loading="loading" class="zdyheadertable">
        <TableItem title="序号" prop="$serial"></TableItem>
        <TableItem title="出差天数">
          <template slot-scope="{}">
            <input type="text" v-model="value" style="width:50%"/>
          </template>
        </TableItem>
        <TableItem title="交通费">
          <template slot-scope="{}">
            <input type="text" v-model="a" style="width:50%"/>
          </template>
        </TableItem>
        <TableItem title="住宿费">
          <template slot-scope="{}">
            <input type="text" v-model="b" style="width:50%"/>
          </template>
        </TableItem>
        <TableItem title="补助">
          <template slot-scope="{}">
            <input type="text" v-model="c" style="width:50%"/>
          </template>
        </TableItem>
        <TableItem title="共计">
          <template slot-scope="{}">
            <input type="text" v-model="d" style="width:50%"/>
          </template>
        </TableItem>
      </Table>
      <div class="h-panel-body">
      <p style="float: right">共报销费用：25000</p>
      </div>
    </div>
    <div slot="footer">
      <Button @click="modalDelete">取消</Button>
      <Button color="primary" @click="modalConfirm">确定</Button>
    </div>
  </Modal>
  </div>
</template>
    <script>
export default {
  props: ['adddetail', 'title'],
  data() {
    return {
      value: '',
      a: '',
      b: '',
      c: '',
      d: '',
      datas2: [{}],
      adddetail: false,
      loading: false,
      hasDivider: true
    };
  },
  methods: {
    modalConfirm() {
      this.$Message.info('确认');
      this.adddetail = false;
    },
    modalDelete() {
      this.$Message.error('关闭');
      this.adddetail = false;
    }
  }
};
</script>