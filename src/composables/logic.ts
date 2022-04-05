import type { BlockState } from '~/type'
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
export class GamePlay {
  state = ref<BlockState[][]>()
  mineGenerated = false

  constructor(public width: number, public height: number) {
    watch(this.state, () => {
      this.checkGameState()
    }, { immediate: true, deep: true })
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x): BlockState => ({
        x, y, flagged: false, revealed: false, adjacentMines: 0,
      }),
      ))
  }

  onClick(block: BlockState) {
    if (!this.mineGenerated)
      this.generateMines(block)

    if (block.mine)
      alert('You Lose!!!')
    block.revealed = true
    this.expendZero(block)
  }

  onRightClick(block: BlockState) {
    if (!block.revealed)
      block.flagged = !block.flagged
  }

  generateMines(initialBlock: BlockState) {
    for (const row of this.state.value) {
      for (const block of row) {
        if (Math.abs(initialBlock.x - block.x) <= 1)
          continue
        if (Math.abs(initialBlock.y - block.y) <= 1)
          continue
        block.mine = Math.random() < 0.1
      }
    }
    this.mineGenerated = true
    this.updateNumbers()
  }

  updateNumbers() {
    this.state.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.state.value[y2][x2]
    })
      .filter(Boolean) as BlockState[]
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return

    this.getSiblings(block).forEach((b) => {
      if (!b.revealed) {
        b.revealed = true
        this.expendZero(b)
      }
    })
  }

  checkGameState() {
    if (!this.mineGenerated)
      return
    const blocks = this.state.value.flat()

    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => block.flagged && !block.mine))
        alert('Cheat!!!')
      else
        alert('Win!!!')
    }
  }
}
