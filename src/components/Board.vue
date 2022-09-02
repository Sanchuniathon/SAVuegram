<template>
    <section>
      <div id="game-view">
        <div id="game-view-info">
          {{ turnStatus }}
        </div>
        <div id="game-view-squares">
          <div 
            v-for="(square, i) in activeGame.squares" :key="game-view-square.id"
            v-on:click="activeGame.makeMove(i)"
            v-bind:class="{deploymentRow: (i<=8)||(i>=45), highlighted: square.isHighlighted, selection: square.isSelected, left_edge: i % 3==0, centre_block: (i-1) % 3 ==0, right_edge: (i-2)%3==0}"
            class="game-view-square">
            {{square.value.team + square.value.health + square.value.hasPlayedThisTurn}}
            
          </div>
        </div>
        <button :disabled="activeGame.canEndTurn == false" id="end-turn-button" @click="activeGame.completeTurn()">End Turn</button>       
      </div>
    </section>
</template>


<script>
import Game from "../Game.js"

export default {

  data() {
    return{
      activeGame: new Game()
    }
  },
  computed: {
    turnStatus: function(){
      if(this.activeGame.turnOver){
        return 'The turn is over';
      }
      else{
        return 'It is ' + this.activeGame.currentTurn +'\'s turn';
      }
    }
  }
}
</script>
