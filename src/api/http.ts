import { tokenStorage } from "../auth/tokenStorage";

export async function http(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const accessToken = tokenStorage.getAccessToken();

  const headers = {
    ...(init?.headers || {}),
    ...(accessToken && {
      Authorization: `Bearer ${accessToken}`
    })
  };

  return fetch(input, {
    ...init,
    headers
  });
}
