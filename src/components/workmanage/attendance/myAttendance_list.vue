<style lang='less'>
.custom-dropdown-7 {
  background: #3c84f5;
  color: #fff;
  border-radius: 5px;
  :hover {
    color: #fff;
  }
}
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            打卡日期：
            <DatePicker v-model="myAttSearch.createTime" :format="format"></DatePicker>&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div>
              <Button color="red" icon="h-icon-close" @click="del" v-has="'myAttendancedelete'">删除</Button>
            </div>
            <div style="margin-top: 10px">
              <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="checkbox">
                <TableItem :width="80" title="序号" prop="$serial" v-if="serial" align="center"></TableItem>
                <TableItem :width="100" prop="userName" title="姓名" align="center"></TableItem>
                <TableItem :width="100" prop="dept" title="部门" align="center">
                   <template slot-scope="{data}">
                    <div v-if="data.department==1">
                      <span>软件部</span>
                    </div>
                    <div v-else-if="data.attType==2">
                      <span>集成部</span>
                    </div>
                    <div v-else-if="data.attType==3">
                      <span>财务部</span>
                    </div>
                    <div v-else></div>
                  </template>
                </TableItem>
                <TableItem prop="attrTime" title="打卡日期" align="center"></TableItem>
                <TableItem prop="startAttrTime" title="上班打卡时间" align="center"></TableItem>
                <TableItem prop="endAttrTime" title="下班打卡时间" align="center"></TableItem>
                <TableItem :width="150" prop="task" title="考勤状态" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.attType==4">
                      <span class="h-tag h-tag-bg-blue">出差</span>
                    </div>
                    <div v-else-if="data.attType==1">
                      <span class="h-tag h-tag-bg-green">迟到</span>
                    </div>
                    <div v-else-if="data.attType==5">
                      <span class="h-tag h-tag-bg-yellow">旷工</span>
                    </div>
                    <div v-else-if="data.attType==3">
                      <span class="h-tag h-tag-bg-red">请假</span>
                    </div>
                    <div v-else-if="data.attType==0">
                      <span class="h-tag h-tag-bg-blue">正常</span>
                    </div>
                    <div v-else-if="data.attType==2">
                      <span class="h-tag h-tag-bg-yellow">早退</span>
                    </div>
                     <div v-else-if="data.attType==-1">
                      <span class="h-tag h-tag-bg-gray">未打卡</span>
                    </div>
                  </template>
                </TableItem>
                <TableItem :width="100" prop="task12" title="操作" align="center">
                  <template slot-scope="{data}">
                    <DropdownMenu
                      button
                      :datas="param"
                      @onclick="show(data)"
                      @click="add"
                      class="custom-dropdown-7"
                      v-has="'myAttendanceoperation'"
                    >
                      <span>操作</span>
                    </DropdownMenu>
                  </template>
                </TableItem>
              </Table>
              <p v-height="15"></p>
              <Pagination
                v-if="pagination.total>0"
                align="right"
                v-model="pagination"
                @change="changePage"
              />
            </div>
          </div>
        </div>
      </Cell>
    </Row>
    <Recording :recordingAdd="recordingAdd" ref="child"></Recording>
    <!-- <Leave :leave="leave" :title="title" ref="child"></Leave> -->
    <AddOvertime :addOvertime="addOvertime" :title="title"></AddOvertime>
  </div>
</template>
<script>
import recording from './components/recording_add';
import myAttModel from 'model/att/attModel';
import Leave from '../leave/components/leave_add';
import addovertime from '../overtime/components/overtime_add';
import axios from 'axios';
export default {
  components: {
    Recording: recording,
    Leave: Leave,
    AddOvertime: addovertime,
  },
  data() {
    return {
      myAttSearch: myAttModel.parse({}),
      recordingAdd: false,
      leave: false,
      addOvertime: false,
      param: [
        { title: '补录', key: '1' },
        { title: '请假', key: '2' },
        { title: '加班', key: '3' },
        { title: '调休', key: '4' },
        { title: '出差', key: '5' },
        { title: '外出', key: '6' }
      ],
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      title: '',
      format: '',
      checkbox: true,
      datas: [],
      serial: true,
      isLoading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    changePage() {
      this.getData(true);
      this.getPage();
    },
    getPage() {
      this.myAttSearch.page = this.pagination.page;
      this.myAttSearch.size = this.pagination.size;
    },
    search(data) {
      this.getData(true);
      this.getPage();
    },
    reset() {
      this.myAttSearch.createTime = '';
      this.close();
    },
    close() {
      this.recordingAdd = false;
      this.leave = false;
      this.addOvertime = false;
    },
    show(data) {
      this.$refs.child.getData(data.id);
      // console.log(data.id);
      
    },
    add(code) {
      this.close();
      if (code == '1') {
        this.recordingAdd = true;
      } else if (code == '2') {
        this.leave = true;
        this.title = '请假';
      } else if (code == '3') {
        this.addOvertime = true;
        this.title = '加班';
      }
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    del() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要删除的数据');
      } else {
        let ids = new Array();
        this.$Confirm('确定删除？', '删除').then(() => {
          for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
            ids.push(this.$refs.table.getSelection()[i].id);
          }
          this.myAttSearch.ids = ids.join(',');
          R.ProjecetMyAtt.attDel(myAttModel.dispose(this.myAttSearch)).then(resp => {
            if (resp.ok) {
              this.$Message.success('刪除成功');
              setTimeout(() => {
                this.getData();
              }, 1000);
              this.close();
            }
          });
        });
      }
    },
    getData() {
      this.isLoading = true;
      this.myAttSearch.page = this.pagination.page;
      this.myAttSearch.size = this.pagination.size;
      R.ProjecetMyAtt.myAttList(myAttModel.dispose(this.myAttSearch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          this.isLoading = false;
        }
      });
    }
  }
};
</script>