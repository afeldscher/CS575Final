// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
import React from "react";

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function solveBlock(parent, data, zeroes) {
    const postData = {
        max_tries: 10000000,
        block: {
            version: 0,
            parent_hash: parent,
            data: data,
            sec_since_epoc: parseInt(new Date().getTime() / 1000),
            target_zeros: zeroes,
        }
    };
    const response = await fetch('http://localhost:8080/solve', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postData),
    });
    return await response.json();
}