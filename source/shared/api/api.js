
class Api{
    #baseURl
    constructor(baseUrl) {
        this.#baseURl = baseUrl
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
            const json = await response.json();
            return json;
        } catch{
            return {error: "could not fetch"}
        }
        
    }

    async post(path, body){
        try {
            const url = this.#baseURl + path
            console.log(JSON.stringify(body))
            const response = await fetch('/signup', {
                
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify(body),
                credentials: "include"
            })
            console.log(response)
            return await response.json()
        } catch {
            return {error: "could not fetch"}
        }
        
    }

}


export const API = new Api('http://212.233.98.59:8080');
