import legacy from "@vitejs/plugin-legacy";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { EtaPlugin } from "./eta.plugin";

devtools({
	locator: {
		targetIDE: "vscode",
		componentLocation: true,
		jsxLocation: true,
	},
});

export default defineConfig(({ command }) => {
	const isBuildingForPreview = command === "build" &&
		process.argv.includes("--for-preview");

	const plugins = [
		solid(),
		devtools({
			autoname: true,
		}),
		legacy({
			targets: ["defaults", "not IE 11"],
		}),
	];

	if (command === "serve" || isBuildingForPreview) {
		// when building for preview we still want HTML to be injected with site config values
		// be careful though not to build server image using the leftover dist/ folder
		// server script would not replace ETA tags with evaluations, since they will not be present (already replaced here)
		const siteId = process.env.SITE;

		if (!siteId) {
			console.error("SITE env var must be defined");
			process.exit(1);
		}

		plugins.push(EtaPlugin({ siteId }));
	}

	return ({
		resolve: {
			alias: {
				"@common": `${__dirname}/../common`,
				"@config": `${__dirname}/src/config`,
			},
		},
		plugins,
		publicDir: "./public",
		server: {
			strictPort: true,
			open: true,
		},
		build: {
			assetsInlineLimit: 0, // for tests, to be eventually reverted
			outDir: "./dist",
			emptyOutDir: true,
			rollupOptions: {
				external: ["solid-js", "@solidjs/router", "solid-markdown"],
				output: {
					paths: {
						"solid-js": "https://esm.sh/solid-js@1.9.4",
						"@solidjs/router":
							"https://esm.sh/@solidjs/router@0.15.3",
					},
				},
			},
		},
		preview: {
			open: true,
		},
	});
});
