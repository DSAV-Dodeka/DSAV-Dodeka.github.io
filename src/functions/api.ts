import config from "../config"
import ky from "ky"
import {z} from "zod";

const api = ky.create({prefixUrl: config.api_location});

export const back_post = async (endpoint: string, json) => {
    return await api.post(endpoint, {json: json}).json()
}