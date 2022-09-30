const production = false;
// Should be less than refresh expiry
const max_login = 28 * 24 * 60 * 60

export default
{
  "auth_location": import.meta.env.PAGES_AUTH_URL,
  "client_location": import.meta.env.PAGES_CLIENT_URL,
  "api_location": import.meta.env.PAGES_API_URL,
  "client_id": import.meta.env.PAGES_CLIENT_ID,
  "max_login": max_login
}