import { Eta } from "eta";
import { readFileSync } from "fs";
import { Plugin } from "vite";

type EtaPluginOptions = {
    siteId: string;
};

export function EtaPlugin({ siteId }: EtaPluginOptions): Plugin {
    return {
        name: "inject-site-config",
        enforce: "pre",
        apply: "serve", // only when serving locally via vite. When building for production, the server build script will do the job
        transformIndexHtml: (html) => {
            // reading galree config in a brutal way, it will only be used in dev mode
            const templateRenderer = new Eta();

            const configFile = "../../galree.jsonc";
            let config;
            try {
                const configFileContent = readFileSync(configFile, "utf-8");
                config = JSON.parse(
                    configFileContent.replaceAll(/\/\/.*$/gm, ""),
                );
            } catch (e) {
                console.error(
                    "Config file " + configFile +
                        " not found or invalid JSON content",
                );
                process.exit(1);
            }

            return templateRenderer.renderString(html, {
                siteId,
                title: config.title,
                config: "window.galree = " +
                    JSON.stringify({
                        siteId,
                        siteAdminGoogleAccount: config.siteAdminGoogleAccount,
                        googleSheetId: config.googleSheetId,
                    }),
            });
        },
    };
}
