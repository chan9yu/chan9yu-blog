import { Container } from "@/shared/ui/Container";

export function RootLoading() {
	return (
		<Container className="py-10" role="status">
			<p className="text-muted-foreground">불러오는 중…</p>
			<span className="sr-only">페이지를 불러오고 있습니다</span>
		</Container>
	);
}
