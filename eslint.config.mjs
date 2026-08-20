import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		plugins: {
			"simple-import-sort": simpleImportSort
		},
		rules: {
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"@next/next/no-img-element": "off"
		}
	},
	prettierConfig,
	globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".backup/**", ".claude/**", "contents/**"])
]);

export default eslintConfig;
