<template>
  <div class="app-home-vue frame-page">
    <Modal v-model="addFacePhoto" :middle="true" :hasDivider="true">
      <div slot="header" class="title">新增人脸<i @click="cancel">×</i></div>

      <div style="margin: 30px auto">
        <Form ref="form" :model="data" :top="0.2"  >
          <Qiniu :options="options" type="files" v-model="file" dragdrop>
            <div slot="dragdrop">
              <br />
              <br />
              <p class="text-center">
                <i class="icon-image gray-color" v-font="70"></i>
              </p>
              <p class="text-center">
                <button class="h-btn h-btn-blue" @click="black">点此添加图片</button>
              </p>
              <p class="text-center" v-color:gray>请上传用户正面、无遮挡照片</p>
              <p class="text-center" v-color:gray>仅支持PNG、JPG、JPEG、BVP格式，大小5M以内</p>
              <p class="text-center" v-color:gray>若图片内含多张人脸，则只注册图片中可检测到的最大脸</p>
              <br />
              <br />
              <br />
            </div>
          </Qiniu>
        </Form>
      </div>

      <div slot="footer">
        <button class="h-btn" @click="cancel">取消</button>
        <button class="h-btn h-btn-primary" @click="submit">确定</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import qiniu from 'components/common/qiniu';
export default {
  props: ['addFacePhoto'],
  data() {
    return {
      options: {
        max_file_size: '5mb'
      },
      file: [],
      data: {
        theme: null,
        num: ''
      },
      format: '',
      labelPosition: 'center'
    };
  },
  mounted() {},
  methods: {
    black() {},
    submit() {
      let validResult = this.$refs.form.valid();
      if (validResult.result) {
        R.ProjectFace.faceAdd(faceModel.dispose(this.faceSearch)).then(resp => {
          if (resp.ok) {
            this.$Message.success('保存成功');
            this.faceSearch = faceModel.parse({});
            this.$parent.close();
            setTimeout(() => {
              this.$parent.getData();
            }, 2000);
          } else {
            this.$Message.error('保存失败');
            this.faceSearch = faceModel.parse({});
            this.$parent.close();
            setTimeout(() => {
              this.$parent.getData();
            }, 2000);
          }
        });
      }
    },
    cancel() {
      this.$parent.close();
    }
  }
};
</script>

