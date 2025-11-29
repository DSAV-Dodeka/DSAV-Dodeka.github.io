import { useQuery } from "@tanstack/react-query";
import {
  Client,
  type ActionInvocationEndpointClient,
  type Session,
} from "@faroe/client";

const faroeEndpoint = "http://localhost:3777/";

class EndpointClient implements ActionInvocationEndpointClient {
  public async sendActionInvocationEndpointRequest(body: string) {
    const response = await fetch(faroeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (response.status !== 200) {
      console.error(
        `failed response=\n${await response.text()} for body\n${body}`,
      );
      throw new Error(`Unknown status ${response.status}`);
    }
    const resultJSON = await response.text();
    return resultJSON;
  }
}

const faroeClient = new Client(new EndpointClient());

// async function startRegister(email: string) {
//   const result = await faroeClient.createSignup(email)
//   faroeClient.setSignupPassword()
//   faroeClient.sendSignupEmailAddressVerificationCode()
// }

interface AppSession {
  user_id: string;
}

const backendEndpoint = "http://localhost:8000";

async function backendJson(path: string, json: object, options?: RequestInit) {
  let requestInit: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      body: JSON.stringify(json),
    },
  };
  if (options !== undefined) {
    requestInit = {
      ...requestInit,
      ...options,
    };
  }
  return await fetch(`${backendEndpoint}${path}`, requestInit);
}

async function backendGet(path: string, options?: RequestInit) {
  return await fetch(`${backendEndpoint}${path}`, options);
}

async function setSession(session_token: string) {
  const res = await backendJson("auth/set_session/", { session_token });
  if (res.status !== 200) {
    throw new Error(`Failed to set session:\n${await res.text()}`);
  }
}

interface SessionInfo {
  user: {
    user_id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  created_at: number;
  expires_at: number | null;
}

function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async (): Promise<SessionInfo> => {
      const response = await (await backendGet("auth/session_info/")).json();

      return response as SessionInfo;
    },
  });
}
