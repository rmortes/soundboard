<script lang="ts">
	import '../styles/app.scss';
	import { Plus } from 'radix-icons-svelte';
	import { ActionIcon, Modal, SvelteUIProvider } from '@svelteuidev/core';
	import { AppShell, Header } from '@svelteuidev/core';
	import { TypographyProvider } from '@svelteuidev/core';
	import { Seo } from '@svelteuidev/core';
	import FileDropzone from '../components/FileDropzone.svelte';
	import ExportBtn from '../components/ExportBtn.svelte';
	import ImportBtn from '../components/ImportBtn.svelte';

	let openAdd = false;
</script>

<Seo title="Soundboard" titleTemplate="%t% | Soundboard" />
<SvelteUIProvider withNormalizeCSS withGlobalStyles>
	<TypographyProvider>
		<AppShell>
			<Header slot="header" height={60}>
				<div class="w-full flex flex-row items-center justify-center">
					<span class="title">Soundboard</span>
				</div>
				<ExportBtn />
				<ImportBtn />
				<ActionIcon on:click={() => (openAdd = true)} class="mx-5">
					<Plus size={16} />
				</ActionIcon>
			</Header>
			<slot />
			<Modal
				opened={openAdd}
				on:close={() => (openAdd = false)}
				closeOnClickOutside={true}
				closeOnEscape={true}
				title="Add new sound"
			>
				<FileDropzone on:close={() => (openAdd = false)} />
			</Modal>
		</AppShell>
	</TypographyProvider>
</SvelteUIProvider>

<style lang="scss">
	:global(nav[slot='header']) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 1.5rem;
		font-weight: 500;
	}
</style>
