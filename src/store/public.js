import  { BASE_API, updateAnswer, Get } from '../api'
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
    		const res = await Get(`public/${payload.company_id}/${payload.category}`)
    		value = {
          high: res.data.high,
          medium: res.data.medium,
          low: res.data.low
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