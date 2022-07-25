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
        

        this.squares[0].value= new Pawn(0,'X',2).team;
        this.squares[1].value= new Pawn(1,'X',2).team;
        this.squares[2].value= new Pawn(2,'X',2).team;
        this.squares[15].value= new Pawn(3,'O',2).team;
        this.squares[16].value= new Pawn(4,'O',2).team;
        this.squares[17].value= new Pawn(5,'O',2).team;

    }

    checkForValidSelection(i){
        if(this.squares[i].value == this.currentTurn){
            this.selectedSquareIndex = i;
            this.selectionMade=true;
        }
    }
    checkForValidMove(i){
        //first we block deployment row
        if((i>2) && (i<15)){
            //Can't go into an occupied square
            if(this.squares[i].value == null){
                //Can only move one space at a time
                var checkLocation = Math.abs(this.selectedSquareIndex - i);
                if((checkLocation==3)||(checkLocation==1)){
                    return true;     
                }                        
            }           
        }
        return false;
    }
    checkForAttack(i){
        if((this.squares[i].value != this.currentTurn)&&(this.squares[i].value != null)){
            //Can only shoot one space at a time
            var checkLocation = Math.abs(this.selectedSquareIndex - i);
            if((checkLocation==3)||(checkLocation==1)){
                return true;     
            }
        }
        return false;
    }
    completeTurn(){   
        this.movesMade++;
        this.checkForWinner();
        this.currentTurn = (this.currentTurn === Game.O) ? Game.X : Game.O; //if it is O's turn set to X's turn, otherwise set it to O's turn
    }

    makeMove(i){
        //we don't have a tile selected
        if(this.inProgress && !this.selectionMade){
            this.checkForValidSelection(i);
        }
        //If there is already a selection made then we can try to make a move or attack
        else if(this.inProgress && this.selectionMade){
            if(this.checkForValidMove(i)){
                //move normally
                this.squares[i].value = this.currentTurn;
                this.squares[this.selectedSquareIndex].value = null;
                this.completeTurn();
            }
            //We can't move there but maybe we can attack there
            else if(this.checkForAttack(i)){
                attackSound.play();
                this.completeTurn();
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