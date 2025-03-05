<script>
	export let event;
	export let isOpen = false;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

{#if isOpen && event}
	<div class="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
		<div class="rounded bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-lg font-semibold">Event on {event.start.toDateString()}</h3>
			<p><strong>Title:</strong> {event.text}</p>
			<p><strong>Location:</strong> {event.location}</p>
			<button on:click={closeModal} class="mt-4 rounded bg-gray-200 px-4 py-2">Close</button>
		</div>
	</div>
{/if}

<style>
	/* Add any additional styling for the modal here */
</style>
