<template>
  <div>
    <vue-ueditor-wrap v-model="content" :config="myConfig" @beforeInit="addCustomButtom"></vue-ueditor-wrap>
  </div>
</template>

<script>
// import common from '../api/common.js'; //这个common.js文件是自己写的，里面是接口地址，文件内容是export default{base:'http://localhost/apis',}
import '../UEditor/ueditor.config.js';
import '../UEditor/ueditor.all.js';
import '../UEditor/lang/zh-cn/zh-cn.js';
import VueUeditorWrap from 'vue-ueditor-wrap';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: 'Ueditor',
  components: {
    VueUeditorWrap
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    myConfig: {
      type: Object,
      default: () => ({
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 300,
        // 初始容器宽度
        initialFrameWidth: '100%'
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        // UEDITOR_HOME_URL: '/static/UEditor/'
      })
    }
  },
  data() {
    return {
      //   uploadBase: `${common.base}/uploadimg`, //图片上传地址
      dialogVisible: false,
      imageList: [],
      editorHandler: null,
      content: this.value,
      readonly: true,
      imageUrl: '', //upload框里图片的url
      loading: false, //图片上传加载
      contentImg: '' //转换过后的url链接
    };
  },
  watch: {
    value(newValue) {
      this.content = newValue;
    },
    content(newValue) {
      this.$emit('input', newValue);
    }
  },
  methods: {
    addCustomButtom(editorId) {
      let _this = this;
      window.UE.registerUI(
        'test-button',
        function(editor, uiName) {
          // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
          editor.registerCommand(uiName, {
            execCommand: () => {
              _this.imageList = [];
              _this.dialogVisible = true;
              _this.editorHandler = editor;
              //editor.execCommand('inserthtml', `<span>这是一段由自定义按钮添加的文字</span>`)
            }
          });

          // 创建一个 button
          var btn = new window.UE.ui.Button({
            // 按钮的名字
            name: uiName,
            // 提示
            title: '鼠标悬停时的提示文字',
            // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
            cssRules: 'background-position: -380px 0;',
            // 点击时执行的命令
            onclick: function() {
              // 这里可以不用执行命令，做你自己的操作也可
              editor.execCommand(uiName);
            }
          });

          // 当点到编辑内容上时，按钮要做的状态反射
          editor.addListener('selectionchange', function() {
            var state = editor.queryCommandState(uiName);
            if (state === -1) {
              btn.setDisabled(true);
              btn.setChecked(false);
            } else {
              btn.setDisabled(false);
              btn.setChecked(state);
            }
          });
          // 因为你是添加 button，所以需要返回这个 button
          return btn;
        },
        47 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */,
        editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */
      );
    }
  }
};
</script>

<style scoped>
.uploadContent {
  width: 100%;
  text-align: center;
}
.uploader {
  display: inline-block;
}
.personImg {
  width: 200px;
}
</style>

// 4、在main.js中全局注册组件
// import Ueditor from './components/Ueditor.vue'   //百度编辑器组件
// Vue.component('Ueditor',Ueditor)

// 5、使用
// <Ueditor v-model="intro"></Ueditor>

// 6、修改编辑器css样式，使其更加美观，在static/UEditor/themes/default/css/ueditor.css里添加以下代码

// .edui-default.edui-editor-toolbarbox{
//     box-shadow: none!important;
// }
// .edui-default.edui-editor-toolbarboxouter{
//     background-image:-webkit-linear-gradient(top,#fff,#fff)!important;
//     box-shadow:none!important;
// }
// .edui-default.edui-editor{
//     border-radius: 0!important;
// }