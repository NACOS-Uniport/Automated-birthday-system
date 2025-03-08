<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
	import { read, utils, SSF } from 'xlsx';
	import { browser } from "$app/environment";
	import { AutoEmailService } from '$lib/services/autoEmailService';

	type Student = {
		name: string;
		email: string;
		gender: string;
		dateOfBirth: string;
	};

	let students: Student[] = [];
	let searchQuery = '';
	let fileInput: HTMLInputElement;

	// Load saved students on mount
	if (browser) {
		const savedStudents = localStorage.getItem('students');
		if (savedStudents) {
			students = JSON.parse(savedStudents);
		}
	}

	// Function to properly format Excel dates
	function formatExcelDate(excelDate: any): string {
		// Check if it's a number (Excel serial date)
		if (typeof excelDate === 'number') {
			// Convert Excel date to JavaScript Date
			// Excel dates are days since 1900-01-01, with a 2-day offset correction
			const jsDate = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
			// Format to YYYY-MM-DD
			return jsDate.toISOString().split('T')[0];
		} 
		// If it's already a string in a date format
		else if (typeof excelDate === 'string') {
			// Try to parse as date if it's not already in YYYY-MM-DD format
			if (!/^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
				try {
					const date = new Date(excelDate);
					if (!isNaN(date.getTime())) {
						return date.toISOString().split('T')[0];
					}
				} catch (e) {
					// If parsing fails, return the original string
				}
			}
			return excelDate;
		}
		return String(excelDate);
	}

	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = read(data, { type: 'array', cellDates: true });
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];
				
				// Convert to JSON with raw values
				const jsonData = utils.sheet_to_json(worksheet, { raw: false });
				
				// Validate and format data
				const formattedData = jsonData.map((row: any) => ({
					name: row.Name || row.name,
					email: row.Email || row.email,
					gender: ((row.Gender || row.gender || '').toString().toLowerCase()),
					dateOfBirth: formatExcelDate(row.DateOfBirth || row['Date of Birth'] || row.DOB || row.dob)
				}));

				// Validate required fields
				const invalidData = formattedData.filter(
					(student: any) => !student.name || !student.email || !student.gender || !student.dateOfBirth
				);

				if (invalidData.length > 0) {
					alert('Some records are missing required fields. Please check your Excel file.');
					return;
				}

				// Save to localStorage
				localStorage.setItem('students', JSON.stringify(formattedData));
				students = formattedData;

				// Start automatic email service
				AutoEmailService.getInstance().startAutoEmailService();

				alert('Data imported successfully!');
			} catch (error) {
				console.error('Error processing file:', error);
				alert('Error processing file. Please check the file format and try again.');
			}
		};

		reader.readAsArrayBuffer(file);
	}

	function saveStudents() {
		if (browser) {
			localStorage.setItem('students', JSON.stringify(students));
		}
	}

	function exportStudents() {
		const worksheet = utils.json_to_sheet(students);
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, worksheet, 'Students');
		
		// Generate file
		const wbout = utils.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([wbout], { type: 'application/octet-stream' });
		
		// Create download link
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'students.xlsx';
		a.click();
		window.URL.revokeObjectURL(url);
	}

	function removeStudent(index: number) {
		if (confirm('Are you sure you want to remove this student?')) {
			students = students.filter((_, i) => i !== index);
			saveStudents();
		}
	}

	$: filteredStudents = students.filter(student =>
		student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		student.email.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
		<div class="space-y-1">
			<h2 class="text-3xl font-bold tracking-tight">Student Data Management</h2>
			<p class="text-muted-foreground">Upload and manage student information for birthday wishes.</p>
		</div>
		<div class="flex w-full sm:w-auto space-x-2">
			<Button variant="outline" class="flex-1 sm:flex-none" on:click={() => fileInput.click()}>
				Import Excel
			</Button>
			<Button variant="outline" class="flex-1 sm:flex-none" on:click={exportStudents} disabled={students.length === 0}>
				Export Excel
			</Button>
		</div>
	</div>

	<input
		type="file"
		accept=".xlsx,.xls,.csv"
		class="hidden"
		bind:this={fileInput}
		on:change={handleFileUpload}
	/>

	<Card>
		<CardHeader>
			<CardTitle>Students</CardTitle>
			<CardDescription>
				Manage student information for automated birthday wishes.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<div class="flex items-center">
					<Input
						placeholder="Search students..."
						bind:value={searchQuery}
						class="w-full"
					/>
				</div>

				<div class="rounded-md border overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="whitespace-nowrap">Name</TableHead>
								<TableHead class="whitespace-nowrap">Email</TableHead>
								<TableHead class="whitespace-nowrap">Gender</TableHead>
								<TableHead class="whitespace-nowrap">Date of Birth</TableHead>
								<TableHead class="whitespace-nowrap w-[100px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#if filteredStudents.length === 0}
								<TableRow>
									<TableCell colspan="5" class="text-center">
										No students found. Import an Excel file to get started.
									</TableCell>
								</TableRow>
							{:else}
								{#each filteredStudents as student, i}
									<TableRow>
										<TableCell class="whitespace-nowrap">{student.name}</TableCell>
										<TableCell class="whitespace-nowrap">{student.email}</TableCell>
										<TableCell class="whitespace-nowrap">{student.gender}</TableCell>
										<TableCell class="whitespace-nowrap">{student.dateOfBirth}</TableCell>
										<TableCell class="whitespace-nowrap">
											<Button
												variant="ghost"
												size="sm"
												on:click={() => removeStudent(i)}
											>
												Remove
											</Button>
										</TableCell>
									</TableRow>
								{/each}
							{/if}
						</TableBody>
					</Table>
				</div>
			</div>
		</CardContent>
	</Card>
</div>