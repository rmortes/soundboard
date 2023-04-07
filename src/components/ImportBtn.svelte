<!-- This navbar button imports the database from a file -->
<script lang="ts">
	import { ActionIcon } from '@svelteuidev/core';
	import { Upload } from 'radix-icons-svelte';

	import { db } from '../db';
	import { importInto } from 'dexie-export-import';

	async function upload() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.db';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				await importInto(db, file);
				location.reload();
			}
		};
		input.click();
	}
</script>

<ActionIcon on:click={upload} class="mx-5">
	<Upload size={16} />
</ActionIcon>
