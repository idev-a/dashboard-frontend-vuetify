export const strict = false

export default {
  namespaced: true,
  state: {
    loading: false,
    items: [],
    title: 'How can we help?'
  },
  mutations: {
    setItems(state, payload) {
      state.items = payload
    },
    changeTitle(state, payload) {
      state.title = payload
    }
  },
  actions: {
    setItems({commit}, payload) {
      commit('setItems', payload)
    },
    changeTitle({ commit }, payload) {
      commit('changeTitle', payload)
    }
  }
}