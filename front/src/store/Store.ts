import type { SITE_URLS_MAPPING } from "@config/types";
import type { AccessTokenRequestResponse } from "../pages/google/identity";
import type { GalreeFrontConfig } from "@common/frontConfig";
import { filePublicURLConstructor } from "@config/paths";

export type State = {
    config: GalreeFrontConfig;
    user?: AccessTokenRequestResponse;
    publicDatabase: PublicDatabase;
    URLs: SITE_URLS_MAPPING;
};

// File stored on bucket, download by public UI
export type PublicDatabase = {
    version: Version;
    generatedAt: string;
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
        generatedAt: (new Date(0)).toISOString(),
        artworks: [],
    },
    URLs: filePublicURLConstructor(config.bucket, config.siteId),
});
