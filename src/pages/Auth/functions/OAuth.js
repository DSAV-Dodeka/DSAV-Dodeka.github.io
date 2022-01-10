import { binToBase64Url, base64ToBin, stringToUint8 } from "./AuthUtility"

export function computeRandom(length=16) {
    const random_bin = crypto.getRandomValues(new Uint8Array(length))
    const encoded_bin = binToBase64Url(random_bin)
    return { encoded_bin, random_bin }
}

export async function encodedHashBin(random_bin) {
    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", random_bin))
    return binToBase64Url(hash)
}

export async function computeCodeVerifier() {
    // Random value encoded as Base64url
    const random_bin = crypto.getRandomValues(new Uint8Array(32))
    const verifier = binToBase64Url(random_bin)
    const asciiBinary = stringToUint8(verifier)
    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", asciiBinary))

    const challenge = binToBase64Url(hash)

    return { verifier, challenge }
}

export function decodeJwtPayload(jwt) {
    const payload = jwt.split('.')[1]
    const bin_payload = base64ToBin(payload)
    return new TextDecoder().decode(bin_payload);
}

export function parseIdToken(jwt_json) {
    const {
        sub,
        iss,
        aud,
        auth_time,
        nonce,
        iat,
        exp
    } = JSON.parse(jwt_json)
    return {
        sub,
        iss,
        aud,
        auth_time,
        nonce,
        iat,
        exp
    }
}

export async function validateIdToken(id_json) {
    const id_payload = parseIdToken(id_json)

    const nonce_original = localStorage.getItem("nonce_original")
    const nonce_bin = base64ToBin(nonce_original)
    const nonce_hash = await encodedHashBin(nonce_bin)

    let web_included = false
    id_payload.aud.forEach(aud => {
        if (aud === "dodekaweb_client") {
            web_included = true
        }
        else if (aud !== "dodekaweb_client") {
            throw new Error("Invalid audience!")
        }
    })
    if (!web_included) {
        throw new Error("Required audience not included!")
    }
    if (id_payload.nonce !== nonce_hash) {
        throw new Error("Invalid nonce!")
    }

    return id_payload
}