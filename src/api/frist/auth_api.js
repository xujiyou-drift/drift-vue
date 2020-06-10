
export default {
    login(loginData) {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/login`, {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    }
}
