import React, {useState} from 'react';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin() {

        let body = JSON.stringify({
            'username': username.toLowerCase(),
            'password': password
        })
        fetch(//url, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        .then(res => {
            if (res.ok) {
                console.log("LOGGED IN")
                return res.json();
            } else {
                throw res.json();
            }
        })
        .then (json => {
            console.log(json);
        })
    }
}
