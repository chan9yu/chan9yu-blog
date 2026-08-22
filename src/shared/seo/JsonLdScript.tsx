type JsonLdScriptProps = {
	id: string;
	data: object;
};

export function JsonLdScript({ id, data }: JsonLdScriptProps) {
	const json = JSON.stringify(data).replace(/</g, "\\u003c");
	return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
