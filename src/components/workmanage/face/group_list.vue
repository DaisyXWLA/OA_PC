<style lang='less'>
</style>
<template>
  <div class="table-basic-vue frame-page">
    <Row :space="9">
      <Cell>
        <div class="h-panel">
          <div class="h-panel-bar">
            用户组：
            <input type="text" v-model="groupUser" />&nbsp;&nbsp;
            <Button color="green" :circle="true" icon="h-icon-search" @click="search">搜索</Button>
            <Button color="yellow" :circle="true" icon="h-icon-refresh" @click="reset">重置</Button>
          </div>
        </div>
      </Cell>
      <Cell>
        <div class="h-panel">
          <div class="h-panel-body">
            <Button color="blue" icon="h-icon-plus" @click="add_usergroup">新增用户组</Button>
            <Button color="blue" icon="h-icon-plus" @click="add_user">新增用户</Button>
            <div style="margin-top: 10px"></div>
            <Table ref="table" :datas="datas" :loading="isLoading" checkbox>
              <TableItem :width="80" title="序号" prop="$serial"></TableItem>
              <TableItem title="人脸库名称" prop="faceName"></TableItem>
              <TableItem title="用户组/用户" prop="groupUser"></TableItem>
              <TableItem title="用户数/人脸数" prop="userCount"></TableItem>
              <TableItem title="创建时间" prop="createTime"></TableItem>
              <TableItem :width="150" prop="content" title="详情"></TableItem>
              <TableItem :width="150" prop="facephoto" title="人脸图" align="center">
                <template slot-scope="{data}" >
                  <button
                    class="h-btn h-btn-s"
                    v-bg-color:#8b04e4
                    v-color:white
                    @click="view(data)"
                  >
                    <span>
                      <i class="icon-eye" style="vertical-align: top"></i>&nbsp;查看
                    </span>
                  </button>
                </template>
              </TableItem>
              <TableItem :width="300" prop="operation" title="操作" align="center">
                <template slot-scope="{data}">
                  <button class="h-btn h-btn-s h-btn-yellow" @click="copy(data)">
                    <span>
                      <i class="icon-stack" style="vertical-align: top"></i>&nbsp;复制到
                    </span>
                  </button>
                  <button class="h-btn h-btn-s h-btn-blue" @click="move(data)">
                    <span>
                      <i class="icon-folder" style="vertical-align: top"></i>&nbsp;移动到
                    </span>
                  </button>
                  <button class="h-btn h-btn-s h-btn-red" v-color:white @click="del(data)">
                    <span>
                      <i class="icon-cross" style="vertical-align: top"></i>&nbsp;删除
                    </span>
                  </button>
                </template>
              </TableItem>
            </Table>
            <p v-height="15"></p>
            <!-- <div>
              <Pagination
                v-if="pagination.total>0"
                align="right"
                v-model="pagination"
                @change="changePage"
              />
            </div> -->
          </div>
        </div>
      </Cell>
    </Row>
    <AddUserGroup :addUserGroup="addUserGroup"></AddUserGroup>
    <AddUser :addUser="addUser"></AddUser>
    <CopyPhoto :copyimage="copyimage"></CopyPhoto>
    <MovePhoto :moveimage="moveimage"></MovePhoto>
  </div>
</template>

<script>
import addusergroup from './components/group_add';
import adduser from './components/user_add';
import copyphoto from './components/photo_copy';
import movephoto from './components/photo_move';
import faceModel from 'model/face/faceModel';
export default {
  components: {
    AddUserGroup: addusergroup,
    AddUser: adduser,
    CopyPhoto: copyphoto,
    MovePhoto: movephoto
  },
  data() {
    return {
      faceSearch: faceModel.parse({}),
      addUserGroup: false,
      addUser: false,
      copyimage: false,
      moveimage: false,
      // pagination: {
      //   page: 1,
      //   size: 10,
      //   total: 100
      // },
      checkbox: true,
      groupUser: '',
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
    clear() {
      this.$refs.table.clearRowSelect();
    },
    rowSelect(data) {
      log(data);
    },
    // getPage() {
    //   this.faceSearch.page = this.pagination.page;
    //   this.faceSearch.size = this.pagination.size;
    // },
    changePage() {
      // this.getPage();
      this.close();
    },
    search(data) {
      // this.getPage();
      this.close();
    },
    view(data) {
      this.$router.push({ name: 'face_detail', params: { Id: data.id } });
    },
    close() {
      this.addUserGroup = false;
      this.addUser = false;
      this.copyimage = false;
      this.moveimage = false;
    },
    add_usergroup() {
      this.close();
      this.addUserGroup = true;
      R.ProjectFace.faceAdd().then(resp => {
        // console.log(resp)
      })
    },
    add_user() {
      this.close();
      this.addUser = true;
    },
    copy(data) {
      this.close();
      this.copyimage = true;
    },
    move(data) {
      this.close();
      this.moveimage = true;
    },
    reset() {
      this.userGroup = '';
      this.close();
    },
    del(data) {
      this.$Confirm('确定删除？', '删除').then(() => {
        this.faceSearch.group_id = data.group_id;
        R.ProjectFace.faceGroupDelete(faceModel.dispose(this.faceSearch)).then(resp => {
          if (resp.ok) {
            this.$Message.success('刪除成功');
            setTimeout(() => {
              this.getData();
            }, 1000);
          }
        });
        this.faceSearch.user_id = data.user_id;
        R.ProjectFace.faceDeleteUser(faceModel.dispose(this.faceSearch)).then(resp => {
          if (resp.ok) {
            this.$Message.success('刪除成功');
            setTimeout(() => {
              this.getData();
            }, 1000);
          }
        });
      });
    },
    getData() {
      this.isLoading = true;
      // this.getPage();
      //获取用户组
      R.ProjectFace.faceGroupGetList(faceModel.dispose(this.faceSearch)).then(resp => {
        // if (resp.ok) {
          // console.log(resp.body);
          this.datas = resp.body;
          // this.pagination.page = resp.page;
          // this.pagination.total = resp.total;
          this.isLoading = false;
        // }
      });
    }
  }
};
</script>
