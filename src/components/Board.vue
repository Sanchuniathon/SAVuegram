<template>
    <section>
      <div id="game-view">
        <div id="game-view-info">
          {{ infoMessage }}
        </div>
        <div id="game-view-squares">
          <div 
            v-for="(square, i) in activeGame.squares" :key="game-view-square.id"
            v-on:click="activeGame.makeMove(i)"
            v-bind:class="{highlighted: square.isHighlighted}"
            class="game-view-square">
            {{square.value}}
            
          </div>
        </div>
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
    infoMessage: function(){
      return "activeGame.squares"
    }
  }
}
</script>
