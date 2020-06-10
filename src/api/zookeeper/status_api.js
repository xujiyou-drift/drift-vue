export default {
    findStatus() {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/zookeeper/status`, {
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
