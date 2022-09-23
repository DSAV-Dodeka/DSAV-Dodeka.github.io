const production = false;
// Should be less than refresh expiry
const max_login = 28 * 24 * 60 * 60

export default
{
  "auth_location": production ? "" : "http://localhost:4243",
  "api_location": production ? "" : "http://localhost:4243",
  "self_location": production ? "" : "http://localhost:3000",
  "client_id": "dodekaweb_client",
  "max_login": max_login
}