<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	type $$Props = TabsPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export { className as class };
</script>

<TabsPrimitive.Root
	class={cn("w-full", className)}
	{value}
	on:valueChange={({ detail }) => onValueChange?.(detail)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.Root>
