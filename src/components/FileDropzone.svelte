<script lang="ts">
	import DropFile from 'svelte-parts/DropFile.svelte';
	import { filesize } from 'filesize';
	import { Modal, TextInput } from '@svelteuidev/core';
	import { db } from '../db';
	import { createEventDispatcher } from 'svelte';

	let files: {
		file: File;
		name: string;
	}[] = [];

	const dispatch = createEventDispatcher();
	function onDrop(f: File[]) {
		files = [...files, ...f.map((f) => ({ file: f, name: f.name }))];
	}

	async function addFile() {
		try {
			const id = await db.files.add({
				name: files[0].name,
				file: files[0].file
			});
			dispatch('close');
			files = [];
		} catch (error) {
			console.error(error);
		}
	}
</script>

<DropFile {onDrop} />

<Modal
	opened={files.length > 0}
	on:close={() => (files = [])}
	closeOnClickOutside={true}
	closeOnEscape={true}
	title="Add new sound"
>
	<TextInput placeholder="File name" class="input w-full max-w-xs" bind:value={files[0].name} />
	<span class="text-sm text-gray-500">{filesize(files[0]?.file?.size)}</span>
	<audio controls src={URL.createObjectURL(files[0].file)} />
	<button on:click={addFile} class="btn btn-primary">Add</button>
</Modal>
