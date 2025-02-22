import { GOOGLE_STORAGE_BUCKET_BASEURL } from "../../common/const";
import { fileNames } from "./files";
import type { FILE_IDS, SITE_URLS_MAPPING } from "./types";

const pathToFiles: { [fileId in FILE_IDS]: string } = {
    PUBLIC_DATABASE: `/${fileNames.PUBLIC_DATABASE}`,
} as const;

export const filePublicURLConstructor: (
    publicBucketName: string,
    siteId: string,
) => SITE_URLS_MAPPING = (publicBucketName, siteId) => ({
    PUBLIC_DATABASE:
        `${GOOGLE_STORAGE_BUCKET_BASEURL}/${publicBucketName}/${siteId}/${pathToFiles.PUBLIC_DATABASE}`,
});
