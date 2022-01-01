// function toHex(byte_array) {
//     const arr = Array.from(new Uint8Array(byte_array));
//     return arr.map(b => b.toString(16).padStart(2, '0')).join('');
// }

export function binToBase64Url(byte_array) {
    const random_chrpts = Array.from(byte_array).map((num) => {
        return String.fromCharCode(num)
    }).join('')
    return btoa(random_chrpts)
        .replaceAll("/", "_").replaceAll("+", "-")
        .replaceAll("=", "")
}

export function base64ToBin(encoded_string) {
    const base64 = encoded_string.replaceAll("_", "/").replaceAll("-", "+");
    const decoded = atob(base64)
    // const bytes = new Uint8Array(decoded.length);
    // for (let i = 0; i < bytes.length; i++) {
    //     bytes[i] = decoded.charCodeAt(i);
    // }
    return new Uint8Array.from(Array.from(decoded).map((char) => {
        return char.charCodeAt(0)
    }))
}
