import React from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'dva/router'
import DocumentTitle from 'react-document-title'
import { Icon } from 'antd'

import GlobalFooter from 'components/GlobalFooter'
import { getRouteData } from 'utils/utils'
import logo from 'assets/logo.jpg'

import styles from './UserLayout.less'

const links = [
  {
    title: '帮助',
    href: '',
  },
  {
    title: '隐私',
    href: '',
  },
  {
    title: '条款',
    href: '',
  },
]

const copyright = (
  <div>
    Copyright <Icon type="copyright" /> 商业化
  </div>
)

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }
  getChildContext() {
    const { location } = this.props
    return { location }
  }
  getPageTitle() {
    const { location } = this.props
    const { pathname } = location
    let title = '商业化'
    getRouteData('UserLayout').forEach(item => {
      if (item.path === pathname) {
        title = `${item.name} - 商业化`
      }
    })
    return title
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={logo} />
                <span className={styles.title}>商业化</span>
              </Link>
            </div>
          </div>
          {getRouteData('UserLayout').map(item => (
            <Route
              exact={item.exact}
              key={item.path}
              path={item.path}
              component={item.component}
            />
          ))}
          <GlobalFooter
            className={styles.footer}
            links={links}
            copyright={copyright}
          />
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
