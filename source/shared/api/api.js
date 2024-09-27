class Api{
    constructor() {

    }

    post(){
        
    }

    async get(url){
        try {
            let response = await fetch(url);
            let json = await response.json();
            return json;
        } catch{
            return {error: "could not fetch"}
        }
        
    }

    async post(url, body){
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(body),
                credentials: "include"
            })
            return response.json()
        } catch {
            return {error: "could not fetch"}
        }
        
    }

}


export const API = new Api();
