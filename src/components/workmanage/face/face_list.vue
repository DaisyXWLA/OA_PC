<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            人脸库名称：
            <input type="text" v-model="realName" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add">新增人脸库</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :loading="isLoading" :datas="datas" :checkbox="checkbox">
              <TableItem :width="80" title="序号" prop="$serial" v-if="serial"></TableItem>
              <TableItem prop="task1" title="人脸库名称"></TableItem>
              <TableItem :width="200" prop="task2" title="编号"></TableItem>
              <TableItem prop="task3" title="创建时间"></TableItem>
              <TableItem :width="200" prop="task4" title="详情"></TableItem>
              <TableItem :width="200" prop="task12" title="操作" align="center">
                <template slot-scope="{data}">
                  <button
                    class="h-btn h-btn-s"
                    v-bg-color:#8b04e4
                    v-color:white
                    @click="userGroup(data)"
                  >
                    <span>
                      <i class="h-icon-users"></i>&nbsp;用户组
                    </span>
                  </button>
                  <button class="h-btn h-btn-s h-btn-red" v-color:white @click="del(datas,data)">
                    <span>
                      <i class="icon-cross" style="vertical-align: top"></i>&nbsp;删除
                    </span>
                  </button>
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
      </Cell>
    </Row>
    <AddFace :addface="addface"></AddFace>
  </div>
</template>

<script>
import addFace from './components/face_add';

export default {
  components: {
    AddFace: addFace
  },
  data() {
    return {
      addface: false,
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      checkbox: true,
      datas: [],
      realName: '',
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
    change(data) {},
    changePage() {
      this.getData(true);
      this.close();
    },
    search(data) {
      this.getData(true);
      this.close();
    },
    userGroup(data) {
      this.$router.push({ name: 'group_list', params: { Id: data.id } });
    },
    close() {
      this.addface = false;
      //   this.UpdateLog = false;
    },
    add() {
      this.close();
      this.addface = true;
    },
    update() {
      if (this.$refs.table.getSelection().length < 1) {
        this.$Message('请选择要编辑的数据');
      } else {
        if (this.$refs.table.getSelection().length > 1) {
          this.$Message('编辑仅支持单条数据');
        } else {
          this.close();
          this.updateLog = true;
        }
      }
    },
    reset() {
      this.realName = '';
      this.close();
    },
    view() {
      this.$router.push({ name: 'worklog_detail' });
    },

    del(datas, data) {
      datas.splice(datas.indexOf(data), 1);
      this.$Message.success('删除成功');
    },
    getData(reload = false) {
      if (reload) {
      }
      this.isLoading = true;
      setTimeout(() => {
        this.datas = [
          {
            id: 5,
            task1: '海友科伟2019年10月的日志计划',
            task2: '事假',
            task3: '海友科伟2019年10月的日志计划',
            task4: '2019-10-01',
            task5: '李拉拉',
            task6: '李拉拉'
          },
          {
            id: 5,
            task1: '海友科伟2019年10月的日志计划',
            task2: '事假',
            task3: '海友科伟2019年10月的日志计划',
            task4: '2019-10-01',
            task5: '李拉拉',
            task6: '李拉拉'
          },
          {
            id: 5,
            task1: '海友科伟2019年10月的日志计划',
            task2: '事假',
            task3: '海友科伟2019年10月的日志计划',
            task4: '2019-10-01',
            task5: '李拉拉',
            task6: '李拉拉'
          },
          {
            id: 5,
            task1: '海友科伟2019年10月的日志计划',
            task2: '事假',
            task3: '海友科伟2019年10月的日志计划',
            task4: '2019-10-01',
            task5: '李拉拉',
            task6: '李拉拉'
          },
          {
            id: 5,
            task1: '海友科伟2019年10月的日志计划',
            task2: '事假',
            task3: '海友科伟2019年10月的日志计划',
            task4: '2019-10-01',
            task5: '李拉拉',
            task6: '李拉拉'
          }
        ];
        this.isLoading = false;
      }, 1000);
    }
  }
};
</script>
