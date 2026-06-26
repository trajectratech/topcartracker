// components/LottiePlayer.tsx
import { onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";
import lottie from "lottie-web";

interface Props {
	path: string;
}

export default function LottiePlayer(props: Props) {
	let containerRef: HTMLDivElement | undefined;

	onMount(() => {
		const reduceMotion =
			window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
		const connection =
			(navigator as any).connection ||
			(navigator as any).mozConnection ||
			(navigator as any).webkitConnection;
		const saveData = Boolean(connection?.saveData);
		const effectiveType = connection?.effectiveType as string | undefined;
		const isVerySlowNetwork = effectiveType === "2g" || effectiveType === "slow-2g";
		if (saveData || isVerySlowNetwork) return;

		const anim = lottie.loadAnimation({
			container: containerRef!,
			renderer: "svg",
			loop: !reduceMotion,
			autoplay: !reduceMotion,
			path: props.path,
		});

		if (reduceMotion) {
			anim.addEventListener("DOMLoaded", () => {
				anim.goToAndStop(0, true);
			});
		}

		onCleanup(() => anim.destroy());
	});

	return (
		<div
			class="w-full h-full max-w-md mx-auto"
			ref={(el) => (containerRef = el)}
		/>
	);
}
