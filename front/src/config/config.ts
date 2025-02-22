import type { GalreeFrontConfig } from "@common/frontConfig";

declare global {
    interface Window {
        galree: GalreeFrontConfig;
    }
}

export function getGalreeFrontConfig(): GalreeFrontConfig {
    return window.galree as GalreeFrontConfig;
}
