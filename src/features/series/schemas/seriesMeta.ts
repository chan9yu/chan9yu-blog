import { z } from "zod";

export const SeriesMetaSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1)
});

export type SeriesMeta = z.infer<typeof SeriesMetaSchema>;
