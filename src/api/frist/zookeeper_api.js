export default {
    createZookeeper(zookeeperInfo) {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/init/zookeeper`, {
            method: 'POST',
            body: JSON.stringify(zookeeperInfo),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    },
}
