export default class SubtaskAPI {
    static async list() {
        let response = await fetch('/api/Subtask/')
        return response;
    }

    static async create(obj) {
        let response = await fetch(`/api/Subtask/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async retrieve(id) {
        let response = await fetch(`/api/Subtask/${id}/`)
        return response;
    }

    static async update(id, obj) {
        let response = await fetch(`/api/Subtask/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async destroy(id) {
        let response = await fetch(`/api/Subtask/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response;
    }

}
