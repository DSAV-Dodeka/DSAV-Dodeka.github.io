const getUrl = (loc: string, dir: string='images') => {
    return new URL(`../${dir}/${loc}`, import.meta.url).href
}

export default getUrl;