import type { FrontId, GalreeFrontConfig } from "@common/frontConfig";

declare global {
    interface Window {
        galree: GalreeFrontConfig<FrontId>;
    }
}

export function getGalreeFrontConfig<
    Front extends FrontId,
>(): GalreeFrontConfig<
    Front
> {
    return window.galree as GalreeFrontConfig<Front>;
}
