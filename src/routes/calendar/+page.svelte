<script>
	import { onMount } from 'svelte';

	let events = [];
	let currentDate = new Date();
	let startOfWeek = getStartOfWeek(currentDate);
	let endOfWeek = getEndOfWeek(currentDate);
	let selectedEvent = null;
	let showModal = false;

	function getStartOfWeek(date) {
		let day = date.getDay(),
			diff = date.getDate() - day + (day == 0 ? -6 : 1);
		let start = new Date(date.setDate(diff));
		start.setHours(0, 0, 0, 0);
		return start;
	}

	function getEndOfWeek(date) {
		let start = getStartOfWeek(date);
		let end = new Date(start);
		end.setDate(start.getDate() + 6);
		return end;
	}

	function changeWeek(weeks) {
		currentDate.setDate(currentDate.getDate() + weeks * 7);
		startOfWeek = getStartOfWeek(currentDate);
		endOfWeek = getEndOfWeek(currentDate);
		fetchEvents();
	}

	async function fetchEvents() {
		try {
			const response = await fetch(
				`/api/calendar?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`
			);
			const fetchedEvents = await response.json();

			events = fetchedEvents.map((event) => ({
				start: new Date(event.start),
				text: event.text,
				location: event.location
			}));
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	}

	function openModal(event) {
		selectedEvent = event;
		showModal = true;
	}

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
		<button class="rounded bg-gray-300 p-2" onclick={() => changeWeek(-1)}> Previous Week </button>
		<h2 class="text-lg font-medium">
			{startOfWeek.toDateString()} - {endOfWeek.toDateString()}
		</h2>
		<button class="rounded bg-gray-300 p-2" onclick={() => changeWeek(1)}> Next Week </button>
	</div>

	<!-- Grid Layout for Days with 24-hour slots -->
	<div class="grid grid-cols-7 gap-2">
		{#each Array.from({ length: 7 }, (_, index) => {
			let day = new Date(startOfWeek);
			day.setDate(startOfWeek.getDate() + index);
			return day;
		}) as day}
			<div class="border border-gray-300 p-2">
				<div class="text-center font-bold">{day.toDateString().slice(0, 3)}</div>
				<div class="border-t">
					{#each Array.from({ length: 24 }) as _, hour}
						<div class="relative h-10 border-b border-gray-200">
							<div class="absolute left-0 text-xs text-gray-500">{hour}:00</div>
							{#each events.filter((event) => event.start.getDate() === day.getDate() && event.start.getHours() === hour) as event}
								<div
									class="absolute right-0 left-10 rounded-md bg-blue-200 p-1 shadow"
									onclick={() => openModal(event)}
								>
									{event.text}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#if showModal}
		<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
			<div class="w-96 rounded-md bg-white p-6">
				<h3 class="mb-2 text-xl font-bold">{selectedEvent.text}</h3>
				<p class="mb-4 text-sm text-gray-700">{selectedEvent.location}</p>
				<p class="text-sm text-gray-500">
					{selectedEvent.start.toDateString()} at {selectedEvent.start.toLocaleTimeString()}
				</p>
				<button class="mt-4 w-full rounded bg-red-500 py-2 text-white" onclick={closeModal}>
					Close
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
	}

	.grid {
		grid-template-columns: repeat(7, 1fr);
	}
</style>
