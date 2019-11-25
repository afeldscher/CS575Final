// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function solveBlock(parent, data, zeroes, maxTries) {
    const postData = {
        max_tries: maxTries,
        block: {
            version: 0,
            parent_hash: parent,
            data: data,
            sec_since_epoc: 0,
            target_zeros: zeroes,
        }
    };
    const response = await fetch('/solve', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postData),
    });
    return await response.json();
}

export function hasLeadingZeroes(hashStr, numZeroes) {
    for(let i = 0; i < numZeroes; i++) {
        if(hashStr[i] !== '0') {
            return false;
        }
    }
    return true;
}