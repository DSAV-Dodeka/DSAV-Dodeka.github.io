import { binToBase64Url, base64ToBin, stringToUint8 } from "./AuthUtility"
import {string, z} from "zod";
import config from "../../../config";
import {NormalizedOptions} from "ky/distribution/types/options";
import {PagesError} from "../../../functions/error";

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
    exp: z.number(),
    email: z.string(),
    name: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    nickname: z.string().optional(),
    preferred_username: z.string().optional(),
    birthdate: z.string()
})
export type IdToken = z.infer<typeof IdToken>

export function parseIdToken(jwt_json: string): IdToken {
    const jwt_obj = JSON.parse(jwt_json)
    return IdToken.parse(jwt_obj)
}

export class TokenError extends PagesError {
    constructor(err_desc: string, debug_key?: string) {
        super('bad_tokens', err_desc, debug_key);
    }
}

export async function validateIdToken(id_json: string, check_nonce: boolean, nonce_original?: string): Promise<IdToken> {
    let id_payload: IdToken
    try {
        id_payload = parseIdToken(id_json)
    } catch (e) {
        throw new TokenError("Error parsing ID token!", "bad_id_parsing")
    }

    let web_included = false
    id_payload.aud.forEach(aud => {
        if (aud === config.client_id) {
            web_included = true
        }
        else if (aud !== config.client_id) {
            throw new TokenError("Invalid audience!", "invalid_id_aud")
        }
    })
    if (!web_included) {
        throw new TokenError("Required audience not included!", "not_required_id_audience")
    }
    if (check_nonce) {
        const check_nonce = nonce_original !== undefined ? nonce_original : localStorage.getItem("nonce_original")

        if (check_nonce === null) {
            throw new TokenError("No ID token nonce set!", "no_id_nonce")
        }

        const nonce_bin = base64ToBin(check_nonce)
        const nonce_hash = await encodedHashBin(nonce_bin)
        if (id_payload.nonce !== nonce_hash) {
            throw new TokenError("Invalid nonce!", "bad_id_nonce")
        }
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

export async function validateTokenResponse(token_res: any, nonce_original?: string): Promise<ValidTokenResponse> {
    const {
        id_token, access_token, refresh_token, token_type, expires_in, scope
    } = TokenResponse.parse(token_res)

    if (token_type !== "Bearer") {
        throw new TokenError("Incorrect token_type!", "token_not_bearer")
    }

    if (expires_in === -1) {

    }
    if (scope === "scope") {

    }
    const id_payload_raw = decodeJwtPayload(id_token)
    const id_payload = await validateIdToken(id_payload_raw, true, nonce_original)

    return {
        id_payload_raw,
        id_payload,
        access_token,
        refresh_token,
        scope
    }
}