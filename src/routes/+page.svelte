<script>
	import { onMount } from 'svelte';

	let events = [];

	async function fetchEvents() {
		try {
			const response = await fetch('/api/calendar');
			const fetchedEvents = await response.json();
			console.log(fetchedEvents);

			// Ensure each event's start date is parsed as a Date object
			events = fetchedEvents.map((event) => ({
				start: new Date(event.start),
				text: event.text,
				location: event.location
			}));
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	}

	onMount(() => {
		fetchEvents();
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Calendar Events</h1>
	<table class="min-w-full border border-gray-300 bg-white">
		<thead>
			<tr>
				<th class="border-b px-4 py-2">Date</th>
				<th class="border-b px-4 py-2">Title</th>
				<th class="border-b px-4 py-2">Location</th>
			</tr>
		</thead>
		<tbody>
			{#each events as event}
				<tr>
					<td class="border-b px-4 py-2">{event.start.toDateString()}</td>
					<td class="border-b px-4 py-2">{event.text}</td>
					<td class="border-b px-4 py-2">{event.location}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.container {
		max-width: 800px;
	}
</style>
