import { Mail } from "lucide-react";

import GithubIcon from "@/shared/assets/icons/github.svg";
import LinkedinIcon from "@/shared/assets/icons/linkedin.svg";
import { siteSocials } from "@/shared/config/site";

type SocialIconName = (typeof siteSocials)[number]["iconName"];

const ICON_MAP = {
	Github: GithubIcon,
	Linkedin: LinkedinIcon,
	Mail
} satisfies Record<SocialIconName, unknown>;

export const socialItems = siteSocials.map(({ label, href, iconName }) => {
	const Icon = ICON_MAP[iconName];
	return { label, href, icon: <Icon className="size-4" aria-hidden /> };
});
