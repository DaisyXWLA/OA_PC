// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import '@babel/polyfill';
import Vue from 'vue';
import App from 'components/App';

import heyuiConfig from 'js/config/heyui-config';
import routerConfig from 'js/config/router-config';
import store from 'js/vuex/store';
import 'js/vue/components';
import 'js/vue/filters';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import imgUrl from 'js/config/imgurl';
import imgUrlT from 'js/config/imgurlT';
import fileUrl from 'js/config/file';
import limit from 'js/config/limit';
import VueUeditorWrap from 'vue-ueditor-wrap'
// import 'utf8-jsp/ueditor.config.js';
// import 'utf8-jsp/ueditor.all.min.js';
// import 'utf8-jsp/lang/zh-cn/zh-cn.js';
// import 'utf8-jsp/ueditor.parse.min.js';
import Ueditor from './components/Ueditor.vue'   //百度编辑器组件
Vue.component('Ueditor', Ueditor)
import UeditorShow from './components/UeditorShow.vue'   //百度编辑器回显组件
Vue.component('UeditorShow', UeditorShow)
//打印
import Print from 'vue-print-nb';
Vue.use(Print);
Vue.use(ElementUI);
Vue.component('vue-ueditor-wrap', VueUeditorWrap)
Vue.prototype.IMGURL = imgUrl;
Vue.prototype.IMGURLT = imgUrlT;
Vue.prototype.FILEURL = fileUrl;
Vue.prototype.LIMIT = limit;
require('./css/app.less');

// 开发环境判断
// 开发环境判断
// process.env.NODE_ENV == 'development'

// 使用mock文件， 自己开发的时候请删除
require('./mock/index');

// HeyUI已经设定为全局变量，无需引用
// 设定全局变量请参考根目录下的hey.conf.js文件

heyuiConfig();
Vue.use(HeyUI);

const router = routerConfig();
const has = Vue.directive('has', {
  inserted: function (el, binding) {
    // 获取按钮权限
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});

Vue.prototype.$_has = function (value) {
  let isExit = false;
  let buttonpermsStr = Utils.getLocal2Json('botten');
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false;
  }
  for (let i = 0; i < buttonpermsStr.length; i++) {
    if (value === buttonpermsStr[i]) {
      isExit = true;
      break;
    }
  }
  return isExit;
};
export { has };
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
