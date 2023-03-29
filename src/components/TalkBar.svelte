<script lang="ts">
	import { SpeakerLoud } from 'radix-icons-svelte';
	import { browser } from '$app/environment';
	import { ActionIcon } from '@svelteuidev/core';

	const langOptions = [
		{ value: 'es-ES', label: 'Español' },
		{ value: 'en-GB', label: 'Inglés' },
		{ value: 'en-US', label: 'Inglés (Raro)' },
		{ value: 'fr-FR', label: 'French' },
		{ value: 'de-DE', label: 'German' },
		{ value: 'it-IT', label: 'Italian' },
		{ value: 'ja-JP', label: 'Japanese' },
		{ value: 'ko-KR', label: 'Korean' },
		{ value: 'pt-BR', label: 'Portuguese' },
		{ value: 'ru-RU', label: 'Russian' },
		{ value: 'zh-CN', label: 'Chinese' }
	];

	let text = '';
	let lang = 'es-ES';

	function talk() {
		if (browser) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = lang;
			utterance.rate = 0.8;
			speechSynthesis.speak(utterance);
		}
	}
</script>

<div class="flex flex-row items-center justify-center my-4 gap-2">
	<div class="relative w-full max-w-md">
		<input type="text" class="input w-full" placeholder="Talk" bind:value={text} />
		<div class="absolute inset-y-0 right-0 flex items-center">
			<ActionIcon on:click={talk}>
				<SpeakerLoud />
			</ActionIcon>
		</div>
	</div>
	<div class="relative w-40">
		<select class="input w-full" bind:value={lang}>
			{#each langOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
</div>
