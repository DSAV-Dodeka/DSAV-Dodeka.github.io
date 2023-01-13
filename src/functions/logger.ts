const getLevel = () => {
    switch (import.meta.env.VITE_LOG_LEVEL) {
        case "debug": return 1
        case "info": return 2
        case "warning": return 3
        case "error": return 4
        default: return 2
    }
}

const level = getLevel()

export class Logger {
    static debug(l: any) {
        if (level <= 1) {
            console.debug(l)
        }
    }

    static info(l: any) {
        if (level <= 2) {
            console.log(l)
        }
    }

    static warn(l: any) {
        if (level <= 3) {
            console.warn(l)
        }
    }

    static error(l: any) {
        if (level <= 4) {
            console.error(l)
        }
    }
}