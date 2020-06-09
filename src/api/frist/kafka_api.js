export default {
    createKafka(kafkaInfo) {
        return fetch("http://localhost:8000/api/init/kafka", {
            method: 'POST',
            body: JSON.stringify(kafkaInfo),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            })
        }).then(res => res.json()).catch(error => console.error('Error:', error));
    },
}
