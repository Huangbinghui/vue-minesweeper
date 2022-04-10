import type { Ref } from 'vue'
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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'won' | 'lose'
}

export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(public width: number, public height: number, public mines: number) {
    this.reset()
  }

  get board() {
    return this.state.value.board
  }

  set board(val) {
    this.state.value.board = val
  }

  get gameState() {
    return this.state.value.gameState
  }

  set gameState(val) {
    this.state.value.gameState = val
  }

  get mineGenerated() {
    return this.state.value.mineGenerated
  }

  set mineGenerated(val) {
    this.state.value.mineGenerated = val
  }

  reset(
    width = this.width,
    height = this.height,
    mines = this.mines,
  ) {
    this.width = width
    this.height = height
    this.mines = mines
    this.state.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x, y, flagged: false, revealed: false, adjacentMines: 0,
        }),
        )),
    }
  }

  onClick(block: BlockState) {
    if (this.gameState !== 'play')
      return
    if (!this.mineGenerated)
      this.generateMines(block)
    block.revealed = true
    if (block.mine) {
      alert('You Lose!!!')
      this.gameState = 'lose'
      this.showAllMines()
      return
    }

    this.expendZero(block)
  }

  showAllMines() {
    this.board.flat().forEach((i) => {
      if (i.mine)
        i.revealed = true
    })
  }

  onRightClick(block: BlockState) {
    if (this.gameState !== 'play')
      return

    if (!block.revealed)
      block.flagged = !block.flagged
  }

  generateMines(initialBlock: BlockState) {
    let mines = this.mines
    while (mines > 0 && mines < this.height * this.width) {
      const x = Math.floor(Math.random() * this.width)
      const y = Math.floor(Math.random() * this.height)
      const block = this.board[y][x]
      if (block.mine || block === initialBlock)
        continue
      block.mine = true
      mines--
    }
    this.mineGenerated = true
    this.updateNumbers()
  }

  updateNumbers() {
    this.board.forEach((row) => {
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

      return this.board[y2][x2]
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
    if (!this.mineGenerated || this.gameState !== 'play')
      return
    const blocks = this.board.flat()

    if (blocks.every(block => block.revealed || block.flagged)) {
      if (blocks.some(block => block.flagged && !block.mine)) {
        this.gameState = 'lose'
        this.showAllMines()
        alert('Cheat!!!')
      }
      else {
        this.gameState = 'won'
        alert('Won!!!')
      }
    }
  }
}
