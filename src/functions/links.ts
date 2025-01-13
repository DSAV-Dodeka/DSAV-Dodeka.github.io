const getUrl = (loc: string, srcDir: string = 'images') => {
    const base = "../"
    const result = base + srcDir + "/" + loc
    return new URL(result, import.meta.url)
}

export default getUrl;