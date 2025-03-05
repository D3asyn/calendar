<script>
	import { onMount } from 'svelte';

	let events = [];
	let currentDate = new Date();
	let startOfWeek = getStartOfWeek(currentDate);
	let endOfWeek = getEndOfWeek(currentDate);
	let selectedEvent = null; // To track the selected event for the modal
	let showModal = false; // To control modal visibility

	// Function to get the start date of the current week
	function getStartOfWeek(date) {
		let day = date.getDay(),
			diff = date.getDate() - day + (day == 0 ? -6 : 1); // Adjust for Sunday
		let start = new Date(date.setDate(diff));
		start.setHours(0, 0, 0, 0); // Set to midnight
		return start;
	}

	// Function to get the end date of the current week
	function getEndOfWeek(date) {
		let start = getStartOfWeek(date);
		let end = new Date(start);
		end.setDate(start.getDate() + 6);
		return end;
	}

	// Update the week based on navigation
	function changeWeek(weeks) {
		currentDate.setDate(currentDate.getDate() + weeks * 7);
		startOfWeek = getStartOfWeek(currentDate);
		endOfWeek = getEndOfWeek(currentDate);
		fetchEvents();
	}

	// Fetch events based on the current week
	async function fetchEvents() {
		try {
			const response = await fetch(
				`/api/calendar?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`
			);
			const fetchedEvents = await response.json();

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

	// Handle day click to show event details in the modal
	function openModal(event) {
		selectedEvent = event;
		showModal = true;
	}

	// Close the modal
	function closeModal() {
		showModal = false;
	}

	onMount(() => {
		fetchEvents();
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Weekly Calendar</h1>

	<div class="mb-4 flex justify-between">
		<button class="rounded bg-gray-300 p-2" on:click={() => changeWeek(-1)}> Previous Week </button>
		<h2 class="text-lg font-medium">
			{startOfWeek.toDateString()} - {endOfWeek.toDateString()}
		</h2>
		<button class="rounded bg-gray-300 p-2" on:click={() => changeWeek(1)}> Next Week </button>
	</div>

	<!-- Grid Layout for Days -->
	<div class="grid grid-cols-7 gap-4">
		{#each Array.from({ length: 7 }, (_, index) => {
			// Calculate the day for each index
			let day = new Date(startOfWeek);
			day.setDate(startOfWeek.getDate() + index);
			return day;
		}) as day}
			<div
				class="flex min-h-[250px] flex-col items-start justify-start border-2 border-gray-300 p-4"
			>
				<!-- Display the day of the week -->
				<div class="mb-2 text-center font-medium text-gray-700">
					{day.toDateString().slice(0, 3)}
				</div>

				<!-- Display events for the day -->
				{#if events.some((event) => event.start.getDate() === day.getDate())}
					<div class="w-full">
						{#each events as event}
							{#if event.start.getDate() === day.getDate()}
								<div class="mb-2 rounded-md border border-gray-300 p-2 shadow-sm">
									<div class="text-sm font-medium text-blue-600">{event.text}</div>
									<div class="text-xs text-gray-500">{event.location}</div>
									<div class="text-xs text-gray-400">{event.start.toLocaleTimeString()}</div>
									<button class="mt-1 text-xs text-blue-500" on:click={() => openModal(event)}>
										Details
									</button>
								</div>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="text-center text-sm text-gray-500">No events</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Modal for Event Details -->
	{#if showModal}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div class="w-96 rounded-md bg-white p-6">
				<h3 class="mb-2 text-xl font-bold">{selectedEvent.text}</h3>
				<p class="mb-4 text-sm text-gray-700">{selectedEvent.location}</p>
				<p class="text-sm text-gray-500">{selectedEvent.start.toDateString()}</p>
				<button class="mt-4 w-full rounded bg-red-500 py-2 text-white" on:click={closeModal}>
					Close
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 900px;
	}

	/* Style for each day in the grid */
	.grid {
		grid-template-columns: repeat(7, 1fr);
	}

	/* Increase the width and space between event items */
	.event-item {
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
