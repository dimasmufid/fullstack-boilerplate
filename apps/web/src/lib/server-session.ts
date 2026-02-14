import { headers } from 'next/headers';

type SessionResponse = {
  data?: unknown;
};

export async function getServerSession() {
  const requestHeaders = await headers();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return null;
  }

  const response = await fetch(`${apiUrl}/api/auth/get-session`, {
    headers: {
      cookie: requestHeaders.get('cookie') ?? '',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as SessionResponse | null;
  if (!payload) {
    return null;
  }

  return payload.data ?? payload;
}
