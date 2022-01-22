import {parseIdToken} from "./OAuth";

export function tokens() {
    const access = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")
    const id = parseIdToken(localStorage.getItem("id_payload"))

}