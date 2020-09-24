<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            标题：
            <input type="text" v-model="informSearch.title" />&nbsp;&nbsp;
            发布人员：
            <input type="text" v-model="informSearch.creator" />&nbsp;&nbsp;
            发布时间：
            <DateRangePicker v-model="informSearch.value" :format="format" placeholder="开始 - 结束"></DateRangePicker>&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <div>
              <Button color="blue" icon="h-icon-plus" @click="add">新增</Button>
              <!-- <Button color="green" icon="h-icon-edit" @click="update">修改公告</Button> -->
              <Button v-show="deleteBtn" color="red" icon="h-icon-close" @click="del">删除</Button>
            </div>
            <div style="margin-top: 10px">
              <Table
                ref="table"
                :loading="isLoading"
                :datas="datas"
                :checkbox="checkbox"
                @select="select"
              >
                <TableItem :width="40" title="序号" prop="$serial" align="center"></TableItem>
                <TableItem :width="180" title="标题" align="left">
                  <template slot-scope="{data}">
                    <a href="#" @click="view(data)">
                      <TextEllipsis
                        :text="data.title"
                        :height="30"
                        :width="180"
                        more="..."
                        tooltipTheme="white"
                        useTooltip
                      ></TextEllipsis>
                    </a>
                  </template>
                </TableItem>
                <TableItem :width="180" title="内容" align="left">
                  <template slot-scope="{data}">
                    <TextEllipsis
                      :text="data.htmlContent"
                      :height="30"
                      :width="180"
                      more="..."
                      tooltipTheme="white"
                      useTooltip
                    ></TextEllipsis>
                  </template>
                </TableItem>
                <TableItem :width="80" prop="showType" title="提醒方式" align="left"></TableItem>
                <TableItem :width="60" prop="readerNumber" title="阅读数" align="left"></TableItem>
                <TableItem :width="80" prop="creatorName" title="发布人员" align="left"></TableItem>
                <TableItem :width="150" prop="createTime" title="发布时间" align="left"></TableItem>
                <TableItem :width="60" prop="task" title="类型" align="center">
                  <template slot-scope="{data}">
                    <div v-if="data.dataType==0">
                      <span class="h-tag h-tag-bg-blue">公告</span>
                    </div>
                    <div v-else-if="data.dataType==1">
                      <span class="h-tag h-tag-bg-yellow">通知</span>
                    </div>
                    <div v-else-if="data.dataType==2">
                      <span class="h-tag h-tag-bg-green">动态</span>
                    </div>
                    <div v-else-if="data.dataType==3">
                      <span class="h-tag h-tag-bg-red">祝福</span>
                    </div>
                    <div v-else></div>
                  </template>
                </TableItem>
                <TableItem :width="150" prop="task12" title="操作" align="center" fixed="right">
                  <template slot-scope="{data}">
                    <button
                      class="h-btn h-btn-s h-btn-blue"
                      style="vertical-align:middle"
                      @click="update(data)"
                    >
                      <i class="h-icon-edit"></i>
                      <span>编辑</span>
                    </button>
                    <DropdownMenu
                      button
                      v-color:white
                      v-bg-color:#8b04e4
                      @click="trigger"
                      @show="getOneData(data)"
                      :datas="param"
                    >更多</DropdownMenu>
                  </template>
                </TableItem>
              </Table>
              <p v-height="15"></p>
              <div>
                <Pagination
                  v-if="pagination.total>0"
                  align="right"
                  v-model="pagination"
                  @change="changePage"
                />
              </div>
            </div>
          </div>
        </div>
      </Cell>
    </Row>
    <inform :informadd="informadd"></inform>
    <InformEdit :informEdit="informEdit" ref="child"></InformEdit>
  </div>
</template>

