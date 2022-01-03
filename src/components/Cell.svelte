<script lang="ts">
  export let key: string;
  export let onClick: () => void;
  export let onContextMenu: (arg0: MouseEvent) => void;
  export let map: Map<string, string | number>;
  export let failedBombKey: string | null;
  export let revealedKeys = new Set<string>();
  export let flaggedKeys = new Set<string>();

  let disabled = false;
  let textContent = '';
  let backgroundColor = '';
  let color = 'black';

  $: bgColor = backgroundColor ?
    backgroundColor :
    disabled ?
      'rgba(239, 239, 239, 0.3)' :
      'rgb(239, 239, 239)';

  $: {
    const value = map.get(key);

    if (failedBombKey !== null && value === 'bomb') {
      disabled = true;
      textContent = '💣️';

      if (failedBombKey === key) {
        backgroundColor = 'red';
      }
    } else if (revealedKeys.has(key)) {
      disabled = true;

      if (value === undefined) {
      } else if (value === 1) {
        textContent = '1';
        color = 'blue';
      } else if (value === 2) {
        textContent = '2';
        color = 'green';
      } else if (value >= 3) {
        textContent = value.toString();
        color = 'red';
      } else {
        throw Error('should never happen');
      }
    } else if (flaggedKeys.has(key)) {
      textContent = '🚩️';
    }
  }
</script>

<button
  class="cell"
  on:click={onClick}
  on:contextmenu={onContextMenu}
  {disabled}
  style="color: {color}; background-color: {bgColor};"
>
{textContent}
</button>

<style>
  .cell {
    width: 50px;
    height: 50px;
    margin: 0;
  }
</style>