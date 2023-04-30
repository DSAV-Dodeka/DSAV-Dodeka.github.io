import Papa from "papaparse";
import {ZodTypeAny, z} from "zod"

export const parseFile = <S extends ZodTypeAny>(files: FileList, rowSchema: S, resultCallback: (found: z.infer<S>[]) => void, errorCallback: (e: unknown) => void) => {
    Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        error(error: Error, _file: unknown) {
            errorCallback(error)
        },
        complete: function(results) {
            try {
                const parsedRows: z.infer<S> = rowSchema.array().parse(results.data)
                resultCallback(parsedRows)
            } catch (e) {
                errorCallback(e)
            }
        }
    })
}