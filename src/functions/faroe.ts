import { Client } from "@faroe/client";

const AUTH_URL = import.meta.env.DEV
  ? "http://localhost:3777"
  : "https://auth.dsavdodeka.nl";

class FaroeEndpoint {
  async sendActionInvocationEndpointRequest(body: string): Promise<string> {
    const response = await fetch(`${AUTH_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    return response.text();
  }
}

export const faroeClient = new Client(new FaroeEndpoint());
