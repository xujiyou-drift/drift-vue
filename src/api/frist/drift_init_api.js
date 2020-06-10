
export default {
    findDriftInitData() {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/init`, {
            headers: new Headers({
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    },

    createDriftInit(driftInit) {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/init`, {
            method: 'POST',
            body: JSON.stringify(driftInit),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    },

    recordPvc(pvcRecord) {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/init/pvc`, {
            method: 'POST',
            body: JSON.stringify(pvcRecord),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    },

    completeConfig() {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/init/config`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    },

    complete() {
        return fetch(`http://${process.env.VUE_APP_BACKEND_ADDRESS}/api/init/complete`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    }
}
