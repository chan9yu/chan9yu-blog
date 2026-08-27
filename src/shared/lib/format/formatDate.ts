const KST_DATE = new Intl.DateTimeFormat("en-CA", {
	timeZone: "Asia/Seoul",
	year: "numeric",
	month: "2-digit",
	day: "2-digit"
});

export function formatDate(iso: string) {
	return KST_DATE.format(new Date(iso)).replaceAll("-", ".");
}
