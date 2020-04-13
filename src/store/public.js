import  { BASE_API, updateAnswer } from '../api'
import axios from 'axios'

export const strict = false

export default {
  namespaced: true,	
  state: {
  	publicData: {},
    componentkey: 1
  },
  mutations: {
  	setPublicData(state, e) {
  		state.publicData = e
  	},
    updateComponentKey(state) {
      state.componentkey += 1
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
    }
  },
};