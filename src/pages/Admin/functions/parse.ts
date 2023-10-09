import Papa from "papaparse";
import {ZodTypeAny, z} from "zod"

export const parseFile = <S extends ZodTypeAny>(files: FileList, rowSchema: S, resultCallback: (found: z.infer<S>[]) => void, errorCallback: (e: unknown) => void) => {
    Papa.parse(files[0], {
        header: true,
        skipEmptyLines: 'greedy',
        worker: true,
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

type Name = {
    name: string
}
export type MultiMatch<T extends Name> = {
    matchedNames: string[]
} & T

type Match<T extends Name> = {
    user_id: string,
    matchedName: string
} & T

type UserName = {
    firstname: string,
    lastname: string,
    user_id: string
}

/**
 *
 * @param users The names that we try to match
 * @param names The data containing unmatched names
 */
export const matchNames = <T extends Name>(users: UserName[], names: T[]): {noMatch: T[], uniqueMatch: Match<T>[], multipleMatch: MultiMatch<T>[]} => {
    // We want to allow the data to contain other fields that we also want to return back
    const uniqueMatch: Match<T>[] =[]
    // List of names that could match multiple names
    const multipleMatch: MultiMatch<T>[] = []
    const noMatch: T[] = []

    for (const nameInfo of names) {
        const name = nameInfo.name
        let matched: Match<T>[] = []
        // We first try to perform exact matches and progressively increase the 'level', looking at more loose matches
        // This ensures that a partial match has lower priority over an exact match
        let matchLevel = -1
        // Don't try to match on empty strings
        if (name.length === 0) {
            noMatch.push(nameInfo)
            continue
        }
        for (const u of users) {
            const firstLast = (u.firstname + " " + u.lastname)

            if (u.firstname === name) {
                // If it found another match at a higher (worse) level, reset it and add only this match
                if (matchLevel > 0) {
                    matched = []
                }
                matched.push({ ...nameInfo, user_id: u.user_id, matchedName: firstLast})
                matchLevel = 0
            }

            if (matchLevel === 0) {
                continue
            }

            if (firstLast === name) {
                matched.push({ ...nameInfo, user_id: u.user_id, matchedName: firstLast})
                if (matchLevel > 1) {
                    matched = []
                }
                matchLevel = 1
            }

            if (matchLevel === 1) {
                continue
            }
            const nameWithoutDot = name.replace('.', '')

            if (firstLast.includes(nameWithoutDot)) {
                matched.push({ ...nameInfo, user_id: u.user_id, matchedName: firstLast})
                matchLevel = 2
            }
        }
        if (matched.length === 0) {
            noMatch.push(nameInfo)
        } else if (matched.length === 1) {
            uniqueMatch.push(matched[0])
        } else {
            multipleMatch.push({...nameInfo, matchedNames: matched.map(m => m.matchedName) })
        }

    }
    return {
        noMatch,
        uniqueMatch,
        multipleMatch
    }
}

export const exportCSV = (data: any, file_name: string) => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv]);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}