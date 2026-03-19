import type { TypedPocketBase } from "pocketbase-types";
import PocketBase from "pocketbase";

export const pb = new PocketBase(
  "https://6gtpelha4l4d3m8.desto4q.duckdns.org/",
) as TypedPocketBase;

export const server_pb = () => {
  return new PocketBase(
    "https://6gtpelha4l4d3m8.desto4q.duckdns.org/",
  ) as TypedPocketBase;
};
