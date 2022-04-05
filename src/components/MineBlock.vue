<script setup lang='ts'>
import type { BlockState } from '~/type'
import { isDev } from '~/composables'

const props = defineProps<{ block: BlockState }>()

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray'
  return block.mine
    ? 'bg-red-500/50'
    : 'text-black'
}
</script>

<template>
  <button
    flex="~"
    items-center justify-center
    w-8 h-8 m="0.5"
    border
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine>
        x
      </div>
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
