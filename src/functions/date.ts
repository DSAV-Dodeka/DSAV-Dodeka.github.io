export const ISODate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth()+1;
    const dt = d.getDate();

    let dtStr = dt.toString()
    let mStr = month.toString()
    if (dt < 10) {
        dtStr = '0' + dtStr;
    }
    if (month < 10) {
        mStr = '0' + mStr;
    }

    return `${year}-${mStr}-${dtStr}`
}