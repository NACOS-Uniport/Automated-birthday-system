<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Plus, Trash2, Edit, Send } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import emailjs from '@emailjs/browser';

	type Student = {
		name: string;
		email: string;
		gender: string;
		dateOfBirth: string;
	};

	type EmailTemplate = {
		id: string;
		name: string;
		subject: string;
		content: string;
	};

	let students: Student[] = [];
	let emailTemplate = '';
	let emailServiceId = '';
	let emailTemplateId = '';
	let publicKey = '';
	let isSending = false;
	let lastEmailSent = browser ? localStorage.getItem('lastEmailSent') || '' : '';

	let templates: EmailTemplate[] = [
		{
			id: '1',
			name: 'Default Template',
			subject: 'Happy Birthday!',
			content: `Dear [Name],

Happy Birthday! As [he/she] celebrates another year, the Faculty of Computing wishes [him/her] the very best. May this special day bring [him/her] joy and success in all [his/her] endeavors.

Best regards,
Faculty of Computing
University of Port Harcourt`
		}
	];

	let showNewTemplate = false;
	let newTemplate: EmailTemplate = {
		id: '',
		name: '',
		subject: '',
		content: ''
	};

	// Load saved data
	if (browser) {
		const savedStudents = localStorage.getItem('students');
		if (savedStudents) {
			students = JSON.parse(savedStudents);
		}

		const savedTemplates = localStorage.getItem('emailTemplates');
		if (savedTemplates) {
			templates = JSON.parse(savedTemplates);
		}

		emailTemplate = localStorage.getItem('emailTemplate') || templates[0].content;
		emailServiceId = localStorage.getItem('emailServiceId') || '';
		emailTemplateId = localStorage.getItem('emailTemplateId') || '';
		publicKey = localStorage.getItem('publicKey') || '';
	}

	function saveTemplates() {
		if (browser) {
			localStorage.setItem('emailTemplates', JSON.stringify(templates));
		}
	}

	function processTemplate(template: string, student: Student): string {
		return template
			.replace('[Name]', student.name)
			.replace(/\[he\/she\]/g, student.gender === 'male' ? 'he' : 'she')
			.replace(/\[him\/her\]/g, student.gender === 'male' ? 'him' : 'her')
			.replace(/\[his\/her\]/g, student.gender === 'male' ? 'his' : 'her');
	}

	function addTemplate() {
		if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
			alert('Please fill in all fields');
			return;
		}

		templates = [
			...templates,
			{
				...newTemplate,
				id: Date.now().toString()
			}
		];
		saveTemplates();
		showNewTemplate = false;
		newTemplate = {
			id: '',
			name: '',
			subject: '',
			content: ''
		};
	}

	function deleteTemplate(id: string) {
		if (templates.length === 1) {
			alert('Cannot delete the last template');
			return;
		}

		if (confirm('Are you sure you want to delete this template?')) {
			templates = templates.filter((t) => t.id !== id);
			saveTemplates();
		}
	}

	function useTemplate(template: EmailTemplate) {
		emailTemplate = template.content;
		if (browser) {
			localStorage.setItem('emailTemplate', template.content);
		}
	}

	async function sendBirthdayEmails() {
		if (!emailServiceId || !emailTemplateId || !publicKey) {
			alert('Please configure email settings first in the Settings page.');
			return;
		}

		isSending = true;
		const today = new Date();
		const todayString = today.toISOString().split('T')[0];

		// Don't send emails if already sent today
		if (lastEmailSent === todayString) {
			alert('Birthday emails have already been sent today.');
			isSending = false;
			return;
		}

		try {
			emailjs.init(publicKey);

			const birthdayStudents = students.filter((student) => {
				const dob = new Date(student.dateOfBirth);
				return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
			});

			if (birthdayStudents.length === 0) {
				alert('No birthdays today!');
				isSending = false;
				return;
			}

			let sentCount = 0;
			for (const student of birthdayStudents) {
				try {
					await emailjs.send(emailServiceId, emailTemplateId, {
						to_name: student.name,
						to_email: student.email, // Try changing this parameter name
						message: processTemplate(emailTemplate, student)
					});
					sentCount++;
				} catch (error) {
					console.error(`Failed to send email to ${student.email}:`, error);
				}
			}

			// Update stats
			const currentSent = parseInt(localStorage.getItem('emailsSent') || '0');
			localStorage.setItem('emailsSent', (currentSent + sentCount).toString());
			localStorage.setItem('lastEmailSent', todayString);
			lastEmailSent = todayString;

			alert(`Successfully sent ${sentCount} birthday emails!`);
		} catch (error) {
			console.error('Error sending emails:', error);
			alert('Failed to send emails. Please check your email configuration.');
		} finally {
			isSending = false;
		}
	}

	function previewEmails() {
		const today = new Date();
		const birthdayStudents = students.filter((student) => {
			const dob = new Date(student.dateOfBirth);
			return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
		});

		if (birthdayStudents.length === 0) {
			alert('No birthdays today!');
			return;
		}

		let preview = 'Birthday Emails Preview:\n\n';
		for (const student of birthdayStudents) {
			preview += `To: ${student.name} (${student.email})\n`;
			preview += `Message:\n${processTemplate(emailTemplate, student)}\n\n`;
		}

		alert(preview);
	}

	function testTemplate(template: EmailTemplate) {
		const testData: Student = {
			name: 'John Doe',
			email: 'test@example.com',
			gender: 'male',
			dateOfBirth: '2000-01-01'
		};

		alert(
			`Test Preview:\n\nSubject: ${template.subject}\n\n${processTemplate(template.content, testData)}`
		);
	}
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<h2 class="text-3xl font-bold tracking-tight">Email Management</h2>
		<p class="text-muted-foreground">Manage email templates and send birthday wishes.</p>
	</div>

	<div class="grid grid-cols-1 gap-6">
		<Card class="w-full">
			<CardHeader>
				<div
					class="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0"
				>
					<div>
						<CardTitle>Email Templates</CardTitle>
						<CardDescription>Create and manage email templates for birthday wishes.</CardDescription
						>
					</div>
					<Button
						variant="outline"
						class="w-full sm:w-auto"
						on:click={() => (showNewTemplate = true)}
					>
						<Plus class="mr-2 h-4 w-4" />
						Add Template
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div class="overflow-x-auto rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="whitespace-nowrap">Name</TableHead>
								<TableHead class="whitespace-nowrap">Subject</TableHead>
								<TableHead class="w-[150px] whitespace-nowrap">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each templates as template}
								<TableRow>
									<TableCell class="whitespace-nowrap">{template.name}</TableCell>
									<TableCell class="whitespace-nowrap">{template.subject}</TableCell>
									<TableCell class="whitespace-nowrap">
										<div class="flex space-x-2">
											<Button
												variant="ghost"
												size="icon"
												on:click={() => testTemplate(template)}
												title="Test Template"
											>
												<Send class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												on:click={() => useTemplate(template)}
												title="Use Template"
											>
												<Edit class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												class="text-destructive"
												on:click={() => deleteTemplate(template.id)}
												title="Delete Template"
											>
												<Trash2 class="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>

		<Card class="w-full">
			<CardHeader>
				<CardTitle>Birthday Emails</CardTitle>
				<CardDescription>Send birthday wishes to students with birthdays today.</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-2">
					<Label>Email Status</Label>
					<p class="text-sm text-muted-foreground">
						{#if lastEmailSent === new Date().toISOString().split('T')[0]}
							Birthday emails have been sent today.
						{:else}
							Birthday emails have not been sent today.
						{/if}
					</p>
				</div>

				<div class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
					<Button variant="outline" class="w-full sm:w-auto" on:click={previewEmails}>
						Preview Today's Emails
					</Button>
					<Button
						class="w-full sm:w-auto"
						on:click={sendBirthdayEmails}
						disabled={isSending || lastEmailSent === new Date().toISOString().split('T')[0]}
					>
						{isSending ? 'Sending...' : 'Send Birthday Emails'}
					</Button>
				</div>

				<div class="space-y-2">
					<Label>Configuration</Label>
					<p class="text-sm text-muted-foreground">
						{#if !emailServiceId || !emailTemplateId || !publicKey}
							Email settings are not configured. Please configure them in the
							<a href="/settings" class="text-primary hover:underline">Settings</a> page.
						{:else}
							Email settings are configured and ready to use.
						{/if}
					</p>
				</div>
			</CardContent>
		</Card>
	</div>

	{#if showNewTemplate}
		<div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
			<div
				class="fixed left-[50%] top-[50%] z-50 grid w-[95%] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 shadow-lg duration-200 sm:w-full sm:rounded-lg sm:p-6"
			>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="templateName">Template Name</Label>
						<Input
							id="templateName"
							bind:value={newTemplate.name}
							placeholder="Enter template name"
							class="w-full"
						/>
					</div>
					<div class="space-y-2">
						<Label for="templateSubject">Email Subject</Label>
						<Input
							id="templateSubject"
							bind:value={newTemplate.subject}
							placeholder="Enter email subject"
							class="w-full"
						/>
					</div>
					<div class="space-y-2">
						<Label for="templateContent">Email Content</Label>
						<Textarea
							id="templateContent"
							bind:value={newTemplate.content}
							rows={6}
							placeholder="Enter email content"
							class="w-full"
						/>
						<p class="text-sm text-muted-foreground">
							Use [Name], [he/she], [him/her], [his/her] as placeholders.
						</p>
					</div>
					<div class="flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
						<Button
							variant="outline"
							class="w-full sm:w-auto"
							on:click={() => (showNewTemplate = false)}
						>
							Cancel
						</Button>
						<Button class="w-full sm:w-auto" on:click={addTemplate}>Save Template</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
