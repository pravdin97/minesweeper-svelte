<script lang="ts">
	import Cell from "./components/Cell.svelte";

	let ROWS = 9;
	let COLS = 9;
	let map = generateMap(generateBombs());
	let revealedKeys = new Set<string>();
	let failedBombKey: string | null = null;
	let flaggedKeys = new Set<string>();

	function toKey(row: number, col: number) {
		return row + '-' + col;
	} 

	function fromKey (key: string) {
		return key.split('-').map(Number);
	} 

	function isInBounds([row, col]: number[]) {
		if (row < 0 || col < 0) {
			return false;
		}
		if (row >= ROWS || col >= COLS) {
			return false;
		}

		return true;
	}

	function getNeighbors(key: string) {
		const [row, col] = fromKey(key);
		return [
			[row - 1, col - 1],
			[row - 1, col],
			[row - 1, col + 1],
			[row, col + 1],
			[row + 1, col + 1],
			[row + 1, col],
			[row + 1, col - 1],
			[row, col - 1],
		]
			.filter(isInBounds)
			.map(([r, c]) => toKey(r, c));
	}

	function generateMap(seedBombs: string[]): Map<string, string | number> {
  	const map = new Map();
		function incrementDanger(neighborKey: string) {
			if (!map.has(neighborKey)) {
				map.set(neighborKey, 1);
			} else {
				const oldVal = map.get(neighborKey);
				if (oldVal !== 'bomb') {
					map.set(neighborKey, oldVal + 1);
				}
			}
		}

		for (const key of seedBombs) {
			map.set(key, 'bomb');
			for (const neighborKey of getNeighbors(key)) {
				incrementDanger(neighborKey);
			}
		}

		return map;
	}

	function generateBombs() {
		const count = Math.round(Math.sqrt(ROWS * COLS));

		const allKeys = [];
		for (let i = 0; i < ROWS; i++) {
			for (let j = 0; j < COLS; j++) {
				allKeys.push(toKey(i, j));
			}
		}

		allKeys.sort(() => (Math.random() > 0.5 ? 1 : -1));

		return allKeys.slice(0, count);
	}

	function propagateReveal(key: string, visited: Set<string>) {
		revealedKeys.add(key);
		visited.add(key);

		const isEmpty = !map.has(key);
		if (isEmpty) {
			flaggedKeys.delete(key);
			for (const neighborKey of getNeighbors(key)) {
				if (!visited.has(neighborKey)) {
					propagateReveal(neighborKey, visited);
				}
			}
		}

		return new Set(revealedKeys);
	}

	function revealCells(key: string) {
		if (map.get(key) === 'bomb') {
			failedBombKey = key;
		}
		const newRevealedKeys = propagateReveal(key, new Set());

		revealedKeys = newRevealedKeys;
	}

	function getOnCellClick(key: string) {
		return function () {
			if (failedBombKey !== null) {
				return;
			}
			if (flaggedKeys.has(key)) {
				return;
			}
			revealCells(key);
		}
	}

	function toggleFlag(key: string) {
		if (flaggedKeys.has(key)) {
			flaggedKeys.delete(key);
		} else {
			flaggedKeys.add(key);
		}

		flaggedKeys = new Set(flaggedKeys);
	}

	function getOnContextMenu(key: string) {
		return function (e: MouseEvent) {
			e.preventDefault();
			if (failedBombKey !== null) {
				return;
			}
			toggleFlag(key);
		};
	}

</script>

<div class="container" style="width: {COLS * 50}px; height: {ROWS * 50}px">
	{#each {length: ROWS} as _, i }
		{#each {length: COLS} as _, j}
			<Cell
				key={toKey(i, j)}
				onClick={getOnCellClick(toKey(i, j))}
				onContextMenu={getOnContextMenu(toKey(i, j))}
				{map}
				{revealedKeys}
				{failedBombKey}
				{flaggedKeys}
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
		font-size: 20px;
		font-weight: 700;
	}
</style>