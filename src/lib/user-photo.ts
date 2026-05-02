import { useSyncExternalStore } from "react";

const STORAGE_PREFIX = "cons:user-photo:";

const listenersByKey = new Map<string, Set<() => void>>();

function storageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function readPhoto(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(storageKey(key));
  } catch {
    return null;
  }
}

function writePhoto(key: string, value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(storageKey(key));
    } else {
      window.localStorage.setItem(storageKey(key), value);
    }
  } catch {
    // ignore quota/security errors
  }
  notify(key);
}

function notify(key: string) {
  const set = listenersByKey.get(key);
  if (!set) return;
  set.forEach((cb) => {
    cb();
  });
}

function subscribe(key: string, cb: () => void) {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  set.add(cb);

  const onStorage = (e: StorageEvent) => {
    if (e.key === storageKey(key)) cb();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    set?.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function useUserPhoto(key: string): {
  photo: string | null;
  setPhoto: (value: string | null) => void;
} {
  const photo = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => readPhoto(key),
    () => null,
  );
  return {
    photo,
    setPhoto: (value) => writePhoto(key, value),
  };
}

/**
 * Read a File (typically from an <input type="file">) into a base64 data URL
 * suitable for storing as the user's avatar.
 */
export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Unexpected file reader result"));
    };
    reader.readAsDataURL(file);
  });
}
