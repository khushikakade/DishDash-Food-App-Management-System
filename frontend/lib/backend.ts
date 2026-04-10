const BACKEND_API_URL = (
  process.env.BACKEND_API_URL ||
  (process.env.BACKEND_HOSTPORT
    ? `http://${process.env.BACKEND_HOSTPORT}`
    : "http://localhost:5000")
).replace(/\/$/, "");

export class BackendRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BackendRequestError";
    this.status = status;
  }
}

export async function fetchBackend<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : `Backend request failed with status ${response.status}`;
    throw new BackendRequestError(message, response.status);
  }

  return data as T;
}
