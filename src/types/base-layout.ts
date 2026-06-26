import type { SectionKey, ThemeConfig } from "./theme";

export type PageMetadata = {
	title: string;
	description: string;
	canonicalUrl: string;
	keywords: string[];
	siteName: string;
	ogImage: string;
	ogImageAlt: string;
	locale: string;
	twitterHandle?: string;
	type?: "website" | "article";
	robots?: string;
};

export type BaseLayoutProps = {
	data: ThemeConfig;
	layout: SectionKey[];
	colorVars: Record<
		| "--color-primary"
		| "--color-secondary"
		| "--color-accent"
		| "--color-background"
		| "--color-text"
		| "--color-heading"
		| "--color-link"
		| "--color-hover"
		| "--color-active"
		| "--color-error"
		| "--color-success"
		| "--color-muted",
		string
	>;
	metadata: PageMetadata;
	structuredData: Record<string, any>[];
	sameAsUrls: string[];
};
