<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Calendar, Users, Mail, Settings } from 'lucide-svelte';
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  type Student = {
    name: string;
    email: string;
    gender: string;
    dateOfBirth: string;
  };

  let students: Student[] = [];
  let totalStudents = 0;
  let upcomingBirthdays = 0;
  let emailsSent = 0;
  let nextBirthdays: (Student & { daysUntil: number })[] = [];

  onMount(() => {
    if (browser) {
      // Load students
      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        students = JSON.parse(savedStudents);
      }

      // Load email stats
      emailsSent = parseInt(localStorage.getItem('emailsSent') || '0');

      // Calculate statistics
      calculateStats();
    }
  });

  function calculateStats() {
    totalStudents = students.length;
    
    // Calculate upcoming birthdays
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    nextBirthdays = students.map(student => {
      const dob = new Date(student.dateOfBirth);
      const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...student, daysUntil };
    })
    .filter(student => student.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

    upcomingBirthdays = nextBirthdays.length;
  }

  $: if (browser && students) {
    calculateStats();
  }

  // Sample data for the overview
  const stats = [
    {
      title: "Total Students",
      value: "2,345",
      description: "Students in database",
      icon: Users
    },
    {
      title: "Upcoming Birthdays",
      value: "12",
      description: "Next 7 days",
      icon: Calendar
    },
    {
      title: "Emails Sent",
      value: "1,234",
      description: "This month",
      icon: Mail
    },
    {
      title: "Active Templates",
      value: "3",
      description: "Email templates",
      icon: Settings
    }
  ];

  const upcomingBirthdaysData = [
    { name: "John Doe", date: "2024-01-15", email: "john@example.com" },
    { name: "Jane Smith", date: "2024-01-16", email: "jane@example.com" },
    { name: "Mike Johnson", date: "2024-01-17", email: "mike@example.com" },
    { name: "Sarah Williams", date: "2024-01-18", email: "sarah@example.com" }
  ];

  const recentActivity = [
    { action: "Email sent", target: "John Doe", date: "2 hours ago" },
    { action: "Template updated", target: "Birthday Wishes", date: "5 hours ago" },
    { action: "Data imported", target: "new_students.xlsx", date: "1 day ago" },
    { action: "Email sent", target: "Jane Smith", date: "1 day ago" }
  ];
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
    <p class="text-muted-foreground">Overview of your birthday automation system.</p>
  </div>

  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{totalStudents}</div>
        <p class="text-xs text-muted-foreground">
          Students in database
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Upcoming Birthdays</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{upcomingBirthdays}</div>
        <p class="text-xs text-muted-foreground">
          In the next 30 days
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Emails Sent</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{emailsSent}</div>
        <p class="text-xs text-muted-foreground">
          Birthday wishes sent
        </p>
      </CardContent>
    </Card>
  </div>

  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
    <Card class="col-span-1 md:col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Birthdays</CardTitle>
        <CardDescription>Students with birthdays in the next 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each upcomingBirthdaysData as birthday}
              <TableRow>
                <TableCell>{birthday.name}</TableCell>
                <TableCell>{birthday.date}</TableCell>
                <TableCell class="font-mono">{birthday.email}</TableCell>
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card class="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and events in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each recentActivity as activity}
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">{activity.action}</p>
                <p class="text-sm text-muted-foreground">{activity.target}</p>
              </div>
              <p class="text-sm text-muted-foreground">{activity.date}</p>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  </div>

  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
    <Card class="col-span-1 md:col-span-4">
      <CardHeader>
        <CardTitle>Upcoming Birthdays</CardTitle>
        <CardDescription>Next 5 birthdays in chronological order.</CardDescription>
      </CardHeader>
      <CardContent>
        {#if nextBirthdays.length === 0}
          <p class="text-sm text-muted-foreground">No upcoming birthdays in the next 30 days.</p>
        {:else}
          <div class="space-y-4">
            {#each nextBirthdays as student}
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium">{student.name}</p>
                  <p class="text-sm text-muted-foreground">{student.email}</p>
                </div>
                <div class="text-sm">
                  {#if student.daysUntil === 0}
                    <span class="text-green-500 font-medium">Today!</span>
                  {:else if student.daysUntil === 1}
                    <span class="text-orange-500 font-medium">Tomorrow</span>
                  {:else}
                    <span class="text-muted-foreground">in {student.daysUntil} days</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </CardContent>
    </Card>
    <Card class="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium mb-1">Data Management</h4>
            <p class="text-sm text-muted-foreground">
              <a href="/data" class="text-primary hover:underline">Manage student data</a>
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium mb-1">Email Templates</h4>
            <p class="text-sm text-muted-foreground">
              <a href="/emails" class="text-primary hover:underline">Configure email templates</a>
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium mb-1">Settings</h4>
            <p class="text-sm text-muted-foreground">
              <a href="/settings" class="text-primary hover:underline">Manage application settings</a>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
