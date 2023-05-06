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

type IdName = {
    user_id: string,
    name: string
}

type UserName = {
    callname: string,
    firstname: string,
    lastname: string,
    user_id: string
}

const matchNames = (users: UserName[], names: string[]) => {
    const uniqueMatch = new Map<string, IdName>()
    const multipleMatch = new Map<string, IdName[]>()
    const noMatch: string[] = []
    for (const name of names) {
        let matched: IdName[] = []
        let matchLevel = -1
        for (const u of users) {
            const firstLast = (u.firstname + " " + u.lastname)
            const fullName = firstLast + ` (${u.callname})`

            if (u.callname === name || u.firstname === name) {
                matched.push({ user_id: u.user_id, name: fullName })
                matchLevel = 0
            }

            if (matchLevel === 0) {
                continue
            }

            const callLast = (u.callname + " " + u.lastname)


            if (callLast === name || firstLast === name) {
                matched.push({ user_id: u.user_id, name: fullName })
                matchLevel = 1
            }

            if (matchLevel === 1) {
                continue
            }
            const nameWithoutDot = name.replace('.', '')

            if (callLast.includes(nameWithoutDot) || firstLast.includes(nameWithoutDot)) {
                matched.push({ user_id: u.user_id, name: fullName })
                matchLevel = 2
            }
        }
        if (matched.length === 0) {
            noMatch.push(name)
        } else if (matched.length === 1) {
            uniqueMatch.set(name, matched[0])
        } else {
            multipleMatch.set(name, matched)
        }

    }
    return {
        noMatch,
        uniqueMatch: Object.fromEntries(uniqueMatch),
        multipleMatch: Object.fromEntries(multipleMatch)
    }
}