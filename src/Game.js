import Square from './Square'
import Pawn from './Pawn';
import Cannon from './Cannon.mp3'
var attackSound = new Audio(Cannon)
export default class Game {
    constructor() {
        this.inProgress = true;
        this.canEndTurn = true;
        this.turnOver = false;
        this.selectionMade = false;
        this.playerTeam = Game.O;
        this.winner = null;
        this.currentTurn = Game.O;
        this.attacks = 1;
        this.movesMade = 0;
        this.selectedSquareIndex = null;
        this.squares = new Array(54).fill().map( s=> new Square() );

        

        this.squares[1].value= new Pawn(0,'X',2);
        this.squares[4].value= new Pawn(1,'X',2);
        this.squares[7].value= new Pawn(2,'X',2);
        this.squares[46].value= new Pawn(3,'O',2);
        this.squares[49].value= new Pawn(4,'O',2);
        this.squares[52].value= new Pawn(5,'O',2);

    }

    checkForValidSelection(i){
        if((this.squares[i].value.team == this.currentTurn) && (!this.turnOver)){
            this.selectedSquareIndex = i;
            this.selectionMade=true;
            this.squares[i].isSelected=true;
        }
    }
    getPositionInFundamentalBlock(currentPosition, i){
        if(currentPosition%3==0){
            //left
            return 'left';
        }else if((currentPosition-1)%3==0){
            //centre
            return 'centre';
        }else{
            //right
            return 'right';
        }
    }
    isFundamentalSquareAvailable(i, selectedSquare){
        var refinedPosition = this.getPositionInFundamentalBlock(i, 0); //zero
        let movingTeam = this.squares[selectedSquare].value.team;
        if(refinedPosition == 'left'){           
            for (let x = i; x < (i+3); x++) {
                if((this.squares[x].value.team==movingTeam) && (this.squares[i].value.team=="")){
                    //we found a friendly in the fundamental square and we have an opening to move into the chosen refined spot
                    return true;
                }
                else if((this.squares[x].value.team!=movingTeam) && (this.squares[x].value.team!="")){
                    //it is an enemy, we can't go there
                    return false;
                }           
            }
        }else if (refinedPosition == 'right'){              
            for (let x = (i-2); x <= i; x++) {              
                if((this.squares[x].value.team==movingTeam) && (this.squares[i].value.team=="")){
                    //we found a friendly in the fundamental square and we have an opening to move into the chosen refined spot
                    return true;
                }
                else if((this.squares[x].value.team!=movingTeam) && (this.squares[x].value.team!="")){
                    //it is an enemy, we can't go there
                    return false;
                }   
            }
        }else{
            //centre
            for (let x = (i-1); x <= i+1; x++) {   
                if((this.squares[x].value.team==movingTeam) && (this.squares[i].value.team=="")){
                    //we found a friendly in the fundamental square and we have an opening to move into the chosen refined spot
                    return true;
                }
                else if((this.squares[x].value.team!=movingTeam) && (this.squares[x].value.team!="")){
                    //it is an enemy, we can't go there
                    return false;
                }   
            }
        }
        if(this.squares[i].value.team==""){
            return true;
        }
        else{
            return false;
        }

    }
    isSquareAdjacent(selectedSquareIndex, i){
        var checkLocation = (selectedSquareIndex - i);
        //Can't move within the same square
        var refinedPosition = this.getPositionInFundamentalBlock(selectedSquareIndex, i);
        if(refinedPosition == 'left'){
            checkLocation++;
        }else if (refinedPosition == 'right'){
            checkLocation--;
        }//no position adjustment for centre
        
        var validRelativeLocations = [-10,-9,-8,-4,-3,-2,2,3,4,8,9,10];
        if(validRelativeLocations.includes(checkLocation)){
            return true;     
        }else{
            return false;
        }
    }
    checkForValidMove(i){
        //first we block deployment row
        if((i>8) && (i<45)){
            //Can't go into an occupied square
            if(this.isFundamentalSquareAvailable(i,this.selectedSquareIndex)){
                //Can only move one space at a time
                var checkLocation = Math.abs(this.selectedSquareIndex - i);
                //Can't move within the same square
                if(this.isSquareAdjacent(this.selectedSquareIndex,i)){
                    return true;
                }                      
            }           
        }
        return false;
    }
    checkForAttack(i){
        //Can only shoot one space at a time
        if(this.isSquareAdjacent(this.selectedSquareIndex,i)){
            if((this.squares[i].value.team != this.currentTurn)&&(this.squares[i].value.team != "")){              
                return true;     
            }
        }else{

            return false;
        }

    }
    sleepFunction(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    resolveAttack(i){
        var accuracy = this.squares[this.selectedSquareIndex].value.accuracy
        var strikeValue = Math.floor(Math.random() * 101);
        var scale = 100;
        if(scale*accuracy>= strikeValue){
            //hit
            if(this.squares[i].value.health >= 2){
                this.squares[i].value.health = this.squares[i].value.health - 1;
            }else{
                //the enemy is slain
                this.squares[i].value = new Pawn("","","");
            }
            

        }else{
            //miss, nothing happens
        }

        this.canEndTurn=false;  
        this.sleepFunction(1000).then(() => { this.canEndTurn = true });


    }
    completeTurn(){   
        this.movesMade++;
        this.turnOver=false;
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
                this.squares[i].value = this.squares[this.selectedSquareIndex].value;//this.currentTurn;
                this.squares[this.selectedSquareIndex].value = new Pawn("","","");
                this.squares.forEach(element => {
                    element.isSelected = false;
                });
                this.turnOver = true;
                //this.completeTurn();
            }
            //We can't move there but maybe we can attack there
            else if(this.checkForAttack(i)){
                attackSound.play();
                this.resolveAttack(i);
                this.squares.forEach(element => {
                    element.isSelected = false;
                });
                this.turnOver = true;
                //this.completeTurn();
            }
            //move is not valid
            else{
                this.selectedSquareIndex = null;
                this.squares.forEach(element => {
                    element.isSelected = false;
                });
            }
            this.selectionMade = false;
            this.squares[i].isSelected=false;

        }
    }

    checkForWinner(){
        //leave for now. No need to add X and O logic

        this.inProgress = true;

    }

}

Game.O = 'O';
Game.X = 'X';