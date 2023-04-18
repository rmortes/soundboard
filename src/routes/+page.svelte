<script lang="ts">
	import { MagnifyingGlass } from 'radix-icons-svelte';
	import { liveQuery } from 'dexie';
	import { db } from '../db';
	import { browser } from '$app/environment';
	import AudioTile from '../components/AudioTile.svelte';
	import TalkBar from '../components/TalkBar.svelte';
	import { ActionIcon } from '@svelteuidev/core';

	let files = liveQuery(() => {
		return browser
			? db.files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase())).toArray()
			: [];
	});
	let search = '';
</script>

<TalkBar />

<!-- Search bar -->
<div class="flex flex-row items-center justify-end my-4">
	<div class="relative w-80">
		<input type="text" class="input w-full max-w-sm" placeholder="Search" bind:value={search} />
		<div class="absolute inset-y-0 right-0 flex items-center">
			<ActionIcon>
				<MagnifyingGlass />
			</ActionIcon>
		</div>
	</div>
</div>

<div class="grid">
	{#if $files}
		{#each $files as file (file.id)}
			<AudioTile fileId={file.id} />
		{/each}
	{/if}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		grid-gap: 1rem;
	}
</style>
