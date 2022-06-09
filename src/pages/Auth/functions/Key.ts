import {base64ToBin, binToBase64Url} from "./AuthUtility";

export async function encryptPass(pubKeyStr: string, password: string) {
    const pub_bytes = base64ToBin(pubKeyStr)

    const public_key = await window.crypto.subtle.importKey(
        "spki",
        pub_bytes,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );

    let enc = new TextEncoder();
    const encoded_pass = enc.encode(password);

    const encrypted_pass = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        public_key,
        encoded_pass
    );

    return binToBase64Url(new Uint8Array(encrypted_pass))
}