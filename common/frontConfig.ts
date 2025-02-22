export type FrontId = "admin" | "public";

// configuration as injected into HTML files
export type GalreeFrontConfig<Front extends FrontId> =
    & {
        siteId: string;
        bucket: string;
    }
    & (Front extends "admin" ? {
            // admin specific
            appClientId: string;
            hashed_siteAdminGoogleAccount: string;
            hashSalt: string;
            googleSheetId: string;
        }
        : {});