<script>
import addnew from './components/notice_add';
import edit from './components/notice_modify';
import informList from 'model/inform/informList';
import informDel from 'model/inform/informDel';
import informFindOne from 'model/inform/informUpdate';
import axios from 'axios';
// import Ajax from '../../js/common/ajax';
export default {
  components: {
    inform: addnew,
    InformEdit: edit
  },
  data() {
    return {
      informSearch: informList.parse({}),
      informDelModel: informDel.parse({}),
      informFindOneModel: informFindOne.parse({}),
      informadd: false,
      informEdit: false,
      format: '',
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      value: {},
      checkbox: true,
      datas: [],
      serial: true,
      isLoading: false,
      params: {},
      index: 0,
      content: null,
      deleteBtn: false,
      param: [
        { title: '编辑', key: 'modify' },
        { title: '详情', key: 'detail' },
        { title: '删除', key: 'delete' }
      ],
      oneData: {}
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      document.querySelector('.h-table-fixed-header-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      document.querySelector('.h-table-fixed-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
    });
    document.addEventListener('scroll', this.winScroll, true);
  },
  methods: {
    init() {
      this.getData();
    },
    changePage() {
      this.getData(true);
      this.getPage();
    },
    search(data) {
      this.getData(true);
      this.getPage();
    },
    getPage() {
      this.informSearch.page = this.pagination.page;
      this.informSearch.size = this.pagination.size;
    },
    reset() {
      this.informSearch.title = '';
      this.informSearch.creator = '';
      this.informSearch.value = null;
    },
    resetDatepicker() {
      this.$refs.datapicker.resetValid();
    },
    close() {
      this.content = null;
      this.informadd = false;
      this.informEdit = false;
    },
    add() {
      this.close();
      this.informadd = true;
    },
    update(data) {
      this.$refs.child.getData(data.id);
      this.informEdit = true;
    },
    view(data) {
      this.$router.push({ name: 'notice_detail', params: { dataId: data.id } });
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
          this.informDelModel.ids = ids.join(',');
          R.ProjectInform.informDel(informDel.dispose(this.informDelModel)).then(resp => {
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
      this.getPage();
      R.ProjectInform.informList(informList.dispose(this.informSearch)).then(resp => {
        if (resp.ok) {
          this.datas = resp.body;
          this.pagination.page = resp.page;
          this.pagination.total = resp.total;
          this.isLoading = false;
        }
      });
    },
    //控制批量删除按钮
    select(data) {
      if (data.length > 0) {
        this.deleteBtn = true;
      } else {
        this.deleteBtn = false;
      }
    },
    trigger(data) {
      if (data == 'modify') {
        this.$refs.child.getData(this.oneData.id);
        this.informEdit = true;
      } else if (data == 'detail') {
        this.$router.push({ name: 'notice_detail', params: { dataId: this.oneData.id } });
      } else if (data == 'delete') {
        let ids = [];
        this.$Confirm('确定删除？', '删除')
          .then(() => {
            ids.push(this.oneData.id);
            this.informDelModel.ids = ids.join(',');
            R.ProjectInform.informDel(informDel.dispose(this.informDelModel)).then(resp => {
              if (resp.ok) {
                this.$Message.success('刪除成功');
                setTimeout(() => {
                  this.getData();
                }, 1000);
              }
            });
          })
          .catch(() => {
            this.$emit('close');
          });
      }
    },
    getOneData(data) {
      this.oneData = data;
    },
    winScroll() {
      if (document.querySelector('.h-table-body').scrollLeft == 0) {
        document.querySelector('.h-table-fixed-header-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
        document.querySelector('.h-table-fixed-right').style.boxShadow = '0px 0px 0px 0px rgba(0, 0, 0, 0)';
      } else {
        document.querySelector('.h-table-fixed-header-right').style.boxShadow = '-2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
        document.querySelector('.h-table-fixed-right').style.boxShadow = '-2px 0px 6px -2px rgba(0, 0, 0, 0.2)';
      }
    }
  }
};
</script>
<style lang="less" scoped>
.h-dropdowncustom.h-btn /deep/ .h-dropdowncustom-show {
  padding: 6px 10px;
  border-radius: 4px;
  vertical-align: middle;
}
/deep/ .h-dropdowncustom-show-content {
  padding-right: 14px;
}
/deep/ .h-panel-body {
  height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px);
}
/deep/ .h-table {
  max-height: calc(100vh - 60px - 45px - 30px - 30px - 72px - 18px - 25px - 25px - 50px - 32px);
  overflow: auto;
}
</style>
