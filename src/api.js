const BASE_API = 'http://localhost:5000'

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
