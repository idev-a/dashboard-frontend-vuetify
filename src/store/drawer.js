export const strict = false

export default {
  namespaced: true,
  state: {
    loading: false,
    items:[],
  },
  mutations: {
    setItems(state, payload) {
      state.items = payload
    },
  },
  actions: {
    setItems({commit}, payload) {
      commit('setItems', payload)
    },
  }
}