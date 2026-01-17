<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte'
	let { children } = $props();
</script>


<div class="min-h-screen flex flex-col bg-black">
	<main class="flex-1 pb-40">
		{@render children()}
	</main>

	<Footer/>
</div>
