import { binToBase64url } from "./AuthUtility"

export async function computeCodeVerifier() {
    // Random value encoded as Base64url
    const random_bin = crypto.getRandomValues(new Uint8Array(32))
    const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", random_bin))
    const verifier = binToBase64url(random_bin)
    const challenge = binToBase64url(hash)

    return { verifier, challenge }
}