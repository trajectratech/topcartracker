import type { JSX } from "solid-js";
import { createSignal, createMemo, For, Show } from "solid-js";

import ProductCard from "./product-card";
import ProductModal from "./product-modal";
import type { Product } from "../../types/product";

interface Props {
	products: Product[];
	heading: string;
}

type SortOption = "priceAsc" | "priceDesc" | "ratingAsc" | "ratingDesc";

export default function Products({ products, heading }: Props): JSX.Element {
	const [searchQuery, setSearchQuery] = createSignal("");
	const [sortOption, setSortOption] = createSignal<SortOption>("priceAsc");
	const [selectedTags, setSelectedTags] = createSignal<string[]>([]);
	const [selectedProduct, setSelectedProduct] = createSignal<Product | null>(
		null,
	);

	const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])));

	const filteredProducts = createMemo(() => {
		let _products = [...(products || [])];

		// Search filter
		if (searchQuery()) {
			const query = searchQuery().toLowerCase();
			_products = products.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.description?.toLowerCase().includes(query),
			);
		}

		// Tag filter
		if (selectedTags().length > 0) {
			_products = products.filter((p) =>
				p.tags?.some((tag) => selectedTags().includes(tag)),
			);
		}

		// Sorting
		_products.sort((a, b) => {
			switch (sortOption()) {
				case "priceAsc":
					return a.price - b.price;
				case "priceDesc":
					return b.price - a.price;
				case "ratingAsc":
					return (a.rating?.score ?? 0) - (b.rating?.score ?? 0);
				case "ratingDesc":
					return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
			}
		});

		return _products;
	});

	const toggleTag = (tag: string) => {
		const current = selectedTags();
		setSelectedTags(
			current.includes(tag)
				? current.filter((t) => t !== tag)
				: [...current, tag],
		);
	};

	return (
		<section
			id="products"
			aria-labelledby="products-heading"
			class="px-4 py-6 md:px-8 lg:px-16 scrolling-section"
		>
			{heading && (
				<h2
					id="products-heading"
					class="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-[var(--color-heading)]"
				>
					{heading}
				</h2>
			)}

			<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="flex flex-col sm:flex-row sm:items-center gap-3">
					<div class="flex flex-col gap-1">
						<label
							for="product-search"
							class="text-sm font-medium"
							style="color: var(--color-text);"
						>
							Search
						</label>
						<input
							id="product-search"
							type="search"
							placeholder="Search products"
							value={searchQuery()}
							onInput={(e) => setSearchQuery(e.currentTarget.value)}
							autocomplete="off"
							class="px-4 py-2 rounded border border-[var(--color-primary)] bg-[var(--color-background)] w-full sm:w-72"
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label
							for="product-sort"
							class="text-sm font-medium"
							style="color: var(--color-text);"
						>
							Sort
						</label>
						<select
							id="product-sort"
							value={sortOption()}
							onChange={(e) =>
								setSortOption(e.currentTarget.value as SortOption)
							}
							class="px-4 py-2 rounded-lg border border-[var(--color-primary)] bg-[var(--color-background)] text-sm shadow-sm transition hover:border-[var(--color-primary)]"
							style="color: var(--color-heading);"
						>
							<option value="priceAsc">Price: Low to High</option>
							<option value="priceDesc">Price: High to Low</option>
							<option value="ratingAsc">Rating: Low to High</option>
							<option value="ratingDesc">Rating: High to Low</option>
						</select>
					</div>
				</div>
			</div>

			<div class="my-4">
				<Show when={allTags.length > 0}>
					<div class="flex flex-wrap gap-2">
						<For each={allTags}>
							{(tag) => (
								<button
									onClick={() => toggleTag(tag)}
									type="button"
									aria-pressed={selectedTags().includes(tag)}
									class={`cursor-pointer px-3 py-1 rounded-full border text-sm hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] ${
										selectedTags().includes(tag)
											? "bg-[var(--color-primary)] text-[var(--color-background)]"
											: "border-[var(--color-primary)] text-[var(--color-primary)]"
									}`}
								>
									{tag}
								</button>
							)}
						</For>
					</div>
				</Show>
			</div>

			<Show
				when={filteredProducts().length > 0}
				fallback={
					<p class="text-center" style="color: var(--color-text-muted);">
						No products found.
					</p>
				}
			>
				<section
					class="
					flex gap-4 overflow-x-auto px-2 py-4 scroll-smooth scroll-px-4 
					snap-x snap-mandatory 
					scrollbar-thin scrollbar-thumb-[color-mix(in_srgb,var(--color-heading)_25%,transparent)] scrollbar-track-transparent
					sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
					sm:overflow-x-visible
					"
				>
					<For each={filteredProducts()}>
						{(product) => (
							<div class="flex-shrink-0 w-[80%] snap-start sm:w-auto">
								<ProductCard
									product={product}
									onClick={() => setSelectedProduct(product)}
								/>
							</div>
						)}
					</For>
				</section>
			</Show>

			{selectedProduct() && (
				<ProductModal
					isOpen={!!selectedProduct()}
					product={selectedProduct() as Product}
					onClose={() => setSelectedProduct(null)}
				/>
			)}
		</section>
	);
}
