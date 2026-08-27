import dayjs from "dayjs";

export function formatDate(iso: string) {
	return dayjs(iso).format("YYYY.MM.DD");
}
