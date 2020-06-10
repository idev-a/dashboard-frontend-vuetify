import axios from 'axios'


// export const BASE_API = process.env.VUE_APP_BACKEND_URL
// export const BASE_API = 'http://localhost:5000'
export const BASE_API = 'https://urinotsecure.revampcybersecurity.com'

// rea
export const getCompanyId = () => {
	let user = {}
	try {
		user = JSON.parse(localStorage.getItem('user'))
	} catch(e) {}
	return user && user.email && user.email.split('@')[1] || '';
}

export const companyId = getCompanyId();

/* 
  API methods
*/

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
