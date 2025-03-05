<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav class="bg-gray-800 p-4">
	<div class="container mx-auto flex items-center justify-between">
		<h1 class="text-xl font-bold text-white">My Calendar</h1>
		<ul class="flex space-x-4">
			<li>
				<a href="/" class="text-gray-300 hover:text-white">Home</a>
			</li>
			<li>
				<a href="/calendar" class="text-gray-300 hover:text-white">Calendar</a>
			</li>
		</ul>
	</div>
</nav>
<div class="flex min-h-screen flex-col bg-gray-100">
	{@render children()}
</div>
