import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const UPWARD_MESSAGE = "FSD 레이어 규칙 위반. 아래 레이어는 위 레이어를 참조할 수 없다.";
const PUBLIC_API_MESSAGE = "슬라이스 public API를 우회한 깊은 import. 슬라이스 루트로 가져온다. index.server만 예외다.";
const PUBLIC_API_GROUP = [
	"@/entities/*/*",
	"!@/entities/*/index.server",
	"@/features/*/*",
	"@/widgets/*/*",
	"@/pages/*/*"
];

function layerRule(files, forbiddenLayers) {
	const patterns = forbiddenLayers.map((layer) => ({
		group: [`@/${layer}`, `@/${layer}/**`],
		message: UPWARD_MESSAGE
	}));

	patterns.push({ group: PUBLIC_API_GROUP, message: PUBLIC_API_MESSAGE });

	return {
		files,
		rules: {
			"no-restricted-imports": ["error", { patterns }]
		}
	};
}

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
	layerRule(["src/shared/**/*.{ts,tsx}"], ["app", "pages", "widgets", "features", "entities"]),
	layerRule(["src/entities/**/*.{ts,tsx}"], ["app", "pages", "widgets", "features"]),
	layerRule(["src/features/**/*.{ts,tsx}"], ["app", "pages", "widgets"]),
	layerRule(["src/widgets/**/*.{ts,tsx}"], ["app", "pages"]),
	layerRule(["src/pages/**/*.{ts,tsx}"], ["app"]),
	layerRule(["app/**/*.{ts,tsx}"], []),
	prettierConfig,
	globalIgnores([".next/**", "_workspace/**", "contents/**"])
]);

export default eslintConfig;
