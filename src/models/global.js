export default {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {
    *clearNotices({ payload }, { put, select }) {
      const count = yield select(state => state.global.notices.length)
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      })

      yield put({
        type: 'saveClearedNotices',
        payload,
      })
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      }
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      }
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      }
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      }
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search)
        }
      })
    },
  },
}
