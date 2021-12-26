const port = 4243

export async function clientRegister(username, password) {
    try {
        const opaque = await import("@tiptenbrink/opaquewasm")
        const { message: message1, state } = opaque.client_register_wasm(password)

        console.log(message1)
        console.log(state)

        // get message to server and get message back
        const reqst = {
            "username": username,
            "client_request": message1
        }
        const res = await fetch(`http://localhost:${port}/auth/register/start`, {
            method: 'POST', body: JSON.stringify(reqst),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const parsed = await res.json()
        const server_message = parsed.server_message
        const auth_id = parsed.auth_id
        const register_state = state
        console.log(auth_id)
        console.log(server_message)

        const message2 = opaque.client_register_finish_wasm(register_state, server_message)

        console.log(message2)

        const reqst2 = {
            "username": username,
            "client_request": message2,
            "auth_id": auth_id
        }
        const res_finish = await fetch(`http://localhost:${port}/auth/register/finish`, {
            method: 'POST', body: JSON.stringify(reqst2),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return res_finish.ok

    } catch (e) {
        console.log(e)
        return false
    }
}

export async function clientLogin(username, password, flow_id) {
    try {
        const opaque = await import("@tiptenbrink/opaquewasm")
        const { message: message1, state } = opaque.client_login_wasm(password)

        console.log(message1)
        console.log(state)

        // get message to server and get message back
        const reqst = {
            "username": username,
            "client_request": message1
        }
        const res = await fetch(`http://localhost:${port}/auth/login/start`, {
            method: 'POST', body: JSON.stringify(reqst),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const parsed = await res.json()
        const server_message = parsed.server_message
        const auth_id = parsed.auth_id
        const login_state = state
        console.log(auth_id)
        console.log(server_message)

        // pass 'abc'
        //const login_state = "Gg6GSd_2X9ccTkVZBatUyynmRM5CWBVh9j8Fsac2hQAAYoxXlNs3YTKM_4eq-Tr3hOM5TO1OZTaAgI7DYQIV4rhX-EomurCCwcw3cojfbBudPS6aF0YyxJZYbjgD8ABTigIAAMaJ77uRiMGm50uF6_VEFchFlKmwvKhhiUUsRhZhRl1fAEChX0fsJTWoEsS2bPTSt-1BKlRkL85rlA1yZkr56BWbCvhKJrqwgsHMN3KI32wbnT0umhdGMsSWWG44A_AAU4oCYWJj"
        //const server_message = "ho_5N1Kup16z2J_aoR3MxLpxrM--gE-AFLz8-bhkIh_8cilJ2k3wlBxI5tG-aPV_-VNMoit3BFUK-8zO6cYpdAETrMqI8STeP2akP4qAmQ8A5nAFshWJUpU3NfznjqXFTFPMQRJAaV9Ga-xnDUXd7KTkW18gQeoI_QWXN9xgYaFJHsYTVOYXoWKkoOwbHfurl9tNesy7DhgOnFvBH7rxH3-i3Xcl4lPuHtFFlgNCLwR4r1V0wH9tFSGC30LmXpZOBLWWZ0IXIl5BBZ5mSCJJHS9UKiYIYAHjsDjpeMQaRm_0PA70Xqrlk1dLmlhrWSoX46pZQ3Bxp2bKxF38mtr3MQcAAO3RwD2P-EutfATHdQ2W1qQZuJyOjG255FSAsbBLIOFBcpYBCNIitdoxYe7baP6gI_A9LxyK4kP0kOXg17sQ8wQ="
        //const server_message = "GjLrN4JEUsjQgmesadkoPWbOblKFA2B_fbgFclxoW03GVBmt60hTg5I8TzpcuB6VAZffJkgztbfI5pETN-l-WAHbuTdN1azA6NI6d-oP3TOm-_sVanwq2zE35LJAMHhXQDdLpf3YxY3OCZfMCDfjz4hC8yU9KR4kawwKnnVj8cI_DjUG2M7pFJAR5VJ1j5yYmERTn_8S_vzxm6M6y0FGARx_J8HcjATeNkdiS9DCtte-1vCZa0UnhOpOf4IEEHl3AJ71NBsDbp8kEI4GanzhH3bPCqoWukPT_MToVe1pbROJkCKaxKwBu1PuMbF4e-hw4EtQuCJmb5l6-Zm7SkowBVYAAPfgo_zRAhkBivXxX0t0H33plYrN_7yKaDZIZiCMMyiuYabsvs_op4JKgD2hV-X1PPpUdrMZ-WVrZstLRiqr2_E="

        const { message: message2, session } = opaque.client_login_finish_wasm(login_state, server_message)

        console.log(message2)

        const reqst2 = {
            "username": username,
            "client_request": message2,
            "auth_id": auth_id,
            "flow_id": flow_id
        }
        const res2 = await fetch(`http://localhost:${port}/auth/login/finish`, {
            method: 'POST', body: JSON.stringify(reqst2),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res2.ok) {
            return session
        }
        return null

    } catch (e) {
        if (e instanceof Error && e.name === "InvalidLogin") {
            console.log("IsError")
            console.log(e.message)
        }
        else {
            console.log(e)
        }
        return null
    }
}