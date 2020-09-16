import axios from 'axios'
import jwtDecode from 'jwt-decode'
require('dotenv').config()

import { DOMAIN_LIST } from './util'

export const BASE_API = process.env.VUE_APP_BACKEND_URL
// export const BASE_API = 'http://localhost:5000'
// export const BASE_API = 'https://urinotsecure.revampcybersecurity.com'

const getAuthToken = () => {
  return localStorage.getItem('jwt')
}

export const getIP = async () => {
  let ip = ''
  try {
    const res = await axios.get('https://www.cloudflare.com/cdn-cgi/trace')
    ip = res.data.split('ip=')[1].trim().split('ts=')[0].trim()
  } catch (e) {
    console.log(e)
  } 
  return ip
}

export const Call = async (url, method, data={}) => {
  let res = {}
  const ip = await getIP()
  try {
    res = await axios({
      url: `${BASE_API}/api/${url}`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': getAuthToken(),
        'X-IP': ip
      },
      method,
      data
    })
  } catch(err) {
    res = err.response
    if (err.response.status == 403) {
      // authentication token is expired.
      localStorage.removeItem('jwt')
      localStorage.setItem('message', err.response.data.message)
      location.href = '/pages/login'
    }
  }
  return res.data
}

export const Post = async (url, data) => {
  return await Call(url, 'POST', data)
}

export const Get = async (url) => {
  return await Call(url, 'GET')
}

export const Put = async (url, data) => {
  return await Call(url, 'PUT', data)
}

// rea
export const getCompanyId = () => {
  let user = {}
  try {
    user = jwtDecode(localStorage.getItem('jwt'))
  } catch(e) {console.log(e)}
  return user && user.company_id && user.company_id.trim() || '';
}

export const getCompanyName = () => {
  let user = {}
  try {
    user = jwtDecode(localStorage.getItem('jwt'))
  } catch(e) {console.log(e)}

  let companyName = ''
  if (user) {
    if (user.company_name && user.company_name.trim()) {
      companyName = user.company_name
    } else if (user.company_id && user.company_id.trim()) {
      companyName = user.company_id
    }
  }

  return companyName
}

export const getUserId = () => {
  let user = {}
  try {
    user = jwtDecode(localStorage.getItem('jwt'))
  } catch(e) {}
  return user && user.id || '';
}

export const getUserEmail = () => {
  let user = {}
  try {
    user = jwtDecode(localStorage.getItem('jwt'))
  } catch(e) {}
  return user && user.email || '';
}

export const getAdminRole = () => {
  let user = {}
  try {
    user = jwtDecode(localStorage.getItem('jwt'))
  } catch(e) {}
  return user && user.role || 'Customer';
}

const companyId = getCompanyId()

/* 
  API methods
*/

export const  fetchTables = async () => {
  let tables = []
  try {
      const res = await Get(`admin/query/tables`)
      tables = res.items
    } catch (e) {
      console.log(e.response)
    }

    return tables
}

export const fetchAllApps = async () => {
  let apps = []
  try {
    const res = await Get(`applications/all`)
    apps = res.apps
  } catch (e) {
    console.log(e.response)
  }

  return apps
}

export const fetchUsers = async (company_id) => {
  let users = []
  try {
    const res = await Get(`users/${company_id}/all`)
    users = res.users
  } catch (e) {
    console.log(e.response)
  }

  return users
}

export const fetchDevices = async (company_id='grove.co') => {
  let devices = []
  try {
    const res = await Get(`admin/random/gsuite_devices/${company_id}/`)
    devices = res.items
  } catch (e) {
    console.log(e.response)
  }

  return devices
}


export const fetchAllQuestions = async () => {
  let questions = []
  try {
    const res = await Get(`risks/questions/all`)
    questions = res.questions
  } catch (e) {
    console.log(e.response)
  }

  return questions
}

export const fetchCompanies = async () => {
  let res = await Get(`users/all`)
  res = res.users
  const companyUsers = res.filter(user => !DOMAIN_LIST.includes(user.company_id))
  const companies = []
  companyUsers.map(user => {
    if (user.company_id && !companies.includes(user.company_id)) {
      companies.push(user.company_id) 
    }
  })

  return companies
}

// fetch applications and its users 
export const fetchApps = async (company_id='') => {
  if (company_id == '') {
    company_id = companyId
  }
  const response = await Get(`applications/detail/${company_id}`)
  return response.apps;
}

// fetch users 
export const fetchAppUsers = async (users_table_name, company_id='') => {
  if (company_id == '') {
    company_id = companyId;
  }
  const response = await Get(`users/${users_table_name}/${company_id}`)
  return response.users;
}

// fetch public data
export const fetchPublicData = async (companyId) => {
  const res = await Get(`public/${companyId}/data`)
    return res.data
}

export const updateAnswer = async (data) => {
  let value = []
  try {
    await Post(`public/update`, data)
  } catch(e) {}
}

export const deleteAnswer = async (data) => {
  return await updateAnswer(data)
}

export const createAnswer = async (data) => {
  return await updateAnswer(data)
}

export const enableDailyTips = async () => {
  await Get('tips/daily/run')
}

export const getCompaniesUsers = async () => {
  let res = await Get('users/all')
  return res.users.map(user => user.company_id).sort()
}