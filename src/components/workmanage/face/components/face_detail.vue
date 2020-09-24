<style lang='less'>
</style>

<template>
  <div class="app-form frame-page">
    <div class="h-panel">
      <div class="h-panel-body">
        <Button color="blue" icon="h-icon-plus" @click="add">新增人脸</Button>
        <div>
          <p>
            <ImagePreview
              data-s="https://lokeshdhakar.com/projects/lightbox2/images/image-4.jpg"
              @click="openPreview1"
              :width="200"
            />
          </p>
          <p v-height="400"></p>
        </div>
        <br />
        <br />
      </div>
      <AddFacePhoto :addFacePhoto="addFacePhoto"></AddFacePhoto>
    </div>
  </div>
</template>

<script>
import { write } from 'fs';
import addfacephoto from './face_add';
import faceModel from 'model/face/faceModel';
export default {
  components: {
    AddFacePhoto: addfacephoto
  },
  data() {
    const link = 'https://lokeshdhakar.com/projects/lightbox2/images/';
    return {
      faceSearch: faceModel.parse({}),
      addFacePhoto: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getData();
    },
    add() {
      this.close();
      this.addFacePhoto = true;
    },
    close() {
      this.addFacePhoto = false;
    },
    getData(Id) {
      R.ProjectFace.faceGetList(faceModel.dispose(this.faceSearch)).then(resp => {
        // if (resp.ok) {
          this.datas = resp.body;
      });
    },
    openPreview1(data) {
      this.$ImagePreview(data);
    },
    currentChange(value) {
      console.log(value);
    }
  }
};
</script>

