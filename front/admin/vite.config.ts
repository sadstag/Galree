import legacy from "@vitejs/plugin-legacy";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { EtaPlugin } from "./eta.plugin";

const plugins = [
	devtools({
		autoname: true,
	}),
	solid(),
	legacy({
		targets: ["defaults", "not IE 11"],
	}),
];

if (process.env.MODE === "serve") {
	const siteId = process.env.SITE;

	if (!siteId) {
		console.error("SITE env var must be defined");
		process.exit(1);
	}

	plugins.push(EtaPlugin({ siteId }));
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
	resolve: {
		// alias: {
		// 	"@ds": `${__dirname}/src/design-system`,
		// 	"@context": `${__dirname}/src/context`,
		// 	"@model": `${__dirname}/src/model`,
		// },
	},
	plugins,
	// define: {
	// 	// biome-ignore lint/style/useNamingConvention: <explanation>
	// 	__APP_VERSION__: JSON.stringify("v1.0.0"),
	// 	"import.meta.env.SITE": JSON.stringify(process.env.SITE),
	// },
	publicDir: `./public`,
	server: {
		strictPort: true,
		open: true,
	},
	build: {
		assetsDir: `admin_assets`,
		outDir: `./dist`,
		emptyOutDir: true,
		rollupOptions: {
			external: ["solid-js", "@solidjs/router", "solid-markdown"],
			output: {
				paths: {
					"solid-js": "https://esm.sh/solid-js@1.9.4",
					"@solidjs/router": "https://esm.sh/@solidjs/router@0.15.3",
				},
			},
		},
	},
	preview: {
		open: true,
	},
});
