import axios from 'axios'

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
export const fetchApps = async () => {
  	const response = await axios.get(`${BASE_API}/api/applications/all/${companyId}`);
  	return response.data.apps;
}

// fetch users 
export const fetchAppUsers = async (app_name) => {
	const response = await axios.get(`${BASE_API}/api/users/${app_name}/${companyId}`)
	return response.data.users;
}

// fetch public data
export const fetchPublicData = async (companyId) => {
	const res = await axios.get(`${BASE_API}/api/public/${companyId}/data`)
    return res.data.data
}
