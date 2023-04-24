const getUrl = (loc: string) => {
    return new URL(`../images/${loc}`, import.meta.url).href
    //return new URL(`https://imgdodeka.b-cdn.net/${loc}`, import.meta.url).href
}

export default getUrl;