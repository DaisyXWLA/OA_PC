<template>
  <Modal v-model="userPower" :hasCloseIcon="hasCloseIcon" :hasDivider="hasDivider" :middle="true" :closeOnMask="closeOnMask">
    <div slot="header" class="title">
      分配权限
      <i class="h-icon-close" @click="close"></i>
    </div>
    <div :labelPosition="labelPosition">
      <div class="h-panel"></div>
      <Row :space="12">
        <Cell>
          <Checkbox
            v-model="value2"
            @change="change"
            keyName="modelCode"
            titleName="modelName"
            :datas="param3"
          ></Checkbox>
        </Cell>
        <Cell>
          <Tree
            :option="param"
            ref="demo"
            @select="select"
            v-model="value"
          ></Tree>
        </Cell>
      </Row>
    </div>
    <div slot="footer">
      <button class="h-btn" @click="close">取消</button>
    </div>
  </Modal>
</template>
<script>
import userModel from 'model/user/userModel';
import roleModel from 'model/role/roleModel';
import roleUserModel from 'model/role/roleUserModel';
export default {
  props: ['userPower', 'roleId'],
  data() {
    return {
      userList: userModel.parse({}),
      roleList: roleModel.parse({}),
      roleUserList: roleUserModel.parse({}),
      datas: [],
      param: {
        keyName: 'id',
        parentName: 'parent',
        titleName: 'modelName',
        dataMode: 'list',
        datas: []
      },
      pagination: {
        page: 1,
        size: 10,
        total: 100
      },
      // roleId: '',
      value:[],
      value2: [],
      param3: [],
      labelPosition: 'right',
      hasCloseIcon: false,
      hasDivider: true,
      isLoading: false,
      closeOnMask:false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取所有用户列表
    getData() {
      R.roleManage.modelTree().then(resp => {
        if (resp.ok) {
          this.param.datas = resp.body;
        }
      });
    },
    select(data) {
      this.roleList.modelId = data.id;
      this.roleList.roleId = this.roleId;
      R.roleManage.ModelBotten(roleModel.dispose(this.roleList)).then(resp => {
        if (resp.ok) {
          this.param3 = resp.body.botten;
          this.value2 = resp.body.list;
        }
      });
    },
    search() {
      this.getData();
      this.userList.page = this.pagination.page;
      this.userList.size = this.pagination.size;
    },
    reset() {
      this.userList.roleIds = '';
      this.userList.departmentId = '';
      this.userList.realName = '';
    },
    change(data) {
      this.roleList.roleId = this.roleId;
      this.roleList.bottenId = data.join(',');
      R.roleManage.saveroleModelBotten(roleModel.dispose(this.roleList)).then(resp => {
        if (resp.ok) {
          this.$Message.success('保存成功');
        }
      });
    },
    submit() {
      this.$Loading();
      this.roleUserList.roleId = this.roleId;
      let userIds = [];
      for (let i = 0; i < this.$refs.table.getSelection().length; i++) {
        userIds.push(this.$refs.table.getSelection()[i].id);
      }
      this.roleUserList.userIds = userIds.join(',');
      R.roleManage.roleAddUser(roleUserModel.dispose(this.roleUserList)).then(resp => {
        if (resp.ok) {
          setTimeout(() => {
            this.$parent.close();
            this.$Loading.close();
            this.$Message.success('保存成功');
            this.roleUserList = roleUserModel.parse({});
            this.$parent.getData();
          }, 1000);
        } else {
          this.$Message.error('保存失败');
          this.$parent.close();
          this.$Loading.close();
        }
      });
    },
    changePage() {
      this.getData();
    },
    close() {
      this.$parent.close();
    }
  }
};
</script>
<style lang="less">
.title {
  background: #2d7bf4;
  color: #fff;
  padding: 0 15px;
  margin-left: -15px;
}

</style>

