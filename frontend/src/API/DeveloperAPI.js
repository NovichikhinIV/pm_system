export default class DeveloperAPI {
    static async list() {
        let response = await fetch('/api/Developer/')
        return response;
    }

    static async create(obj) {
        let response = await fetch(`/api/Developer/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async retrieve(id) {
        let response = await fetch(`/api/Developer/${id}/`)
        return response;
    }

    static async update(id, obj) {
        let response = await fetch(`/api/Developer/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async destroy(id) {
        let response = await fetch(`/api/Developer/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response;
    }

}
