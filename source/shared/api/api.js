class Api{
    #baseURl
    constructor() {
        this.#baseURl = 'http://212.233.98.59:8080'
    }

    post(){
        
    }

    async get(path){
        try {
            const url = this.#baseURl + path
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Credentials': true,
                },
                credentials: 'include',
            });
            console.log(response)
            const json = await response.json();
            return json;
        } catch{
            return {error: "could not fetch"}
        }
        
    }

    async post(path, body){
        try {
            const url = this.#baseURl + path
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(body),
                credentials: "include"
            })
            return await response.json()
        } catch {
            return {error: "could not fetch"}
        }
        
    }

}


export const API = new Api();
