// src/components/ProductGallery.tsx
import { createSignal, createEffect, onCleanup, Show, For } from "solid-js";
import type { Component } from "solid-js";
import type { Product } from "../../types/product";

interface Props {
	products: Product[];
}

const ProductGallery: Component<Props> = (props) => {
	const [selectedProduct, setSelectedProduct] = createSignal<Product | null>(
		null,
	);
	let modalRef: HTMLDivElement | undefined;

	const handleProductClick = (product: Product) => {
		setSelectedProduct(product);
	};

	const closeModal = () => {
		setSelectedProduct(null);
	};

	createEffect(() => {
		if (!selectedProduct()) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", onKeyDown);
		queueMicrotask(() => modalRef?.focus?.());
		onCleanup(() => window.removeEventListener("keydown", onKeyDown));
	});

	return (
		<div>
			<section class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<For each={props.products}>
					{(product) => (
						<button
							type="button"
							class="cursor-pointer border rounded-lg p-4 hover:shadow-lg transition text-left"
							style="border-color: color-mix(in srgb, var(--color-muted) 55%, transparent); background: var(--color-background); color: var(--color-text);"
							onClick={() => handleProductClick(product)}
							aria-label={`View details for ${product.title}`}
						>
							<h3 class="font-semibold" style="color: var(--color-heading);">{product.title}</h3>
							<p class="text-sm" style="color: var(--color-text);">{product.description}</p>
						</button>
					)}
				</For>
			</section>

			<Show when={selectedProduct()}>
				<div
					class="fixed inset-0 flex items-center justify-center z-50 px-4"
					style="background: color-mix(in srgb, var(--color-heading) 45%, transparent);"
					onClick={(e) => {
						if (e.target === e.currentTarget) closeModal();
					}}
				>
					<div
						ref={(el) => (modalRef = el)}
						tabIndex={-1}
						role="dialog"
						aria-modal="true"
						aria-labelledby="product-gallery-title"
						class="max-w-md w-full p-6 rounded-lg relative"
						style="background: var(--color-background); border: 1px solid color-mix(in srgb, var(--color-muted) 55%, transparent); color: var(--color-text);"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 id="product-gallery-title" class="text-xl font-bold" style="color: var(--color-heading);">{selectedProduct()!.title}</h2>
						<p>{selectedProduct()!.description}</p>
						<button class="absolute top-2 right-2 text-sm" onClick={closeModal} type="button" aria-label="Close">
							✕
						</button>
					</div>
				</div>
			</Show>
		</div>
	);
};

export default ProductGallery;
