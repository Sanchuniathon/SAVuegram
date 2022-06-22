import Square from './Square'
import Pawn from './Pawn';
import Cannon from './Cannon.mp3'
var attackSound = new Audio(Cannon)
export default class Game {
    constructor() {
        this.inProgress = true;
        this.selectionMade = false;
        this.playerTeam = Game.O;
        this.winner = null;
        this.currentTurn = Game.O;
        this.movesMade = 0;
        this.selectedSquareIndex = null;
        this.squares = new Array(18).fill().map( s=> new Square() );
        this.squares[0].value='X';
        this.squares[1].value='X';
        this.squares[2].value='X';
        this.squares[15].value='O';
        this.squares[16].value='O';
        this.squares[17].value='O';


    }

    checkForValidSelection(i){
        if(this.squares[i].value == this.currentTurn){
            this.selectedSquareIndex = i;
            this.selectionMade=true;
        }
    }
    checkForValidMove(i){
        if((i>2) && (i<15)){
            if(this.squares[i].value == null){
                return true;              
            }           
        }
        return false;
    }

    makeMove(i){
        if(this.inProgress && !this.selectionMade){
            this.checkForValidSelection(i);
        } 
        else if(this.inProgress && this.selectionMade){
            if(this.checkForValidMove(i) == true){
                this.squares[i].value = this.currentTurn;
                this.squares[this.selectedSquareIndex].value = null;
                //attackSound.play();
                this.movesMade++;
                this.checkForWinner();
                this.currentTurn = (this.currentTurn === Game.O) ? Game.X : Game.O; //if it is O's turn set to X's turn, otherwise set it to O's turn
            }
            //move is not valid
            else{
                this.selectedSquareIndex = null;
            }
            this.selectionMade = false;

        }
    }

    checkForWinner(){
        //leave for now. No need to add X and O logic

        this.inProgress = true;

    }

}

Game.O = 'O';
Game.X = 'X';