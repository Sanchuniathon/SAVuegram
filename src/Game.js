import Square from './Square'

export default class Game {
    constructor() {
        this.inProgress = true;
        this.winner = null;
        this.currentTurn = Game.O;
        this.movesMade = 0;
        this.squares = new Array(9).fill().map( s=> new Square() );

    }

    makeMove(i){
        if(this.inProgress && !this.squares[i].value){
            this.squares[i].value = this.currentTurn;

            this.movesMade++;
            this.checkForWinner();
            this.currentTurn = (this.currentTurn === Game.O) ? Game.X : Game.O; //if it is O's turn set to X's turn, otherwise set it to O's turn
        }
    }

    checkForWinner(){
        //leave for now. No need to add X and O logic

        this.inProgress = true;

    }

}

Game.O = 'O';
Game.X = 'X';