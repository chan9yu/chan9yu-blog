import type { FC, SVGProps } from "react";

declare module "*.svg" {
	const Component: FC<SVGProps<SVGSVGElement>>;
	export default Component;
}
