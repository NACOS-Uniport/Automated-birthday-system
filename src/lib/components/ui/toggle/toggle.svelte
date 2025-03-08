<script lang="ts">
	import { Toggle as TogglePrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = TogglePrimitive.Props;

	let className: $$Props["class"] = undefined;
	export let pressed: $$Props["pressed"] = undefined;
	export let onPressedChange: ((pressed: boolean) => void) | undefined = undefined;
	export { className as class };
</script>

<TogglePrimitive.Root
	class={cn(
		"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
		className
	)}
	{pressed}
	on:click={() => onPressedChange?.(!pressed)}
	{...$$restProps}
>
	<slot />
</TogglePrimitive.Root>
