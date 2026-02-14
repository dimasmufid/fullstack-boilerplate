import { headers } from 'next/headers';
import { getServerApiV1BaseUrl } from '@/lib/api-url';

type SessionResponse = {
  data?: unknown;
};

export async function getServerSession() {
  const requestHeaders = await headers();
  const apiV1Url = getServerApiV1BaseUrl();
  let response: Response;
  try {
    response = await fetch(`${apiV1Url}/auth/get-session`, {
      headers: {
        cookie: requestHeaders.get('cookie') ?? '',
      },
      cache: 'no-store',
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as SessionResponse | null;
  if (!payload) {
    return null;
  }

  return payload.data ?? payload;
}
