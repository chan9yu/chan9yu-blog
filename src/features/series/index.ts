export { SeriesCard, SeriesNavigation, TrendingSeries } from "./components";
export type { SeriesAdjacency } from "./services";
export {
	getAdjacentInSeries,
	getAllSeries,
	getAllSeriesMeta,
	getSeriesDetail,
	getSeriesStats,
	getTrendingSeries
} from "./services";
export { stripSeriesPrefix } from "./utils/stripSeriesPrefix";
export type { Series, SeriesStats } from "@/shared/types";
