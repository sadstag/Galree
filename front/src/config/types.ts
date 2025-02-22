import type { fileNames } from "./files";

export type FILE_IDS = keyof typeof fileNames;
export type SITE_URLS_MAPPING = { [fileId in FILE_IDS]: string };
