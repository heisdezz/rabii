import type { TypedPocketBase } from "pocketbase-types";
import PocketBase from "pocketbase";

const url = import.meta.env.VITE_MAIN_URL;
export const pb = new PocketBase(url) as TypedPocketBase;

export const server_pb = () => {
  return new PocketBase(url) as TypedPocketBase;
};
