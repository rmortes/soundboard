<script lang="ts">
	import { Play, Pause, Stop, Gear, Trash } from 'radix-icons-svelte';
	import { filesize } from 'filesize';
	import { ActionIcon, Modal, TextInput } from '@svelteuidev/core';
	import { db, type IFile } from '../db';
	import Tile from './Tile.svelte';

	export let file: IFile;
	let audio: HTMLAudioElement;
	let playing = false;
	let openEdit = false;
	let p = 0;

	function play() {
		audio.play();
		playing = true;
	}

	function pause() {
		audio.pause();
		playing = false;
	}

	function stop() {
		audio.pause();
		audio.currentTime = 0;
		playing = false;
	}

	setInterval(() => {
		if (audio) {
			p = (audio.currentTime / audio.duration) * 100;
			if (p >= 100) {
				playing = false;
			}
		}
	}, 1);

	$: if (file.name) {
		db.files.update(file.id!, { name: file.name });
	}

	function deleteFile() {
		try {
			db.files.delete(file.id!);
		} catch (error) {
			console.error(error);
		}
	}

	$: if (typeof file.volume === 'number' && audio) {
		audio.volume = file.volume / 100;
		db.files.update(file.id!, { volume: file.volume });
	}
</script>

<Tile>
	<div class="grid rounded-xl">
		<audio controls src={URL.createObjectURL(file.file)} class="hidden" bind:this={audio} />
		<span class="name">{file.name}</span>
		<input type="range" min="0" max="100" bind:value={file.volume} />
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
				{#if p > 0}
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
		<div class="progress-bar" style={`--w: ${p}%`} />
	</div>
</Tile>

<Modal
	opened={openEdit}
	on:close={() => (openEdit = false)}
	closeOnClickOutside={true}
	closeOnEscape={true}
	title="Add new sound"
>
	<TextInput placeholder="File name" class="input w-full max-w-xs" bind:value={file.name} />
	<span class="text-sm text-gray-500">{filesize(file?.file?.size)}</span>
	<audio controls src={URL.createObjectURL(file.file)} />
	<ActionIcon on:click={deleteFile}>
		<Trash size={16} />
	</ActionIcon>
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
