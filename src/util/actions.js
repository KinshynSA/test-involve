let api = 'https://involve.software/test_front/api';

export async function get(u, params = {}, controller){
	let url = new URL(`${api}${u}`)
	url.search = new URLSearchParams(params).toString();
	let response = await fetch(url, {
		signal: controller?.signal
	})	

	let result = await response.json();
	return result
}

export async function post(u, body){
	let url = new URL(`${api}${u}`)

	console.log(url, body)
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(body)
	})

	let result = await response.json();
	return result
}