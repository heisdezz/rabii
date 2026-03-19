import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import type { UsersResponse } from "../../pocketbase-types";
import { pb } from "./pb";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

type SessionState = {
  user: UsersResponse | null;
  token: string | null;
  isValid: boolean;
};

const sessionAtom = atom<SessionState>({
  user: pb.authStore.record as UsersResponse | null,
  token: pb.authStore.token,
  isValid: pb.authStore.isValid,
});

const isLoadingAtom = atom(false);

// Returns milliseconds until the current token expires, or 0 if none/unreadable.
function tokenExpiresInMs(): number {
  const token = pb.authStore.token;
  if (!token) return 0;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Sync hook — call once near the app root
// ---------------------------------------------------------------------------

export function useSessionSync() {
  const setSession = useSetAtom(sessionAtom);

  useEffect(() => {
    const unsub = pb.authStore.onChange((token, record) => {
      setSession({
        user: record as UsersResponse | null,
        token,
        isValid: pb.authStore.isValid,
      });
    });
    return unsub;
  }, [setSession]);
}

// ---------------------------------------------------------------------------
// Read hooks
// ---------------------------------------------------------------------------

export const useSession = () => useAtomValue(sessionAtom);
export const useUser = () => useAtomValue(sessionAtom).user;
export const useIsAuthenticated = () => useAtomValue(sessionAtom).isValid;
export const useIsLoading = () => useAtomValue(isLoadingAtom);

// ---------------------------------------------------------------------------
// Action hooks
// ---------------------------------------------------------------------------

export function useLogin() {
  const setLoading = useSetAtom(isLoadingAtom);

  return useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        return await pb.collection("users").authWithPassword(email, password);
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );
}

export function useRegister() {
  const setLoading = useSetAtom(isLoadingAtom);

  return useCallback(
    async (data: {
      email: string;
      password: string;
      passwordConfirm: string;
      name?: string;
    }) => {
      setLoading(true);
      try {
        const user = await pb.collection("users").create(data);
        await pb
          .collection("users")
          .authWithPassword(data.email, data.password);
        return user;
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );
}

export function useLogout() {
  return useCallback(() => pb.authStore.clear(), []);
}

// Silent background refresh — no loading state, clears session on failure.
async function refreshSession() {
  if (!pb.authStore.isValid) return;
  try {
    await pb.collection("users").authRefresh();
  } catch {
    pb.authStore.clear();
  }
}

/**
 * Refreshes on mount, then on window focus only when the token
 * has less than 5 minutes remaining.
 */
export function useAutoRefresh() {
  useEffect(() => {
    refreshSession();

    function handleFocus() {
      if (tokenExpiresInMs() < 5 * 60 * 1000) refreshSession();
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);
}

pb.beforeSend = async (req, options) => {
  // console.log(pb.authStore, "token");
  if (req.includes("refresh")) {
    console.log(req, options, "includes_refrsh");
    return { req, options };
  }
  if (pb.authStore.token) {
    if (pb.authStore.isValid) return { req, options };
    await pb.collection("users").authRefresh();
  }
  return { req, options };
};
