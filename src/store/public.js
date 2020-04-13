import  { BASE_API, updateAnswer } from '../api'
import axios from 'axios'

export const strict = false

export default {
  namespaced: true,	
  state: {
  	publicData: {},
    componentkey: 1,
    publicItem: {},
    updateAnswerDialog: false,
    uploadBtn: false,
    staticField: false,
  },
  mutations: {
  	setPublicData(state, e) {
  		state.publicData = e
  	},
    updateComponentKey(state) {
      state.componentkey += 1
    },
    setPublicItem(state, e) {
      state.publicItem = e
    },
    showUpdateAnswerDialog(state, e) {
      state.updateAnswerDialog = e
    },
    showUploadBtn(state, e) {
      state.uploadBtn = e
    },
    setStaticField(state, e) {
      state.staticField = e
    }
  },
  actions: {
  	async getPublicData({ commit }, payload) {
      let value = {}
      try {
    		const res = await axios.get(`${BASE_API}/api/public/${payload.company_id}/${payload.category}`)
    		value = {
          high: res.data.data.high,
          medium: res.data.data.medium,
          low: res.data.data.low
        };
      } catch(e) {
      }
    	
      commit('setPublicData', value);
    },

    async updateAnswer({ commit }, payload) {
      await updateAnswer(payload)
    },

    updateComponentKey({ commit }) {
      commit('updateComponentKey')
    },

    setPublicItem({ commit }, payload) {
      commit('setPublicItem', payload)
    },

    showUpdateAnswerDialog({ commit }, payload) {
      commit('showUpdateAnswerDialog', payload)
    },

    showUploadBtn({ commit }, payload) {
      commit('showUploadBtn', payload)
    },

    setStaticField({ commit }, payload) {
      commit('setStaticField', payload)
    }
  },
};