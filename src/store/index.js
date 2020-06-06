import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import publicdata from './public'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    drawer: null,
    connected: false,
    error: '',
    message: '',
    notifications: [],
    confirmModal: false,
    cronDialog: false
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_SCRIM (state, payload) {
      state.barColor = payload
    },
    SOCKET_CONNECT(state) {
      state.connected = true
    },
    SOCKET_DISCONNECT(state) {
      state.connected = false
    },
    SOCKET_MESSAGE(state, message) {
      state.message = message
    },
    SOCKET_NOTIFICATION(state, message) {
      state.message = message
    },
    SOCKET_ERROR(state, message) {
      state.error = message.error
    },
    ADD_NOTIFICATION (state, payload) {
      state.notifications.push(payload)
    },
    SHOW_CONFIRM_MODAL (state, payload) {
      state.confirmModal = payload
    },
    SHOW_CRON_DIALOG (state, payload) {
      state.cronDialog = payload
    }
  },
  actions: {
    addNotification({ commit }, payload) {
      commit('ADD_NOTIFICATION', payload)
    },
    showConfirm({ commit }, payload = true) {
      commit('SHOW_CONFIRM_MODAL', payload)
    },
    showCronDialog({ commit }, payload = true) {
      commit('SHOW_CRON_DIALOG', payload)
    }
  },
  modules: { 
    publicdata
  },
})
