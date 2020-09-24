<template>
  <Modal v-model="a" v-bind="params">
    <div slot="header" class="title">
      新增
      <i class="h-icon-close" @click="cancel"></i>
    </div>
    <div>
      <Form :label-width="110" :mode="mode" :model="data" ref="form" :top="0.2">
        <FormItem label="任务名称" prop="param2">
          <input type="text" v-model="taskupdateModal.taskName" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="任务类型" prop="param3">
          <Select v-model="data.param3" dict="simple"></Select>
        </FormItem>
        <FormItem label="关联项目" prop="param4">
          <input type="text" v-model="data.param4" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="指派给" prop="param5">
          <input type="text" v-model="data.param5" placeholder="请输入" v-wordlimit="30" />
        </FormItem>
        <FormItem label="任务周期" prop="param6">
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
        <FormItem label="优先级">
          <SwitchList v-model="value6" :datas="params6"></SwitchList>
        </FormItem>
        <FormItem label="任务描述" prop="taginputsData">
          <RichTextEditor v-model="data.param7"></RichTextEditor>
        </FormItem>
        <FormItem label="抄送人" prop="select3Data">
          <Select v-model="data.select3Data" dict="simple" :multiple="true"></Select>
        </FormItem>
        <FormItem label="附件" ref="datapicker" prop="dateData">
          <uploadFile @getUploadId="getUploadId"></uploadFile>
          <div style="width:100% ;height:110px;margin-top: 10px;">
            <div style="width:100% ;height:80px;">
              <Uploader type="images" data-type="url" :files="images" @deletefile="deletefile"></Uploader>
            </div>
            <div>
              <span class="upload-name" v-for="(d,i) of uploadNames" :key="i">{{ d }}</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="添加之后" prop="rateData">
          <Radio v-model="value8" :datas="param8"></Radio>
        </FormItem>
        <FormItem :no-padding="true" style="text-align: right">
          <Button color="gray" @click="modalDelete">取消</Button>
          <Button color="primary" @click="modalConfirm">确定</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script>
import myamend from 'model/task/taskUpdate';
import UploadModel from 'model/upload/upload';
import uploadFile from '../../common/oa/upload_file';
export default {
  props: ['a', 'title', 'search', 'taskupdateModal'],
  components: {
    uploadFile
  },
  data() {
    return {
      value8: '1',
      param8: { 1: '继续为该需求添加任务', 2: '返回任务列表', 3: '返回需求列表' },
      value6: '1',
      params6: [
        {
          key: '1',
          title: '重要',
          icon: 'h-icon-home'
        },
        {
          key: '2',
          title: '次要',
          icon: 'h-icon-task'
        },
        {
          key: '3',
          title: '紧急',
          icon: 'h-icon-task'
        },
        {
          key: '4',
          title: '一般',
          icon: 'h-icon-users'
        }
      ],
      params: {
        closeOnMask: false
      },
      mode: 'single',
      data: {
        param2: '',
        param3: '',
        param4: '',
        param5: '',
        param6: { start: '', end: '' },
        param8: '',
        param7: '<p></p>'
      },
      isLoading: false,
      link: this.IMGURL.imgUrl,
      linkT: this.IMGURLT.imgUrlT,
      images: [],
      uploadIds: [],
      uploadNames: [],
      UploadAdd: UploadModel.parse({})
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const vm = this;
      this.data.param4 = vm.$props.select;
    },

    modalConfirm() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        this.$Loading();
        R.Maintask.myamend(myamend.dispose(this.taskupdateModal)).then(resp => {
          if (resp.ok) {
            if (this.value8 == '1') {
              setTimeout(() => {
                this.$Loading.close();
                this.$Message('保存成功');
                this.$parent.getData();
              }, 1000);
            } else {
              setTimeout(() => {
                this.$parent.close();
                this.$Loading.close();
                this.$Message('保存成功');
                this.$parent.getData();
              }, 1000);
            }
          } else {
            this.$Message('保存失败');
            this.$parent.close();
            this.$Loading.close();
            this.$parent.getData();
          }
        });
      }
    },
    modalDelete() {
      this.$Message.error('关闭');
    },
    //上傳文件
    onUpload: function(e) {
      this.taskModel.file = e.target.files[0];
      R.Upload.Upload(taskList.dispose(this.taskModel)).then(resp => {
        if (resp.ok) {
        }
      });
    },
    deletefile(file) {
      this.images.splice(file, 1);
      this.UploadAdd.ids = this.uploadIds[file];
      R.Upload.delete(UploadModel.dispose(this.UploadAdd)).then(resp => {
        if (resp.ok) {
        }
      });
      this.uploadIds.splice(file, 1);
      this.uploadNames.splice(file, 1);
    },
    getUploadId(data) {
      if (data.id.length > 10) {
        this.uploadIds.push(data.id);
        this.uploadNames.push(data.docName);
        this.$Message.success('附件上传成功');
        // console.log(data.ext);
        if (data.ext.indexOf('.doc') != -1) {
          this.images.push(this.linkT + 'doc.jpg');
        } else if (data.ext.indexOf('.xls') != -1) {
          this.images.push(this.linkT + 'xls.jpg');
        } else if (data.ext.indexOf('.jp') != -1) {
          this.images.push(this.link + data.name);
        } else if (data.ext.indexOf('.png') != -1) {
          this.images.push(this.link + data.name);
        } else {
          this.images.push(this.linkT + 'doc.jpg');
        }

        document.querySelectorAll('.name');
      } else {
        this.$Message.error('上传附件失败');
      }
    }
  }
};
</script>
<style lang="less">
.upload-name {
  width: 70px;
  vertical-align: top;
  margin-right: 10px;
  font-size: 8px;
  text-align: center;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // &:hover{
  //   overflow: visible;
  // }
}
.h-uploader-image-empty {
  display: none;
}
</style>