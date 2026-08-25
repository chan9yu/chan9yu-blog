import { Skeleton } from "@/shared/ui/Skeleton";

const RAIL_ITEM_COUNT = 8;
const CARD_COUNT = 6;

export function PostsSkeleton() {
	return (
		<div className="lg:grid-tag-rail grid gap-7 lg:gap-11" role="status" aria-label="포스트를 불러오고 있습니다">
			<div className="hidden lg:block">
				<Skeleton className="mb-3 h-4 w-12" />
				<div className="space-y-1.5">
					{Array.from({ length: RAIL_ITEM_COUNT }, (_, index) => (
						<Skeleton key={index} className="h-10 w-full" />
					))}
				</div>
			</div>

			<div className="min-w-0">
				<div className="mb-3.5 flex items-center justify-between gap-4">
					<Skeleton className="h-3.5 w-32" />
					<Skeleton className="rounded-control hidden h-10.5 w-21.5 lg:block" />
				</div>

				<div className="grid-cards grid gap-3.5 lg:gap-4">
					{Array.from({ length: CARD_COUNT }, (_, index) => (
						<div key={index} className="bg-card border-border-subtle overflow-hidden rounded-lg border">
							<Skeleton className="aspect-og w-full rounded-none" />
							<div className="flex flex-col gap-2 p-4.5">
								<Skeleton className="h-4 w-11/12" />
								<Skeleton className="h-3 w-20" />
								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-4/5" />
								<div className="mt-3 flex gap-1.5">
									<Skeleton className="h-6 w-16 rounded-sm" />
									<Skeleton className="h-6 w-14 rounded-sm" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
