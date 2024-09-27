class Api{
    constructor() {

    }

    post(){
        
    }

    async get(url){
        let response = await fetch(url);
        let json = await response.json();
        if (response.ok) {
            return new ApiResponse(json, null);
        }
        else {
            return new ApiResponse(null, json.error);
        }
    }

    async post(url, body){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
            credentials: "include"
        })
        return response
    }

}

class ApiResponse{
    #body
    #error
    constructor( body, error) {
        this.#body = body
        this.#error = error
    }

    get body() {
        return this.#body
    }

    get error() {
        return this.#error
    }
}

export const api = new Api();
