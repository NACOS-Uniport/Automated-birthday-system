<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Button } from "$lib/components/ui/button";
	import { Sun, Moon, Settings, Home, Mail, Database, Menu, X } from 'lucide-svelte';
	import { Toggle } from "$lib/components/ui/toggle";
	
	let isSidebarOpen = false;
	let isDarkMode = false;
	
	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen;
	};
	
	const toggleTheme = () => {
		isDarkMode = !isDarkMode;
		document.documentElement.classList.toggle('dark');
	};
	
	const navItems = [
		{ href: '/', label: 'Overview', icon: Home },
		{ href: '/emails', label: 'Email Templates', icon: Mail },
		{ href: '/data', label: 'Data Management', icon: Database },
		{ href: '/settings', label: 'Settings', icon: Settings }
	];
</script>

<div class="min-h-screen bg-white dark:bg-gray-900">
	<!-- Mobile Header -->
	<div class="lg:hidden flex items-center justify-between p-4 bg-green-600 text-white shadow-2xl">
		<div class="flex items-center space-x-2">
			<Button variant="ghost" size="icon" on:click={toggleSidebar}>
				<Menu class="h-6 w-6" />
			</Button>
			<span class="font-bold text-lg">FOC UNIPORT</span>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="flex h-[calc(100vh-4rem)] lg:h-screen">
		<aside class="{isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-green-600 text-white transition-transform duration-300 ease-in-out">
			<div class="flex flex-col h-full">
				<!-- Logo -->
				<div class="flex items-center justify-between p-4 border-b border-green-500">
					<span class="font-bold text-xl">Birthday Automation</span>

				<!-- Mobile Close Button -->
					<Button variant="ghost" size="icon" on:click={toggleSidebar} class="lg:hidden">
						<X class="h-6 w-6" />
					</Button>
				</div>

				<!-- Navigation -->
				<nav class="flex-1 p-4 space-y-2">
					{#each navItems as item}
						<a 
							href={item.href} 
							class="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors {$page.url.pathname === item.href ? 'bg-green-700' : ''}"
						>
							<svelte:component this={item.icon} class="h-5 w-5" />
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>

				<!-- Footer -->
				<div class="p-4 border-t border-green-500">
					<div class="text-sm opacity-75">
						&copy; 2024/2025 FOC UNIPORT
						<span class="lg:inline text-green-500">|</span>
						<a href="https://giddelwilson.vercel.app/" class="text-green-500 hover:underline">
							Giddel Wilson
					</div>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
			<div class="container mx-auto p-6">
				<slot />
			</div>
		</main>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		@apply scroll-smooth;
	}
	
	:global(body) {
		@apply m-0 p-0;
	}
</style>
