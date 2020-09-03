export const strict = false

export default {
  namespaced: true,
  state: {
    loading: false,
    menuItems:[],
    items: [
      {
        text: 'Dashboard',
        disabled: false,
        to: 'Dashboard',
      },
      {
        text: 'Getting Started',
        disabled: true,
        to: 'Get Started',
      }
    ],
    title: 'How can we help?'
  },
  mutations: {
    setItems(state, payload) {
      state.items = payload
    },
    addItem(state, payload) {
      state.items.push(payload)
    },
    setMenuItems(state, payload) {
      state.menuItems = payload
    },
    changeTitle(state, payload) {
      state.title = payload
    }
  },
  actions: {
    setItems({commit}, payload) {
      commit('setItems', payload)
    },
    addItem({commit}, payload) {
      commit('addItem', payload)
    },
    setMenuItems({commit}, payload) {
      commit('setMenuItems', payload)
    },
    changeTitle({ commit }, payload) {
      commit('changeTitle', payload)
    }
  }
}