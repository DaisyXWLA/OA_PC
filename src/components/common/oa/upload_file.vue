<template>
  <div>
    <el-upload
      class="upload-demo"
      action="oa/api/docInfo/uploadAllFile"
      multiple
      :data="data"
      :auto-upload="true"
      :on-success="uploads"
      :on-error="uploade"
      :on-exceed="handleExceed"
      :show-file-list="false"
      :limit="limit"
      accept=".jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx"
    >
      <el-button size="mini" icon="h-icon-outbox" type="primary">&nbsp;上传</el-button>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    fruit: String
  },
  data() {
    return {
      limit: this.LIMIT.limit,
      data: {
        infoId: this.fruit
      }
    };
  },
  methods: {
    uploads(response) {
      this.$emit('getUploadId', response);
    },
    uploade(file) {},
    handleExceed(files, fileList) {
      this.$Message.success('超出附件最大上传量！');
    }
  }
};
</script>