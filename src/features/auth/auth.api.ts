import type { AuthResponse, LoginCredentials } from "./auth.types";

const MOCK_CREDENTIALS = {
  email: "admin",
  password: "admin123",
};

const MOCK_USER = {
  id: "1",
  name: "Admin",
  email: "admin",
  storeId: "clx1234567890abcdefghij",
};

const MOCK_TOKEN = "mock-token-soundhub";

export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (
    credentials.email === MOCK_CREDENTIALS.email &&
    credentials.password === MOCK_CREDENTIALS.password
  ) {
    return { user: MOCK_USER, token: MOCK_TOKEN };
  }

  throw new Error("Invalid credentials");
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}
