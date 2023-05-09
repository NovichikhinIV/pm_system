export default class SubtaskAPI {
    static async list(userAccesToken) {
        let response = await fetch(`http://localhost:8000/api/Subtask/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccesToken}`
            }
        })
        return response;
    }

    static async create(obj, userAccesToken) {
        let response = await fetch(`http://localhost:8000/api/Subtask/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccesToken}`
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async retrieve(id, userAccesToken) {
        let response = await fetch(`http://localhost:8000/api/Subtask/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccesToken}`
            }
        })
        return response;
    }

    static async update(id, obj, userAccesToken) {
        let response = await fetch(`http://localhost:8000/api/Subtask/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccesToken}`
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async destroy(id, userAccesToken) {
        let response = await fetch(`http://localhost:8000/api/Subtask/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccesToken}`
            }
        })
        return response;
    }

}
