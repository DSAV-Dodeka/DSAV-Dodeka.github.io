const getUrl = (loc: string) => {
    const url = new URL(`../images/${loc}`, import.meta.url)

    if (import.meta.env.PROD) {
        const path = new URL(`../images/${loc}`, import.meta.url).pathname
        return path.replace("/assets/", "https://dodeka-1e294.kxcdn.com/")
    } else {
        return url.href
    }
}

export default getUrl;