import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/error/401', component: () => import('@/views/error/401'), hidden: true },
  { path: '/error/404', component: () => import('@/views/error/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '',
    component: Layout,
    name: 'Info',
    hidden: true,
    children: [{
      path: '/info',
      component: () => import('@/views/info/index')
    }]
  },
]


//实例化vue的时候只挂载constantRouter
export default new Router({
  mode: 'history',
  routes: constantRouterMap
});


//异步挂载的路由
//动态需要根据权限加载的路由表
//meta无permissions字段则不做权限控制
export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'System',
    meta: { title: '系统管理', permissions: ['admin','role'], icon: 'system' },
    children: [
      {
        path: '/admin/list',
        name: 'Admin',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员列表', permissions: ['admin'] }
      },
      {
        path: '/roles',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色列表', permissions: ['role'] }
      }
    ]
  },

  {
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'User',
    meta: { title: '用户管理', permissions: ['user'], icon: 'users' },
    children: [
      {
        path: '/user/list',
        name: 'Users',
        component: () => import('@/views/user/index'),
        meta: { title: '用户列表', permissions: ['user'] }
      }
    ]
  },

  {
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'Content',
    meta: { title: '内容管理', permissions: ['banner','about'], icon: 'content' },
    children: [
      {
        path: '/banner/list',
        name: 'Banners',
        component: () => import('@/views/banner/index'),
        meta: { title: '轮播图设置', permissions: ['banner'] }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/about/index'),
        meta: { title: '关于我们', permissions: ['about'] }
      }
    ]
  },

  {
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'Others',
    meta: { title: '其他', icon: 'others' },
    children: [
      {
        path: '/map',
        name: 'Map',
        component: () => import('@/views/others/map'),
        meta: { title: '地图' }
      }
    ]
  },
  { path: '*', redirect: '/error/404', hidden: true },
]
