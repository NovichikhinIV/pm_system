export default class AuthAPI {

    static async registration(obj) {
        let response = await fetch('http://localhost:8001/api/registration/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(obj)
        })
        return response;
    }

    static async token(obj) {
        let response = await fetch('http://localhost:8001/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(obj)
        })
        return response;
    }

    static async tokenRefresh(obj) {
        let response = await fetch('http://localhost:8001/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(obj)
        })
        return response;
    }
}