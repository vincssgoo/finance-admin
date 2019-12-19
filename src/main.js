import Vue from 'vue'

import VueAMap from 'vue-amap'; // 高德地图

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css


import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, { locale })

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: process.env.AMAP_JSAPI_KEY,
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation','AMap.Marker'],
  uiVersion: '1.0', // ui库版本，不配置不加载,
  v: '1.4.10' // 默认高德 sdk 版本为 1.4.4
});

Vue.config.productionTip = false

// 自定义上传组件
import UploadOne from '@/components/UploadOne'
Vue.component("upload-one",UploadOne);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
