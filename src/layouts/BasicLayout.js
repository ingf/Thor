import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Icon, Tag, message } from 'antd'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { Link, routerRedux, Route, Redirect, Switch } from 'dva/router'
import moment from 'moment'
import R from 'ramda'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'

import GlobalFooter from 'components/GlobalFooter'
import { getNavData } from 'common/nav'
import { getRouteData } from 'utils/utils'
import logo from 'assets/logo.jpg'

import styles from './BasicLayout.less'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  constructor(props) {
    super(props)
    // 把一级 Layout 的 children 作为菜单项
    this.menus = getNavData().reduce(
      (arr, current) => arr.concat(current.children),
      []
    )
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    }
  }
  getChildContext() {
    const { location } = this.props
    const routeData = getRouteData('BasicLayout')
    const menuData = getNavData().reduce(
      (arr, current) => arr.concat(current.children),
      []
    )
    const breadcrumbNameMap = {}
    routeData.concat(menuData).forEach(item => {
      breadcrumbNameMap[item.path] = item.name
    })
    return { location, breadcrumbNameMap }
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout)
  }
  onCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
        payload: {
          status: false,
        },
        callback: () => {
          this.props.dispatch(routerRedux.push('/user/login'))
        },
      })
    }
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)]
    currentMenuSelectedKeys.splice(-1, 1)
    if (currentMenuSelectedKeys.length === 0) {
      return ['/']
    }
    return currentMenuSelectedKeys
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key]
    }
    return keys
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return []
    }
    return menusData.map(item => {
      if (!item.name) {
        return null
      }
      let itemPath
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        )
      }
      const icon = item.icon && <Icon type={item.icon} />
      return (
        <Menu.Item key={item.key || item.path}>
          {/^https?:\/\//.test(itemPath) ? (
            <a href={itemPath} target={item.target}>
              {icon}
              <span>{item.name}</span>
            </a>
          ) : (
            <Link to={itemPath} target={item.target}>
              {icon}
              <span>{item.name}</span>
            </Link>
          )}
        </Menu.Item>
      )
    })
  }
  getPageTitle() {
    const { location } = this.props
    const { pathname } = location
    let title = '知乎商业化'
    getRouteData('UserLayout').forEach(item => {
      if (item.path === pathname) {
        title = `${item.name} - 知乎商业化`
      }
    })
    return title
  }
  getNoticeData() {
    const { notices = [] } = this.props
    if (notices.length === 0) {
      return {}
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice }
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow()
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status]
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        )
      }
      return newNotice
    })
    return R.groupBy('type', newNotices)
  }
  handleOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    })
  }
  toggle = () => {
    const { collapsed } = this.props
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    })
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents')
      event.initEvent('resize', true, false)
      window.dispatchEvent(event)
    }, 600)
  }
  handleNoticeClear = type => {
    message.success(`清空了${type}`)
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    })
  }
  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      })
    }
  }
  render() {
    const { collapsed } = this.props

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
          openKeys: this.state.openKeys,
        }

    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={256}
          className={styles.sider}
        >
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt="logo" />
              <h1>知乎商业化</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.menus)}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {getRouteData('BasicLayout').map(item => (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              ))}
              <Redirect to="/advertising" />
            </Switch>
            <GlobalFooter
              links={[
                {
                  title: '知乎',
                  href: 'https://zhihu.com',
                  blankTarget: true,
                },
              ]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2017 知乎商业化
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    )

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  notices: state.global.notices,
}))(BasicLayout)
