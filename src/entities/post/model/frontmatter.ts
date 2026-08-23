import { z } from "zod";

export const PostFrontmatterSchema = z
	.object({
		title: z.string().min(1),
		description: z.string().min(1),
		slug: z.string().regex(/^[a-z0-9-]+$/, "slug는 영문 소문자·숫자·하이픈만 허용"),
		date: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "date는 ISO 8601 형식이어야 합니다"),
		updated: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "updated는 ISO 8601 형식이어야 합니다")
			.optional(),
		private: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
		thumbnail: z.string().nullable().default(null),
		series: z.string().nullable().default(null),
		seriesOrder: z.number().int().positive().nullable().default(null)
	})
	.refine(
		(data) => {
			const hasSeries = data.series !== null;
			const hasOrder = data.seriesOrder !== null;
			return hasSeries === hasOrder;
		},
		{
			message: "series와 seriesOrder는 함께 설정되거나 함께 null이어야 합니다"
		}
	);

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
