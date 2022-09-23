import { binToBase64Url, base64ToBin, stringToUint8 } from "./AuthUtility"
import {string, z} from "zod";
import config from "../../../config";
import {NormalizedOptions} from "ky/distribution/types/options";

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

const IdToken = z.object({
    sub: z.string(),
    iss: z.string(),
    aud: z.array(z.string()),
    auth_time: z.number(),
    nonce: z.string(),
    iat: z.number(),
    exp: z.number()
})
export type IdToken = z.infer<typeof IdToken>

export function parseIdToken(jwt_json: string): IdToken {
    const jwt_obj = JSON.parse(jwt_json)
    return IdToken.parse(jwt_obj)
}

export class TokenError extends Error {
    error_type: string
    constructor(error_type: string, desc: string) {
        super(desc)
        this.error_type = error_type
    }
}

export async function validateIdToken(id_json: string): Promise<IdToken> {
    let id_payload: IdToken
    try {
        id_payload = parseIdToken(id_json)
    } catch (e) {
        throw new TokenError("invalid_id_token", "Error parsing ID token!")
    }

    const nonce_original = localStorage.getItem("nonce_original")
    if (nonce_original === null) {
        throw new TokenError("no_nonce", "No ID token nonce set!")
    }
    const nonce_bin = base64ToBin(nonce_original)
    const nonce_hash = await encodedHashBin(nonce_bin)

    let web_included = false
    id_payload.aud.forEach(aud => {
        if (aud === config.client_id) {
            web_included = true
        }
        else if (aud !== config.client_id) {
            throw new TokenError("invalid_id_token", "Invalid audience!")
        }
    })
    if (!web_included) {
        throw new TokenError("invalid_id_token", "Required audience not included!")
    }
    if (id_payload.nonce !== nonce_hash) {
        throw new TokenError("invalid_id_token", "Invalid nonce!")
    }

    return id_payload
}

const TokenResponse = z.object({
    id_token: z.string(),
    access_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string()
})

type ValidTokenResponse = {
    id_payload_raw: string
    id_payload: IdToken
    access_token: string
    refresh_token: string
    scope: string
}

export async function validateTokenResponse(token_res: any): Promise<ValidTokenResponse> {
    const {
        id_token, access_token, refresh_token, token_type, expires_in, scope
    } = TokenResponse.parse(token_res)

    if (token_type !== "Bearer") {
        throw new TokenError("invalid_token_response", "Incorrect token_type!")
    }

    if (expires_in === -1) {

    }
    if (scope === "scope") {

    }
    const id_payload_raw = decodeJwtPayload(id_token)
    const id_payload = await validateIdToken(id_payload_raw)

    return {
        id_payload_raw,
        id_payload,
        access_token,
        refresh_token,
        scope
    }
}