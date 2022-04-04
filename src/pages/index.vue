<script setup lang="ts">
import type { BlockState } from '~/type'
const WIDTH = 5
const HEIGHT = 5

let mineGenerated = false
const dev = false

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [0, 1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
]

const state = reactive(Array.from({ length: HEIGHT }, (_, y) =>
  Array.from({ length: WIDTH },
    (_, x): BlockState => ({
      x, y, flagged: false, revealed: false, adjacentMines: 0,
    }),
  )))

function onClick(block: BlockState) {
  if (!mineGenerated)
    generateMines(block)
  if (block.mine)
    alert('You Lose!!!')
  block.revealed = true
  expendZero(block)
  checkGameState()
}

function onRightClick(block: BlockState) {
  if (!block.revealed)
    block.flagged = !block.flagged
  checkGameState()
}

function generateMines(initialBlock: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initialBlock.x - block.x) < 1)
        block.mine = false
      if (Math.abs(initialBlock.y - block.y) < 1)
        block.mine = false
      block.mine = Math.random() < 0.1
    }
  }
  mineGenerated = true
  updateNumbers()
}

function updateNumbers() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined

    return state[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray'
  return block.mine
    ? 'bg-red-500/50'
    : 'text-black'
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return

  getSiblings(block).forEach((b) => {
    if (!b.revealed) {
      b.revealed = true
      expendZero(block)
    }
  })
}

watchEffect(checkGameState)

function checkGameState() {
  if (!mineGenerated)
    return

  const blocks = state.flat()

  if (blocks.every(block => block.revealed || block.flagged)) {
    if (blocks.every(block => block.flagged && !block.mine))
      alert('Cheat!!!')
    else
      alert('Win!!!')
  }
}

</script>

<template>
  <div>
    Minesweeper
    <div p5>
      <div
        v-for="row,y in state"
        :key="y"
        flex="~"
        items-center
        justify-center
      >
        <button
          v-for="block,x in row" :key="x"
          flex="~"
          items-center justify-center
          w-8 h-8 m="0.5"
          border
          :class="getBlockClass(block)"
          @click="onClick(block)"
          @contextmenu.prevent="onRightClick(block)"
        >
          <template v-if="block.flagged">
            <div i-mdi-flag text-red />
          </template>
          <template v-else-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine>
              x
            </div>
            <div v-else>
              {{ block.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
