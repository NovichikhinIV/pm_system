export default class ExpensesAPI {
    static async list() {
        let response = await fetch('/api/Expenses/')
        return response;
    }

    static async create(obj) {
        let response = await fetch(`/api/Expenses/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async retrieve(id) {
        let response = await fetch(`/api/Expenses/${id}/`)
        return response;
    }

    static async update(id, obj) {
        let response = await fetch(`/api/Expenses/${id}/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        return response;
    }

    static async destroy(id) {
        let response = await fetch(`/api/Expenses/${id}/`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response;
    }

}
