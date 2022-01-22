const production = false;

const config = {
    "auth_location": production ? "" : "http://localhost:4243",
    "api_location": production ? "" : "http://localhost:4243",
    "self_location": production ? "" : "http://localhost:3000",
    "client_id": "dodekaweb_client"
}

export default config;
