// configuration as injected into HTML files
// all these data are available to the front-end
// no security issue putting them in the HTML
export type GalreeFrontConfig = {
    siteId: string;
    // the galree public bucket : publicly readable, site-specific folders writable only by site admin
    bucket: string;
    appClientId: string;
    hashed_siteAdminGoogleAccount: string;
    // avoiding visitor to bruteforce hashed admin email
    hashSalt: string;
    // the data source, access protected by owner
    googleSheetId: string;
};
