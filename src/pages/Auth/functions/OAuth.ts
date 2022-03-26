import { binToBase64Url, base64ToBin, stringToUint8 } from "./AuthUtility"
import { z } from "zod";
import config from "../config";

export function computeRandom(length=16) {
    const random_bin = crypto.getRandomValues(new Uint8Array(length))
    const encoded_bin = binToBase64Url(random_bin)
    return { encoded_bin, random_bin }
}

export async function encodedHashBin(random_bin: Uint8Array) {
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

export function decodeJwtPayload(jwt: string) {
    const payload = jwt.split('.')[1]
    const bin_payload = base64ToBin(payload)
    return new TextDecoder().decode(bin_payload);
}

const idTokenJson = z.object({
    sub: z.string(),
    iss: z.string(),
    aud: z.array(z.string()),
    auth_time: z.number(),
    nonce: z.string(),
    iat: z.number(),
    exp: z.number()
})

export function parseIdToken(jwt_json: string) {
    const jwt_obj = JSON.parse(jwt_json)
    return idTokenJson.parse(jwt_obj)
}

export async function validateIdToken(id_json: string) {
    const id_payload = parseIdToken(id_json)

    const nonce_original = localStorage.getItem("nonce_original")
    if (nonce_original === null) {
        return
    }
    const nonce_bin = base64ToBin(nonce_original)
    const nonce_hash = await encodedHashBin(nonce_bin)

    let web_included = false
    id_payload.aud.forEach(aud => {
        if (aud === config.client_id) {
            web_included = true
        }
        else if (aud !== config.client_id) {
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

export async function handleTokenResponse(token_res: any) {
    const {
        id_token, access_token, refresh_token, token_type, expires_in, scope
    } = token_res

    if (token_type !== "Bearer") {
        console.log("Incorrect token_type!")
    }

    if (expires_in === "x") {

    }
    if (scope === "scope") {

    }
    try {
        const id_payload = await validateIdToken(decodeJwtPayload(id_token))
        localStorage.setItem("access_expiry", expires_in.toString())
        localStorage.setItem("access", access_token)
        localStorage.setItem("refresh", refresh_token)
        localStorage.setItem("id_payload", JSON.stringify(id_payload))
        return true
    }
    catch (e) {
        if (e instanceof Error) {
            console.log(e.message)
        } else {
            console.log(e)
        }
    }
}