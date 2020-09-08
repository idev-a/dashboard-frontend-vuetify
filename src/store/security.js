import  { BASE_API, Get, Post, updateAnswer } from '../api'

export const strict = false

let snackOptions = {
  status: 'danger',
  message: ''
}

export default {
  namespaced: true,
  state: {
    loading: false,
    message: '',
    color: 'success',
    snackbar: false,
    dialog: false,
    questions: [],
    answers: []
  },

  mutations: {
    setQuestions(state, payload) {
      state.questions = payload
    },
    updateQuestion(state, payload) {
      Object.assign(state.questions[payload.editedIndex], payload.editedItem)
    },
    deleteQuestion(state, payload) {
      let index = -1
      state.questions.map( (ques, idx) => {
        if (ques.id == payload.editedItem.id) {
          index = idx
        }
      })
      state.questions.splice(index, 1)
    },
    setAnswers(state, payload) {
      state.answers = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    showSnackbar(state, payload) {
      state.color = payload.status
      state.message = payload.message
      state.snackbar = true
    },
    hideSnackbar(state, payload){
      state.snackbar = false
    },
    showDialog(state, payload) {
      state.dialog = payload
    }
  },

  actions: {
    setLoading({commit}, payload = true) {
      commit('setLoading', payload)
    },

    showSnackbar({commit}, payload) {
      commit('showSnackbar', payload)
    },

    hideSnackbar({commit}, payload) {
      commit('hideSnackbar', payload)
    },

    showDialog({ commit }, payload = true) {
      commit('showDialog', payload)
    },

    async fetchQuestions({commit}, payload) {
      commit('setLoading', true)
      const res = await Get(`admin/risks/questions`)
      commit('setQuestions', res.questions)
      snackOptions = {
        status: res.status,
        message: res.message
      }

      commit('showSnackbar', snackOptions)
      commit('setLoading', false)
    },

    async updateQuestion({commit}, payload) {
        commit('setLoading', true)
        const res = await Post('admin/risks/questions/update', payload.editedItem)
        snackOptions = {
          status: res.status,
          message: res.message
        }

        commit('setLoading', false)
        commit('showDialog', false)
        commit('showSnackbar', snackOptions)
    },

    async deleteQuestion({commit}, payload) {
      commit('setLoading', true)
      const res = await Post('admin/risks/questions/delete', payload.editedItem)
      snackOptions = {
        status: res.status,
        message: res.message
      }
      commit('setLoading', false)
      commit('showSnackbar', snackOptions)
      commit('showDialog', false)
    },

    async createQuestion({commit, dispatch}, payload) {
      commit('setLoading', true)
      const res = await Post('admin/risks/questions/create', payload.editedItem) 
      snackOptions = {
        status: res.status,
        message: res.message
      }

      commit('setLoading', false)
      commit('showDialog', false)
      commit('showSnackbar', snackOptions)
    }
  }
}