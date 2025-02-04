export type GalreeConfig = {
    siteId: string;
    clientId: string;
    hashed_siteAdminGoogleAccount: string;
    hashSalt: string;
    googleSheetId: string;
};

declare global {
    interface Window {
        galree: GalreeConfig;
    }
}

export function getGalreeConfig(): GalreeConfig {
    return window.galree as GalreeConfig;
}
