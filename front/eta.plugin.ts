import { Eta } from "eta";
import { readFileSync } from "node:fs";
import type { Plugin } from "vite";
import { createHash, randomUUID } from "node:crypto";

type EtaPluginOptions = {
    siteId: string;
};

export function EtaPlugin({ siteId }: EtaPluginOptions): Plugin {
    return {
        name: "inject-site-config",
        enforce: "pre",
        transformIndexHtml: (html) => {
            // reading galree config in a brutal way, it will only be used in dev mode
            const templateRenderer = new Eta();

            const configFile = "../galree.jsonc";
            let config: {
                appClientId: string;
                public_bucket: string;
                sites: {
                    [siteId: string]: {
                        siteAdminGoogleAccount: string;
                        googleSheetId: string;
                        title: string;
                    };
                };
            };
            try {
                const configFileContent = readFileSync(configFile, "utf-8");
                config = JSON.parse(
                    configFileContent.replaceAll(/\/\/.*$/gm, ""),
                );
            } catch (e) {
                console.error(
                    `Config file ${configFile} not found or invalid JSON content`,
                );
                process.exit(1);
            }

            const siteConfig = config.sites[siteId];

            const hashSalt = randomUUID();
            const hashed_siteAdminGoogleAccount = createHash("sha256")
                .update(
                    siteConfig.siteAdminGoogleAccount +
                        hashSalt,
                ).digest(
                    "hex",
                );

            return templateRenderer.renderString(html, {
                siteId,
                title: siteConfig.title,
                config: `;\nwindow.galree = Object.freeze(${
                    JSON.stringify(
                        {
                            title: siteConfig.title,
                            siteId,
                            appClientId: config.appClientId,
                            hashed_siteAdminGoogleAccount,
                            hashSalt,
                            googleSheetId: siteConfig.googleSheetId,
                            bucket: config.public_bucket,
                        },
                        null,
                        "\t",
                    )
                })`,
            });
        },
    };
}
