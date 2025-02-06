// TODO put in store
export type GalreeConfig = {
    siteId: string;
    appClientId: string;
    hashed_siteAdminGoogleAccount: string;
    hashSalt: string;
    googleSheetId: string;
    bucket: string;
};

declare global {
    interface Window {
        galree: GalreeConfig;
    }
}

export function getGalreeConfig(): GalreeConfig {
    return window.galree as GalreeConfig;
}
