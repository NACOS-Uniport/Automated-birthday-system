<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Input } from "$lib/components/ui/input";
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import { browser } from "$app/environment";

	// Theme handling
	let currentTheme = browser ? localStorage.getItem('theme') || 'system' : 'system';

	function setTheme(theme: 'light' | 'dark' | 'system') {
		currentTheme = theme;
		if (browser) {
			localStorage.setItem('theme', theme);
			if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	// Email template handling
	let defaultTemplate = `Dear [Name],

Happy Birthday! As [he/she] celebrates another year, the Faculty of Computing wishes [him/her] the very best. May this special day bring [him/her] joy and success in all [his/her] endeavors.

Best regards,
Faculty of Computing
University of Port Harcourt`;

	let emailTemplate = browser ? localStorage.getItem('emailTemplate') || defaultTemplate : defaultTemplate;
	let emailServiceId = browser ? localStorage.getItem('emailServiceId') || '' : '';
	let emailTemplateId = browser ? localStorage.getItem('emailTemplateId') || '' : '';
	let publicKey = browser ? localStorage.getItem('publicKey') || '' : '';

	function saveEmailSettings() {
		if (browser) {
			localStorage.setItem('emailTemplate', emailTemplate);
			localStorage.setItem('emailServiceId', emailServiceId);
			localStorage.setItem('emailTemplateId', emailTemplateId);
			localStorage.setItem('publicKey', publicKey);
		}
		// Show success message
		alert('Email settings saved successfully!');
	}

	function testEmailTemplate() {
		const testData = {
			name: 'John Doe',
			gender: 'male',
			email: 'test@example.com'
		};

		let testTemplate = emailTemplate
			.replace('[Name]', testData.name)
			.replace(/\[he\/she\]/g, testData.gender === 'male' ? 'he' : 'she')
			.replace(/\[him\/her\]/g, testData.gender === 'male' ? 'him' : 'her')
			.replace(/\[his\/her\]/g, testData.gender === 'male' ? 'his' : 'her');

		alert('Preview of processed template:\n\n' + testTemplate);
	}
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<h2 class="text-3xl font-bold tracking-tight">Settings</h2>
		<p class="text-muted-foreground">Manage your application settings and preferences.</p>
	</div>

	<Tabs value="email" class="w-full">
		<TabsList class="w-full flex-wrap justify-start">
			<TabsTrigger value="email" class="flex-1 sm:flex-none">Email Settings</TabsTrigger>
			<TabsTrigger value="appearance" class="flex-1 sm:flex-none">Appearance</TabsTrigger>
			<TabsTrigger value="data" class="flex-1 sm:flex-none">Data Management</TabsTrigger>
		</TabsList>

		<TabsContent value="email">
			<Card>
				<CardHeader>
					<CardTitle>Email Configuration</CardTitle>
					<CardDescription>
						Configure your email template and EmailJS credentials for sending birthday wishes.
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="grid gap-4 grid-cols-1">
						<div class="space-y-2">
							<Label for="template">Email Template</Label>
							<Textarea
								id="template"
								bind:value={emailTemplate}
								rows={8}
								placeholder="Enter your email template..."
								class="w-full"
							/>
							<p class="text-sm text-muted-foreground">
								Use [Name], [he/she], [him/her], [his/her] as placeholders for gender-specific content.
							</p>
						</div>

						<div class="space-y-2">
							<Label for="serviceId">EmailJS Service ID</Label>
							<Input
								id="serviceId"
								bind:value={emailServiceId}
								placeholder="Enter your EmailJS Service ID"
								class="w-full"
							/>
						</div>

						<div class="space-y-2">
							<Label for="templateId">EmailJS Template ID</Label>
							<Input
								id="templateId"
								bind:value={emailTemplateId}
								placeholder="Enter your EmailJS Template ID"
								class="w-full"
							/>
						</div>

						<div class="space-y-2">
							<Label for="publicKey">EmailJS Public Key</Label>
							<Input
								id="publicKey"
								bind:value={publicKey}
								type="password"
								placeholder="Enter your EmailJS Public Key"
								class="w-full"
							/>
						</div>

						<div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
							<Button variant="outline" class="w-full sm:w-auto" on:click={() => emailTemplate = defaultTemplate}>
								Reset Template
							</Button>
							<Button variant="outline" class="w-full sm:w-auto" on:click={testEmailTemplate}>
								Test Template
							</Button>
							<Button class="w-full sm:w-auto" on:click={saveEmailSettings}>Save Changes</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="appearance">
			<Card>
				<CardHeader>
					<CardTitle>Appearance Settings</CardTitle>
					<CardDescription>
						Customize the appearance of your application.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						<Label>Theme</Label>
						<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
							<Button
								variant={currentTheme === 'light' ? 'default' : 'outline'}
								class="w-full sm:w-auto"
								on:click={() => setTheme('light')}
							>
								Light
							</Button>
							<Button
								variant={currentTheme === 'dark' ? 'default' : 'outline'}
								class="w-full sm:w-auto"
								on:click={() => setTheme('dark')}
							>
								Dark
							</Button>
							<Button
								variant={currentTheme === 'system' ? 'default' : 'outline'}
								class="w-full sm:w-auto"
								on:click={() => setTheme('system')}
							>
								System
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>

		<TabsContent value="data">
			<Card>
				<CardHeader>
					<CardTitle>Data Management</CardTitle>
					<CardDescription>
						Manage your application data and storage settings.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="space-y-2">
							<Label>Local Storage</Label>
							<p class="text-sm text-muted-foreground">
								Clear all stored data including student information and email templates.
							</p>
						</div>
						<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
							<Button
								variant="destructive"
								class="w-full sm:w-auto"
								on:click={() => {
									if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
										localStorage.clear();
										window.location.reload();
									}
								}}
							>
								Clear All Data
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>
</div>
