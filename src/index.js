import dva from 'dva'
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
import { message } from 'antd'
import models from 'models'

import './index.css'

const ERROR_MSG_DURATION = 3 // 3 秒

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION)
  },
})

// 2. Plugins
app.use(createLoading())

// 3. Model move to router
models.forEach(m => {
  app.model(m)
})

// 4. Router
app.router(require('./router'))

// 5. Start
app.start('#root')
