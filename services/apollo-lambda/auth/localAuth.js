import { ok, err } from "neverthrow";

export async function userFromLocalAuthProvider(authProvider) {
  try {
    const localUser = JSON.parse(authProvider);
    return ok(localUser);
  } catch (e) {
    return err(e);
  }
}
