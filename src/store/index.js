import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import publicdata from './public'
import security from './security'

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
    confirmCallback: null,
    cronDialog: false,
    page: Number(localStorage.getItem('page')) || 5
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
      console.log('socket', state)
      state.connected = true
    },
    SOCKET_DISCONNECT(state) {
      state.connected = false
    },
    SOCKET_MESSAGE(state, message) {
      console.log(message)
      state.message = message
    },
    SOCKET_NOTIFICATION(state, message) {
      console.log(message)
      state.message = message
    },
    SOCKET_ERROR(state, message) {
      console.log(message)
      state.error = message.error
    },
    ADD_NOTIFICATION (state, payload) {
      state.notifications.push(payload)
    },
    SHOW_CONFIRM_MODAL (state, payload) {
      state.confirmModal = payload.modal
      state.confirmCallback = payload.callback
    },
    SET_CONFIRMED(state, payload) {
      state.confirmModal = false
      if (state.confirmCallback) {
        state.confirmCallback()
      }
    },
    SHOW_CRON_DIALOG (state, payload) {
      state.cronDialog = payload
    }
  },
  actions: {
    addNotification({ commit }, payload) {
      commit('ADD_NOTIFICATION', payload)
    },
    showConfirm({ commit }, payload) {
      commit('SHOW_CONFIRM_MODAL', payload)
    },
    setConfirmed({ commit }, payload) {
      commit('SET_CONFIRMED', payload)
    },
    showCronDialog({ commit }, payload = true) {
      commit('SHOW_CRON_DIALOG', payload)
    },
    SOCKET_notification({ commit }, payload) {
      console.log('notifications', payload)
      commit('SOCKET_NOTIFICATION', payload)
    }
  },
  modules: { 
    publicdata,
    security
  },
})
