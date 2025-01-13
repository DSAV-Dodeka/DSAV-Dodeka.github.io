export const getImagesUrl = (loc: string) => {
    return new URL(`../images/${loc}`, import.meta.url).href
}

// TODO this is ugly hack to fix new behavior (which "fixes" a bug) from Vite 6
export const getNestedImagesUrl = (loc: string) => {
    const split = loc.split('/')
    return new URL(`../images/${split[0]}/${split[1]}`, import.meta.url).href
}

export const getDeepImagesUrl = (loc: string) => {
    const split = loc.split('/')
    return new URL(`../images/${split[0]}/${split[1]}/${split[2]}`, import.meta.url).href
}