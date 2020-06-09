
export default {
    login(loginData) {
        return fetch("http://localhost:8000/login", {
            method: 'POST',
            body: JSON.stringify(loginData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    }
}
