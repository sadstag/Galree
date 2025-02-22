import type { SITE_URLS_MAPPING } from "@config/types";
import type { UserInfo } from "../pages/google/identity";
import type { GalreeFrontConfig } from "@common/frontConfig";
import { filePublicURLConstructor } from "@config/paths";

export type State = {
    config: GalreeFrontConfig;
    accessToken: string;
    userInfo: UserInfo;
    publicDatabase: PublicDatabase;
    URLs: SITE_URLS_MAPPING;
};

// File stored on bucket, download by public UI
export type PublicDatabase = {
    version: Version;
    generatedAt: Date;
    artworks: Artwork[];
};

type Version = number;

const CURRENT_PUBLIC_DB_VERSION: Version = 1;

type Artwork = {
    id: string;
};

export const initialStore: (config: GalreeFrontConfig) => State = (
    config,
) => ({
    config,
    publicDatabase: {
        version: CURRENT_PUBLIC_DB_VERSION,
        generatedAt: new Date(0),
        artworks: [],
    },
    accessToken: "",
    userInfo: {
        sub: "",
        email: "",
        email_verified: false,
        name: "",
        family_name: "",
        given_name: "",
        picture: "",
    },
    URLs: filePublicURLConstructor(config.bucket, config.siteId),
});
