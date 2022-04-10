<script setup lang="ts">
import { isDev, toggleDev } from '~/composables'
import { GamePlay } from '~/composables/logic'

const play = new GamePlay(10, 10, 20)
useStorage('mineweeper-state', play.state)
const state = computed(() => play.board)

watchEffect(() => {
  play.checkGameState()
})

function newGame(difficulty: 'easy' | 'medium' | 'hard') {
  switch (difficulty) {
    case 'easy':
      play.reset(6, 6, 6)
      break
    case 'medium':
      play.reset(10, 10, 12)
      break
    case 'hard':
      play.reset(15, 15, 99)
      break
    default:
      play.reset(6, 6, 6)
  }
}
</script>

<template>
  <div>
    扫雷
    <div flex="~ gap1" justify-center p2>
      <button btn @click="play.reset()">
        重置
      </button>
      <button btn @click="newGame('easy')">
        容易
      </button>
      <button btn @click="newGame('medium')">
        中等
      </button>
      <button btn @click="newGame('hard')">
        困难
      </button>
    </div>
    <div p5>
      <div
        v-for="row,y in state"
        :key="y"
        flex="~"
        items-center
        justify-center
      >
        <MineBlock
          v-for="block,x in row" :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>
    <div v-if="false" flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        {{ isDev ? 'cheat' : 'normal' }}
      </button>
    </div>
  </div>
</template>
