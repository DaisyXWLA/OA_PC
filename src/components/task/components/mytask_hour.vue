<style lang="less">
/**修改弹框默认样式 */
.h-modal .h-notify-container .h-modal-header,
.h-modal .h-notify-container header:first-child {
  background: #2d7bf4;
  color: #fff;
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
  <Modal v-model="ball" :closeOnMask="closeOnMask">
    <div slot="header" class="title">
      工时
      <i class="h-icon-close" @click="modalDelete" style="padding-right:15px"></i>
    </div>
    <div class="h-panel-body">
      <Table :datas="datas2">
        <TableItem title="序号" prop="$serial"></TableItem>
        <TableItem title="日期" align="center">
          <template slot-scope="{}">
            <DatePicker v-model="value" type="datehour" :option="param"></DatePicker>
          </template>
        </TableItem>
        <TableItem title="工时" align="center">
          <template slot-scope="{}">
            <input type="text" v-model="taskModel.useHours" @mouseleave="leave" style="width:65%" />
          </template>
        </TableItem>
        <TableItem title="剩余" align="center">
          <template slot-scope="{}">
            <input type="text" v-model="b" style="width:40%" readonly />
          </template>
        </TableItem>
        <TableItem title="备注" align="center">
          <template slot-scope="{}">
            <input type="text" v-model="c" style="width:90%" />
          </template>
        </TableItem>
      </Table>
    </div>
    <div slot="footer">
      <Button @click="modalDelete">取消</Button>
      <Button ref="confirmBtn" color="primary" @click="modalConfirm">确定</Button>
    </div>
  </Modal>
</template>
    <script>
import taskList from 'model/task/taskList';
export default {
  props: ['ball'],
  data() {
    return {
      taskModel: taskList.parse({}),
      value: '',
      a: '',
      b: '',
      c: '',
      param: {
        start: '',
        end: ''
      },
      datas2: [{}],
      loading: false,
      userId: '',
      closeOnMask: false
    };
  },
  mounted() {},
  methods: {
    getTime(time, userd) {
      this.param.end = time;
      this.userId = userd;
      this.value = this.getNewDate() + ' 00:00';
    },
    leave() {
      if(!(/(^[1-9]\d*$)/.test(this.taskModel.useHours))){
        this.$Message('工时格式不正确，请重新输入');
        // this.$refs.confirmBtn.disabled=true;
      }else{
        // this.$refs.confirmBtn.disabled=false;
        this.taskModel.id = this.userId;
        R.Maintask.showHour(taskList.dispose(this.taskModel)).then(resp => {
          if (resp.ok) {
            if (resp.body == '工时超时') {
              this.$Message.error(resp.body);
            } else {
              if (resp.body == '请输入消耗时间') {
                // this.taskModel.useHours = resp.body;
              } else {
                this.b = resp.body;
              }
            }
          }
        });
      }
    },
    getNewDate() {
      var date = new Date();
      var seperator1 = '-';
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var hour=date.getHours();
      var minute=date.getMinutes();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour;
      }
      if (minute >= 0 && minute <= 9) {
        minute = '0' + minute;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate + " "+hour+":"+minute;
      return currentdate;
    },
    modalConfirm() {
      this.taskModel.id = this.userId;
      if (this.b == '' && this.b != 0) {
        this.$Message.error('消耗不能为空');
      } else {
        if (this.taskModel.useHours == '') {
          this.$Message.error('工时不能为空');
        } else {
          R.Maintask.hour(taskList.dispose(this.taskModel)).then(resp => {
            if (resp.ok) {
              if (resp.body == '保存成功') {
                setTimeout(() => {
                  this.taskModel.useHours = '';
                  this.b = '';
                  this.$parent.close();
                  this.$Message.success(resp.body);
                  this.$parent.getData();
                }, 1000);
              } else {
                this.$Message(resp.body);
                this.$parent.close();
              }
            } else {
              this.$parent.close();
            }
          });
        }
      }
    },
    modalDelete() {
      this.$parent.close();
    }
  }
};
</script>