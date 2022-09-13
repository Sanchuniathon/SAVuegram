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
            v-bind:class="{
              deploymentRow: (i<=8)||(i>=45),
              highlighted: square.isHighlighted, 
              selection: square.isSelected, 
              left_edge: i % 3==0, centre_block: (i-1) % 3 ==0, right_edge: (i-2)%3==0,
              done: square.value.hasPlayedThisTurn
              }"
            class="game-view-square">
            <div id="character" 
            v-bind:style="{
              'background-image':'url('+ frontOrBack(i) +')', 
              'background-position-x':characterIconX(i)+'px', 
              'background-position-y':characterIconY(i)+'px',
              'filter': 'grayscale('+healthPercentage(i)+')'
              }">
              {{square.value.healthCurrent}}
            </div>
          </div>
        </div>
        <button :disabled="activeGame.canEndTurn == false" id="end-turn-button" @click="activeGame.completeTurn()">End Turn</button>       
      </div>
    </section>
</template>


<script>
import Game from "../Game.js"
import { playerTeamCollection, auth } from '@/firebase'
export default {

  data() {
    return{
      activeGame: new Game()
    }
  },
  computed: {
    turnStatus: function(){
      if(this.activeGame.inProgress){
        if(this.activeGame.turnOver){
        return 'The turn is over';
        }
        else{
          return 'It is ' + this.activeGame.currentTurn +'\'s turn';
        }
      }
      else{
        return 'The game is over';
      }

    },


  },
  methods: {
    characterIconX: function(i){
      return this.activeGame.squares[i].value.character[0];
    },
    characterIconY: function(i){
      return this.activeGame.squares[i].value.character[1];
    },
    frontOrBack: function(i){
      if(this.activeGame.squares[i].value.team == 'O'){
        //back
        
        return require('..\\assets\\Images\\black-white-back-shiny.png');
      }
      else if(this.activeGame.squares[i].value.team == 'X'){
        //front
        return require('..\\assets\\Images\\black-white-front-shiny.webp');
      }
    },
    healthPercentage: function(i){
      var percentage;
      percentage = 1 - (this.activeGame.squares[i].value.healthCurrent / this.activeGame.squares[i].value.healthTotal);
      percentage = percentage + 0.2;
      return percentage;
    }
  }
}
</script>
