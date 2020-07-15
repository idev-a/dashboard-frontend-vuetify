import axios from 'axios'
require('dotenv').config()

import { DOMAIN_LIST } from './util'

export const BASE_API = process.env.VUE_APP_BACKEND_URL
// export const BASE_API = 'http://localhost:5000'
// export const BASE_API = 'https://urinotsecure.revampcybersecurity.com'

// rea
export const getCompanyId = () => {
	let user = {}
	try {
		user = JSON.parse(localStorage.getItem('user'))
	} catch(e) {}
	return user && user.company_id && user.company_id.trim() || '';
}

const getUserId = () => {
	let user = {}
	try {
		user = JSON.parse(localStorage.getItem('user'))
	} catch(e) {}
	return user && user.id || '';
}

const getAdminRole = () => {
	let user = {}
	try {
		user = JSON.parse(localStorage.getItem('user'))
	} catch(e) {}
	return user && user.role || 'Customer';
}

export const companyId = getCompanyId();
export const userId = getUserId()
export const isAdmin = getAdminRole() == 'Admin'

/* 
  API methods
*/

export const  fetchTables = async () => {
	let tables = []
	try {
    	const res = await axios({
  			url: `${BASE_API}/api/admin/query/tables`,
  			method: 'GET'
  		})
  		tables = res.data.items
    } catch (e) {
    	console.log(e.response)
    }

    return tables
}

export const fetchAllApps = async () => {
	let apps = []
	try {
    	const res = await axios({
  			url: `${BASE_API}/api/applications/all`,
  			method: 'GET'
  		})
  		apps = res.data.apps
    } catch (e) {
    	console.log(e.response)
    }

    return apps
}

export const fetchUsers = async (company_id) => {
	let users = []
	try {
    	const res = await axios({
  			url: `${BASE_API}/api/users/${company_id}/all`,
  			method: 'GET'
  		})
  		users = res.data.users
    } catch (e) {
    	console.log(e.response)
    }

    return users
}


export const fetchAllQuestions = async () => {
	let questions = []
	try {
    	const res = await axios({
  			url: `${BASE_API}/api/risks/questions/all`,
  			method: 'GET'
  		})
  		questions = res.data.questions
    } catch (e) {
    	console.log(e.response)
    }

    return questions
}


export const fetchCompanies = async () => {
	let res = await axios.get(`${BASE_API}/api/users/all`)
	res = res.data.users
	const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.company_id))
	const companies = []
	companyUsers.map(user => {
		if (!companies.includes(user.company_id)) {
			companies.push(user.company_id) 
		}
	})

	return companies
}

// fetch applications and its users 
export const fetchApps = async (company_id='') => {
	if (company_id == '') {
		company_id = companyId;
	}
  	const response = await axios.get(`${BASE_API}/api/applications/detail/${company_id}`);
  	return response.data.apps;
}

// fetch users 
export const fetchAppUsers = async (users_table_name, company_id='') => {
	if (company_id == '') {
		company_id = companyId;
	}
	const response = await axios.get(`${BASE_API}/api/users/${users_table_name}/${company_id}`)
	return response.data.users;
}

// fetch public data
export const fetchPublicData = async (companyId) => {
	const res = await axios.get(`${BASE_API}/api/public/${companyId}/data`)
    return res.data.data
}

export const updateAnswer = async (data) => {
	let value = []
	try {
		await axios({
			url: `${BASE_API}/api/public/update`,
			data: data,
			method: 'POST'
		})
		
	} catch(e) {}
}

export const deleteAnswer = async (data) => {
	return await updateAnswer(data)
}

export const createAnswer = async (data) => {
	return await updateAnswer(data)
}
