const crypto = require('crypto').webcrypto

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

function bi1(byte_array) {
    const twos_array = Array.from(byte_array).flatMap((b) => {
        const b1 = b >>> 6
        const b2 = (b >>> 4) & 3
        const b3 = (b >>> 2) & 3
        const b4 = b & 3
        return [b1, b2, b3, b4]
    })
    let new_arr = []
    const six_entries = Math.ceil(twos_array.length/3)*3
    for (let i = 0; i < six_entries; i += 3) {
        const b1 = twos_array[i]
        const b2 = twos_array[i+1]
        const b3 = twos_array[i+2]
        const six = (b1 << 4) + (b2 !== undefined ? b2 << 2 : 0) + (b3 !== undefined ? b3 : 0)
        new_arr.push(CHARACTERS.charAt(six))
    }
    return new_arr.join('')
}

function bi2(byte_array) {
    const random_chrpts = Array.from(byte_array).map(num => {
        return String.fromCharCode(num)
    }).join('')
    return btoa(random_chrpts)
        .replaceAll("/", "_").replaceAll("+", "-").slice(0, 43)
}


const cryptoss = []

for (let i = 0; i < 100000; i++) {
    cryptoss.push(crypto.getRandomValues(new Uint8Array(32)))
}

let then = new Date();

for (let i = 0; i < 100000; i++) {
    bi2(cryptoss[i]);
}

let now = new Date();

console.log(now - then);



