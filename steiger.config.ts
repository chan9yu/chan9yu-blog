import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
	...fsd.configs.recommended,
	{
		ignores: ["**/__tests__/**", "**/__mocks__/**"]
	},
	{
		files: ["./src/shared/**"],
		rules: {
			"fsd/public-api": "off",
			"fsd/no-public-api-sidestep": "off"
		}
	},
	{
		files: ["./src/shared/assets/**", "./src/app/providers/**"],
		rules: {
			"fsd/segments-by-purpose": "off"
		}
	},
	{
		files: ["./src/app/ui/**"],
		rules: {
			"fsd/no-ui-in-app": "off"
		}
	},
	{
		files: ["./src/entities/**"],
		rules: {
			"fsd/inconsistent-naming": "off"
		}
	},
	{
		files: ["./src/features/comments/**", "./src/features/views/**", "./src/widgets/toc/**"],
		rules: {
			"fsd/insignificant-slice": "off"
		}
	}
]);
