const getUrl = (loc: string) => {
    return new URL(`../images/${loc}`, import.meta.url).href
}

export default getUrl;