import  { BASE_API, updateAnswer } from '../api'
import axios from 'axios'

export const strict = false

let color = 'danger',
	message = ''

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
			try {
		    	const data = await axios.get(`${BASE_API}/api/admin/risks/questions`)
		    	commit('setQuestions', data.data.questions)
		    	color = data.data.status
		    	message = data.data.message
	    	} catch(e) {
	    		console.log(e.response)
		    	message = e.response
	    	} 

	    	commit('showSnackbar', {
	    		color, 
	    		message
	    	})
			commit('setLoading', false)
		},

		async updateQuestion({commit}, payload) {
  			commit('setLoading', true)
	    	try {
		    	const data = await axios({
	      			url: `${BASE_API}/api/admin/risks/questions/update`,
	      			data: payload.editedItem,
	      			method: 'POST'
	      		})
      			color = data.data.status
		    	message = data.data.message
		    	if (data.data.status == 'success') {
		    		commit('updateQuestion', payload)
		    	}
	    	} catch(e) {
	    		message = 'Something wrong happened on the server.'
	    	} 

	    	commit('setLoading', false)
	    	commit('showDialog', false)
	    	commit('showSnackbar', {
	    		color, 
	    		message
	    	})
		},

		async deleteQuestion({commit}, payload) {
			commit('setLoading', true)
			try {
		    	const data = await axios({
	      			url: `${BASE_API}/api/admin/risks/questions/delete`,
	      			data: payload.editedItem,
	      			method: 'POST'
	      		})
      			color = data.data.status
		    	message = data.data.message
      			if (data.data.status == 'success') {
      				commit('deleteQuestion', payload)
      			}
	    	} catch(e) {
	    		message = 'Something wrong happened on the server.'
	    	}
	    	commit('setLoading', false)
	    	commit('showSnackbar', {
	    		color, 
	    		message
	    	})
	    	commit('showDialog', false)
		},

		async createQuestion({commit, dispatch}, payload) {
			commit('setLoading', true)
	    	try {
		    	const data = await axios({
	      			url: `${BASE_API}/api/admin/risks/questions/create`,
	      			data: payload.editedItem,
	      			method: 'POST'
	      		})
      			color = data.data.status
		    	message = data.data.message
		    	if (data.data.status == 'success') {
		    		dispatch('fetchQuestions', payload)
		    	}
	    	} catch(e) {
	    		message = 'Something wrong happened on the server.'
	    	} 

	    	commit('setLoading', false)
	    	commit('showDialog', false)
	    	commit('showSnackbar', {
	    		color, 
	    		message
	    	})
		}
	}
}