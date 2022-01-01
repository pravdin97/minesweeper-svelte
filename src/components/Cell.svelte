<script lang="ts">
  import { IMap,revealCells } from "../logic/logic";

  export let flaggedKeys: Set<string>;
  export let failedBombKey: string | null;
  export let map: IMap;
  export let revealedKeys: Set<string>;
  export let key: string;

  function onClick() {
    if (failedBombKey !== null) {
      return;
    }
    if (flaggedKeys.has(key)) {
      return;
    }
    revealCells(map, revealedKeys, flaggedKeys, failedBombKey, key);
    update();
  };

  let disabled = false;
  let textContent = '';
  let color = '';
  let backgroundColor = '';

  function getButtonProps(value: number | string | undefined) {
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
      console.log('value: ', value)
      throw Error('should never happen');
    }
  }

  function update() {
    const value = map.get(key);
  
    if (failedBombKey !== null && value === 'bomb') {
      disabled = true;
      textContent = '💣️';
      if (failedBombKey === key) {
        backgroundColor = 'red';
      }
    } else if (revealedKeys.has(key)) {
      disabled = true;
  
      getButtonProps(value);
    } else if (flaggedKeys.has(key)) {
      textContent = '🚩️';
    }
  }
</script>

<button
  class="cell"
  on:click={onClick}
  disabled={disabled}
  style="color: {color}; background-color: {backgroundColor}"
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