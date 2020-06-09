export default {
    findStatus() {
        return fetch("http://localhost:8000/api/zookeeper/status", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => {
            return res.body.getReader();
        }).catch(error => console.error('Error:', error));
    },
}
