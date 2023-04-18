<svelte:options immutable />

<script lang="ts">
	import { Play, Pause, Stop, Gear, Trash } from 'radix-icons-svelte';
	import { filesize } from 'filesize';
	import { ActionIcon, Modal, TextInput } from '@svelteuidev/core';
	import { db } from '../db';
	import Tile from './Tile.svelte';
	import { browser } from '$app/environment';
	import { liveQuery } from 'dexie';

	export let fileId: number | undefined;

	let file = liveQuery(() => {
		return browser && fileId ? db.files.get(fileId) : undefined;
	});

	let audio: HTMLAudioElement | undefined;
	let playing = false;
	let openEdit = false;
	let progress = 0;
	let volume: number | undefined = undefined;
	let audioBlobUrl: string | undefined = undefined;

	$: if ($file?.volume) {
		volume = $file.volume;
	}

	function play() {
		audio?.play();
		playing = true;
	}

	function pause() {
		audio?.pause();
		playing = false;
	}

	function stop() {
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		playing = false;
	}

	$: audio?.addEventListener('timeupdate', (e) => {
		const audio = e.target as HTMLAudioElement;
		progress = (audio.currentTime / audio.duration) * 100;
		playing = progress < 100 && !audio.paused;
	});

	function deleteFile() {
		try {
			db.files.delete($file?.id!);
		} catch (error) {
			console.error(error);
		}
	}

	$: if ($file?.name) {
		db.files.update($file.id!, { name: $file.name });
	}

	$: if ($file?.file && !audioBlobUrl) {
		audioBlobUrl = URL.createObjectURL($file.file);
	}

	$: if (typeof volume === 'number' && audio) {
		audio.volume = volume / 100;
		db.files.update($file?.id!, { volume });
	}
</script>

<Tile>
	<div class="grid rounded-xl">
		{#if $file}
			<audio controls src={audioBlobUrl} class="hidden" bind:this={audio} />
			<span class="name">{$file.name}</span>
			<input type="range" min="0" max="100" bind:value={volume} />
			<div class="actions">
				{#if audio}
					{#if playing}
						<ActionIcon on:click={pause}>
							<Pause size={16} />
						</ActionIcon>
					{:else}
						<ActionIcon on:click={play}>
							<Play size={16} />
						</ActionIcon>
					{/if}
					{#if progress > 0}
						<ActionIcon on:click={stop}>
							<Stop size={16} />
						</ActionIcon>
					{:else}
						<ActionIcon on:click={() => (openEdit = true)}>
							<Gear size={16} />
						</ActionIcon>
					{/if}
				{/if}
			</div>
			<div class="progress-bar" style={`--w: ${progress}%`} />
		{:else}
			<span class="name">Loading...</span>
		{/if}
	</div>
</Tile>

<Modal
	opened={openEdit}
	on:close={() => (openEdit = false)}
	closeOnClickOutside={true}
	closeOnEscape={true}
	title="Add new sound"
>
	{#if $file}
		<TextInput placeholder="File name" class="input w-full max-w-xs" bind:value={$file.name} />
		<span class="text-sm text-gray-500">{filesize($file?.file?.size)}</span>
		<audio controls src={URL.createObjectURL($file.file)} />
		<ActionIcon on:click={deleteFile}>
			<Trash size={16} />
		</ActionIcon>
	{/if}
</Modal>

<style lang="scss">
	.grid {
		overflow: hidden;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: minmax(0, 1fr) min-content min-content;
		grid-gap: 0.2rem;
		align-items: center;
		grid-template-areas:
			'name'
			'actions'
			'progress';
		background-color: rgb(232, 242, 255);

		.name {
			grid-area: name;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			font-size: 1.2rem;
			text-align: center;
			padding: 0.3rem;
		}

		.actions {
			grid-area: actions;
			display: flex;
			flex-direction: row;
			justify-content: center;
			gap: 1rem;
		}

		.progress-bar {
			grid-area: progress;
			width: var(--w);
			height: 0.5rem;
			background-color: rgb(24, 87, 169);
		}
	}
</style>
