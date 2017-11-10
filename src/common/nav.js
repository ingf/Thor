import BasicLayout from 'layouts/BasicLayout'
import UserLayout from 'layouts/UserLayout'
import BlankLayout from 'layouts/BlankLayout'
import Advertising from 'routes/Advertising'
import Template from 'routes/Template'
import Users from 'routes/Users'

const data = [
  {
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '',
    component: BasicLayout,
    children: [
      {
        name: '广告位管理',
        icon: 'advertising',
        path: 'advertising',
        component: Advertising,
      },
      {
        name: 'Dashboard',
        icon: 'dashboard',
        path: 'template',
        children: [
          {
            name: '模板',
            path: 'analysis',
            component: Template,
          },
        ],
      },
      {
        name: '用户列表',
        icon: 'user',
        path: 'users',
        component: Users,
      },
    ],
  },
  {
    component: UserLayout,
    layout: 'UserLayout',
    name: '用户登录', // for breadcrumb
    path: '',
    children: [
      {
        name: '用户登录',
        icon: 'dashboard',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: Template,
          },
        ],
      },
    ],
  },
  {
    component: BlankLayout,
    layout: 'BlankLayout',
    children: {
      name: 'Goolge',
      path: 'http://google.com',
      target: '_blank',
      icon: 'book',
    },
  },
]

export function getNavData() {
  return data
}

export default data
