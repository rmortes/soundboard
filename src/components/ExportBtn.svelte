<!-- This navbar button exports the database to a file -->
<script lang="ts">
	import { ActionIcon } from '@svelteuidev/core';
	import { Download } from 'radix-icons-svelte';

	import { db } from '../db';
	import { exportDB } from 'dexie-export-import';

	async function download() {
		const blob = await exportDB(db);
		const url = URL.createObjectURL(blob);
		document.body.insertAdjacentHTML(
			'beforeend',
			`<a href="${url}" download="soundboard.db" id="download"></a>`
		);
		const download = document.getElementById('download');
		download?.click();
		download?.remove();
	}
</script>

<ActionIcon on:click={download} class="mx-5">
	<Download size={16} />
</ActionIcon>
