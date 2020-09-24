
<template>
  <Modal v-model="addUser" :middle="true" :hasDivider="true" v-bind="params">
    <div slot="header" class="title">
      新增用户
      <i @click="cancel">×</i>
    </div>
    <div :labelPosition="labelPosition" style="margin-top:10px">
      <Form
        ref="form"
        :model="faceSearch"
        :label-width="110"
        :top="0.2"
        :rules="validationRules"
         
      >
        <FormItem label="用户组：" prop="groupUser">
          <Select
            v-model="faceSearch.groupUser"
            keyName="groupUser"
            titleName="groupUser"
            :datas="allGroup"
          ></Select>
        </FormItem>
        <FormItem label="用户：" prop="user_id">
          <input
            type="text"
            v-model="faceSearch.user_id"
            style="width:500px"
            placeholder="由数字、字母下划线组成"
          />
        </FormItem>
        <!-- <textarea v-model="Image">
                 <p class="text-center">
                <i class="icon-image gray-color" v-font="70"></i>
              </p>
              <p class="text-center">
                <button class="h-btn h-btn-blue" @click="addPhoto" type="file">点此添加图片</button>
              <a class="add"><i class="iconfont icon-plus"></i><p>点击上传</p></a>
              </p>
              <p class="text-center" v-color:gray>请上传用户正面、无遮挡照片</p>
              <p class="text-center" v-color:gray>仅支持PNG、JPG、JPEG、BVP格式，大小5M以内</p>
              <p class="text-center" v-color:gray>若图片内含多张人脸，则只注册图片中可检测到的最大脸</p>
        </textarea>-->
        <div id="showImage" style="border:1px dotted gray;">
          <!-- <Qiniu :options="options" type="image" v-model="file" data-type="url"> -->
          <div style="margin:15% auto;">
            <p class="text-center">
              <i class="icon-image gray-color" v-font="70" ref="picPlace"></i>
            </p>
            <p class="text-center">
              <input id="upload-img" accept="image/*" type="file" class="upload-Img" @change="changepic"
                ref="inputer"/>
              <img :src="src" id="show" width="200">
              <label
                for="upload-img"
                class="upload h-btn h-btn-blue"
                ref="lab"
              >上传图片</label>
              <!-- <button class="h-btn h-btn-blue" @click="addPhoto" type="file">点此添加图片</button> -->
            </p>
            <div ref="txt">
              <p class="text-center" v-color:gray>请上传用户正面、无遮挡照片</p>
              <p class="text-center" v-color:gray>仅支持PNG、JPG、JPEG、BVP格式，大小5M以内</p>
              <p class="text-center" v-color:gray>若图片内含多张人脸，则只注册图片中可检测到的最大脸</p>
            </div>
          </div>
        </div>
      </Form>
    </div>
    <div slot="footer">
      <button class="h-btn" @click="cancel">取消</button>
      <button class="h-btn h-btn-primary" @click="submit">确定</button>
    </div>
  </Modal>
</template>
<script>
import faceModel from 'model/face/faceModel';
function getFileUrl(obj) {
  let url;
  url = window.URL.createObjectURL(obj.files.item(0));
  return url;
}
export default {
  name: 'showImage',
  props: ['addUser'],
  data() {
    return {
      faceSearch: faceModel.parse({}),
      Image: '',
      file: null,
      allGroup: [],
      validationRules: {
        required: ['groupUser', 'user_id']
      },
      params: {
        closeOnMask: false,
        hasDivider: true
      },
      labelPosition: 'right',
      src:''
    };
  },
  components: {
    // Qiniu: qiniu
  },
  mounted() {
    // R.ProjectFace.faceGroupGetList(faceModel.dispose(this.faceSearch)).then(resp => {
    //   let all = new Array();
    //   if (resp.ok) {
    //     this.allGroup = resp.body;
    //   }
    // })
  },
  methods: {
    addPhoto() {},
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
    changepic(e) {
        let _this = this
        var files = e.target.files[0]
        if (!e || !window.FileReader) return  // 看支持不支持FileReader
        let reader = new FileReader()
        reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
        reader.onloadend = function () {
          _this.src = this.result
        }
        //判断是否上传了图片
        if(this.$refs.inputer.files.length>0){
          this.$refs.picPlace.style.display='none'
          this.$refs.txt.style.display='none'
          this.$refs.lab.style.display='none'
        }
    },
    cancel() {
      this.$parent.close();
    },
    //图片的base64格式编码转换为二进制，baseurl：图片base64的格式编码
    binarySystem(baseurl) {
      let arr = baseurl.split(',');
      baseurl = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      let nameImg = [];
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
        nameImg.push(bstr.charCodeAt(n));
      }
      return nameImg;
    }
  }
};
</script>
<style scoped>
.upload-Img {
  opacity: 0;
  position:absolute;clip:rect(0 0 0 0);
}
</style>>


