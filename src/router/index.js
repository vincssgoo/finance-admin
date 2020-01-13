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
export const constantRouterMap = [{
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/error/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/error/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard')
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
export const asyncRouterMap = [{
    path: '/financeMan',
    alwaysShow: true,
    component: Layout,
    redirect: '/financeMan/statistics',
    name: 'financeMan',
    meta: {
      title: '财务管理',
      icon: 'caiwu'
    },
    children: [{
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/financeMan/statistics'),
        meta: {
          title: '财务统计',
        },
      },
      {
        path: 'proof',
        name: 'Proof',
        component: () => import('@/views/financeMan/proof'),
        meta: {
          title: '凭证',
        },
        hidden: true
      },
      {
        path: 'proofOut',
        name: 'ProofOut',
        component: () => import('@/views/financeMan/proofOut'),
        meta: {
          title: '支出凭证',
        },
        hidden: true
      },
      {
        path: 'bxproof',
        name: 'Bxproof',
        component: () => import('@/views/financeMan/bxproof'),
        meta: {
          title: '报销凭证',
        },
        hidden: true
      },
      {
        path: 'new',
        name: 'New',
        component: () => import('@/views/financeMan/new'),
        meta: {
          title: '新建收入',
        },
        hidden: true
      },
      {
        path: 'newOut',
        name: 'NewOut',
        component: () => import('@/views/financeMan/newOut'),
        meta: {
          title: '新建支出',
        },
        hidden: true
      },
    ]
  },{
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'incomeManagement',
    meta: { title: '财政收入管理', permissions: ['admin','role'], icon: 'tree' },
    children: [
      {
        path: 'income',
        name: 'Income',
        component: () => import('@/views/financeMan/income'),
        meta: {
          title: '财务收入',
        }
      },{
       path: 'incomeMan',
       name: 'IncomeMan',
       component: () => import('@/views/financeMan/incomeMan'),
       meta: {
         title: '收入类型管理',
       },
       // hidden: true
     },
      {
        path: 'incomeLog',
        name: 'incomeLog',
        component: () => import('@/views/reimbursementMan/log'),
        meta: {
          title: '收入操作日志',
        },
      },
    ]
  },{
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'outcomeManagement',
    meta: { title: '财政支出管理', permissions: ['admin','role'], icon: 'tree' },
    children: [
      {
        path: 'outcome',
        name: 'Outcome',
        component: () => import('@/views/financeMan/outcome'),
        meta: {
          title: '财务支出',
        }
      },{
        path: 'outcomeMan',
        name: 'OutcomeMan',
        component: () => import('@/views/financeMan/outcomeMan'),
        meta: {
          title: '支出类型管理',
        },
        // hidden: true
      },{
        path: 'logOut',
        name: 'LogOut',
        component: () => import('@/views/reimbursementMan/log'),
        meta: {
          title: '支出操作日志',
        },
        // hidden: true
      },
    ]
  },
  {
    path: '/reimbursementMan',
    alwaysShow: true,
    component: Layout,
    redirect: '/reimbursementMan/list',
    name: 'reimbursementMan',
    meta: {
      title: '报销管理',
      icon: 'baoxiao'
    },
    children: [{
        path: 'list',
        name: 'List',
        component: () => import('@/views/reimbursementMan/list'),
        meta: {
          title: '报销申请列表',
        },
      },
      {
        path: 'handle',
        name: 'Handle',
        component: () => import('@/views/reimbursementMan/handle'),
        meta: {
          title: '处理',
        },
        hidden: true
      },
      {
        path: 'detail',
        name: 'Detail',
        component: () => import('@/views/reimbursementMan/detail'),
        meta: {
          title: '查看详情',
        },
        hidden: true
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/reimbursementMan/log'),
        meta: {
          title: '操作日志',
        }
      },
    ]
  },
  {
    path: '/reconciliationMan',
    alwaysShow: true,
    component: Layout,
    redirect: '/reconciliationMan/profitLoss',
    name: 'ReconciliationMan',
    meta: {
      title: '对账管理',
      icon: 'zhangben'
    },
    children: [{
        path: 'profitLoss',
        name: 'ProfitLoss',
        component: () => import('@/views/reconciliationMan/profitLoss'),
        meta: {
          title: '盈亏对账',
        },
      },

    ]
  },
  {
    path: '/projectMan',
    alwaysShow: true,
    component: Layout,
    redirect: '/projectMan/list',
    name: 'projectMan',
    meta: {
      title: '项目管理',
      icon: 'xiangmu'
    },
    children: [{
        path: 'list',
        name: 'List',
        component: () => import('@/views/projectMan/list'),
        meta: {
          title: '项目列表',
        },
      },
      {
        path: 'modify',
        name: 'Modify',
        component: () => import('@/views/projectMan/modify'),
        meta: {
          title: '新增、修改',
        },
        hidden: true,
      },
      {
        path: 'record',
        name: 'Record',
        component: () => import('@/views/projectMan/record'),
        meta: {
          title: '回款记录',
        },
        hidden: true,
      }, {
        path: 'newRecord',
        name: 'NewRecord',
        component: () => import('@/views/projectMan/newRecord'),
        meta: {
          title: '新增回款',
        },
        hidden: true,
      },
      {
        path: 'typeMan',
        name: 'TypeMan',
        component: () => import('@/views/projectMan/typeMan'),
        meta: {
          title: '项目类型管理',
        },
      }, {
        path: 'projReturn',
        name: 'ProjReturn',
        component: () => import('@/views/projectMan/record'),
        meta: {
          title: '项目回款',
        },
      },

    ]
  },
  {
    path: '',
    component: Layout,
    alwaysShow: true,
    name: 'System',
    meta: {
      title: '权限管理',
      permissions: ['admin'],
      icon: 'quanxian'
    },
    children: [{
      path: '/admin/list',
      name: 'Admin',
      component: () => import('@/views/admin/index'),
      meta: {
        title: '账户列表',
        permissions: ['admin']
      }
    }]
  },
  {
    path: '*',
    redirect: '/error/404',
    hidden: true
  },
]
//     path: '',
//     component: Layout,
//     alwaysShow: true,
//     name: 'System',
//     meta: {
//       title: '系统管理',
//       permissions: ['admin', 'role'],
//       icon: 'system'
//     },
//     children: [{
//         path: '/admin/list',
//         name: 'Admin',
//         component: () => import('@/views/admin/index'),
//         meta: {
//           title: '管理员列表',
//           permissions: ['admin']
//         }
//       },
//       {
//         path: '/roles',
//         name: 'Role',
//         component: () => import('@/views/role/index'),
//         meta: {
//           title: '角色列表',
//           permissions: ['role']
//         }
//       }
//     ]
//   },

//   {
//     path: '',
//     component: Layout,
//     alwaysShow: true,
//     name: 'User',
//     meta: {
//       title: '用户管理',
//       permissions: ['user'],
//       icon: 'users'
//     },
//     children: [{
//       path: '/user/list',
//       name: 'Users',
//       component: () => import('@/views/user/index'),
//       meta: {
//         title: '用户列表',
//         permissions: ['user']
//       }
//     }]
//   },

//   {
//     path: '',
//     component: Layout,
//     alwaysShow: true,
//     name: 'Content',
//     meta: {
//       title: '内容管理',
//       permissions: ['banner', 'about'],
//       icon: 'content'
//     },
//     children: [{
//         path: '/banner/list',
//         name: 'Banners',
//         component: () => import('@/views/banner/index'),
//         meta: {
//           title: '轮播图设置',
//           permissions: ['banner']
//         }
//       },
//       {
//         path: '/about',
//         name: 'About',
//         component: () => import('@/views/about/index'),
//         meta: {
//           title: '关于我们',
//           permissions: ['about']
//         }
//       }
//     ]
//   },

//   {
//     path: '',
//     component: Layout,
//     alwaysShow: true,
//     name: 'Others',
//     meta: {
//       title: '其他',
//       icon: 'others'
//     },
//     children: [{
//       path: '/map',
//       name: 'Map',
//       component: () => import('@/views/others/map'),
//       meta: {
//         title: '地图'
//       }
//     }]
//   },
//   {
//     path: '*',
//     redirect: '/error/404',
//     hidden: true
//   },
// ]
