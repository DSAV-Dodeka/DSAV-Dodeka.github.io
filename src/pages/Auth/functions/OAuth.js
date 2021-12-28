import { binToBase64Url } from "./AuthUtility"

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
    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", random_bin))
    const verifier = binToBase64Url(random_bin)
    const challenge = binToBase64Url(hash)

    return { verifier, challenge }
}