export default class ReportAPI {
    static async retrieve(id, userAccesToken) {
        let response = await fetch(`http://localhost:8002/api/report/${id}/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccesToken}`
            }
        })
        return response;
    }
}