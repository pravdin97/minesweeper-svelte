<script lang="ts">
	import Cell from "./components/Cell.svelte";
	import { generateBombs,generateMap,toKey } from "./logic/logic";

	let ROWS = 9;
	let COLS = 9;
	let map = generateMap(generateBombs());
	let revealedKeys = new Set<string>();
	let flaggedKeys = new Set<string>();
	let failedBombKey: string | null = null;

	$: revealedKeys
</script>

<div class="container" style="width: {COLS * 50}px; height: {ROWS * 50}px">
	{#each {length: ROWS} as _, i }
		{#each {length: COLS} as _, j}
			<Cell
				map={map}
				failedBombKey={failedBombKey}
				flaggedKeys={flaggedKeys}
				revealedKeys={revealedKeys}
				key={toKey(i, j)}
			/>
		{/each}
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-wrap: wrap;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
</style>