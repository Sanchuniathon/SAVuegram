import Square from './Square'

export default class Game {
    constructor() {
        this.inProgress = true;
        this.selectionMade = false;
        this.playerTeam = Game.O;
        this.winner = null;
        this.currentTurn = Game.O;
        this.movesMade = 0;
        this.squares = new Array(18).fill().map( s=> new Square() );
        this.squares[0].value='X';
        this.squares[1].value='X';
        this.squares[2].value='X';
        this.squares[15].value='O';
        this.squares[16].value='O';
        this.squares[17].value='O';

    }

    CheckForValidSelection(i){
        if(this.squares[i].value == this.playerTeam){
            this.selectionMade=true;
        }
    }

    makeMove(i){
        if(this.inProgress && this.selectionMade){
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