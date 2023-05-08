const getUrl = (loc: string, dir: string='images') => {
    return new URL(`../${dir}/${loc}`, import.meta.url).href
    //return new URL(`https://imgdodeka.b-cdn.net/${loc}`, import.meta.url).href
}

export default getUrl;