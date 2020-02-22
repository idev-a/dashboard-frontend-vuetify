const BASE_API = 'http://34.74.44.219'

module.exports = {
  registerUser: async (data) => {
	await fetch('/api/users/register', {
      credentials: 'same-origin', // <-- includes cookies in the request
	    headers: {
	      'Content-Type': 'application/json',
	    },
	    method: 'POST',
	    body: JSON.stringify(data),
	  })
	}
}
