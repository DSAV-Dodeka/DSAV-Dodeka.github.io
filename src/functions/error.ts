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
}