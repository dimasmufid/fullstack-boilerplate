const DEFAULT_API_BASE_URL = "http://localhost:4000";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export function getClientApiBaseUrl() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const baseUrl = configuredApiUrl || DEFAULT_API_BASE_URL;

  return normalizeBaseUrl(baseUrl);
}

export function getServerApiBaseUrl() {
  const configuredServerUrl =
    process.env.API_URL?.trim();
  const baseUrl = configuredServerUrl || getClientApiBaseUrl();

  return normalizeBaseUrl(baseUrl);
}

export function getClientApiV1BaseUrl() {
  return `${getClientApiBaseUrl()}/api/v1`;
}

export function getServerApiV1BaseUrl() {
  return `${getServerApiBaseUrl()}/api/v1`;
}
