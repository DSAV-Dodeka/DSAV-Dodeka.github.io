function toHex(byte_array) {
    const arr = Array.from(new Uint8Array(byte_array));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function binToBase64url(byte_array) {
    const random_chrpts = Array.from(byte_array).map((num) => {
        return String.fromCharCode(num)
    }).join('')
    return btoa(random_chrpts)
        .replaceAll("/", "_").replaceAll("+", "-")
        .replaceAll("=", "")
}

