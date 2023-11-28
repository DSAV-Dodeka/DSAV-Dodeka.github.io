import {ApiError} from "./api/api";

export class PagesError extends Error {
    err: string
    err_desc: string
    debug_key?: string

    constructor(err: string, err_desc: string, debug_key?: string) {
        super(err_desc);
        this.err = err
        this.err_desc = err_desc
        this.debug_key = debug_key
    }

    j() {
        return JSON.stringify({err: this.err, err_desc: this.err_desc, debug_key: this.debug_key})
    }
}