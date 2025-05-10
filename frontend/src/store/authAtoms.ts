import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtomKey = "userToken";

const userAuthAtom = atomWithStorage<AuthenticationResultType | null>(
  userAtomKey,
  null
);

export const writableUserAuthAtom = atom(
  null,
  (get, set, newValue: AuthenticationResultType | null) => {
    set(userAuthAtom, newValue);
  }
);

export const userAccessToken = atom((get) => {
  const user = get(userAuthAtom);
  return user?.AccessToken || null;
});
