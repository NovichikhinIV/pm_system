export default class ItProjectAPI {
    static async list() {
        let response = await fetch('/api/ItProject/')
        return response;
    }

    static async create(obj) {
        let response = await fetch(`/api/ItProject/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async retrieve(id) {
        let response = await fetch(`/api/ItProject/${id}/`)
        return response;
    }

    static async update(id, obj) {
        let response = await fetch(`/api/ItProject/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async destroy(id) {
        let response = await fetch(`/api/ItProject/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response;
    }

}
