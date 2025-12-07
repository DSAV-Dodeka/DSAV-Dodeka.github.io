import { Client } from "@faroe/client";

class FaroeEndpoint {
  async sendActionInvocationEndpointRequest(body: string): Promise<string> {
    const response = await fetch("http://localhost:3777/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    return response.text();
  }
}

export const faroeClient = new Client(new FaroeEndpoint());
