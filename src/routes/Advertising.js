import React from 'react'
import { connect } from 'dva'
import { Card } from 'antd'

class Advertising extends React.Component {
  componentWillMount() {
    console.log('hahaha')
  }

  render() {
    return (
      <Card>
        <div>Advertising</div>
      </Card>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(Advertising)
