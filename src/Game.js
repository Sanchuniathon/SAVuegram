import Square from './Square'
import Pawn from './Pawn';
import AI from './AI';
import Cannon from './assets/Sounds/Cannon.mp3';
import Cry from './assets/Sounds/glaceon-cry.mp3';
import Squeaks from './assets/Sounds/guineapig_squeaks.mp3';
import FirebaseDB from './firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

//fundamental gridblock - The larger squares that each contain 3 refined blocks
//refined gridblock - the smaller blocks within each fundamental block
//Game initialization
export default class Game {
    constructor() {
        this.inProgress = true;
        this.canStartGame = true;
        this.turnOver = false;
        this.selectionMade = false;
        this.playerTeam = Game.O;
        this.winner = null;
        this.currentTurn = Game.O;
        this.attacks = 1;
        this.movesMade = 0;
        this.selectedSquareIndex = null;
        this.squares = new Array(54).fill().map( s=> new Square() );
        this.enemyAI = new AI();
        this.shuffleAI = [];
        
        for (let i = 0; i < this.squares.length; i++) {
            this.shuffleAI.push(i);

        }
        this.setLevel(0);
    }
    randomCharacter(){
        var returnArray = [0,0]
        returnArray[0] = Math.floor(Math.random() * 32); //x
        returnArray[1] = Math.floor(Math.random() * 22); //y

        returnArray[0] = returnArray[0] * -96;
        returnArray[1] = returnArray[1] * -96;
        return returnArray;
    }
    //i is the index of the target within the game grid
    checkForValidSelection(i){
        if((this.squares[i].value.team == this.currentTurn) && (!this.turnOver) && (this.squares[i].value.hasPlayedThisTurn==false)&&(!this.squares[i].isSelected)){
            this.selectedSquareIndex = i;
            this.selectionMade=true;
            this.squares[i].isSelected=true;
        }
        else{
            this.squares[i].isSelected=false;
            this.selectionMade=false;
            for (let x = 0; x < this.squares.length; x++) {
                if(this.squares[x].isSelected){
                    this.selectionMade=true;
                }
            }
        }
    }
    //currentPosition is the index of the position that the character is currently in within the game grid
    //returns a string indicating which position that character is in within their fundamenmtal square
    getPositionInFundamentalBlock(currentPosition){
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
    //This method uses a selected square (selectedSquare) and a destination choice (i) and returns true if the character can move there
    isFundamentalSquareAvailable(i, selectedSquareIndex){
        var refinedPosition = this.getPositionInFundamentalBlock(i);
        let movingTeam = this.squares[selectedSquareIndex].value.team;
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
    //This method returns true if the destination (i) is one fundamental block away from the selected character(s) position (selectedSquareIndex) not counting diagonals
    isSquareAdjacent(selectedSquareIndex, i){

        //we can deploy into any of the first rows
        if(selectedSquareIndex<=8){ //top deployment row
            if((i>=9)&&(i<=17)){
                return true;
            }
            else{
                return false; //it isn't the row adjacent to the deployment row
            }
        }
        else if(selectedSquareIndex>=45){//bottom deployment row
            if((i>=36)&&(i<=44)){
                return true;
            }
            else{
                return false; //it isn't the row adjacent to the deployment row
            }
        }

        var checkLocation = (selectedSquareIndex - i);
        //Can't move within the same square
        var refinedPosition = this.getPositionInFundamentalBlock(selectedSquareIndex);
        if(refinedPosition == 'left'){
            checkLocation++;
        }else if (refinedPosition == 'right'){
            checkLocation--;
        }//no position adjustment for centre
        var validRelativeLocations = [];
        var rightIndices = [6,7,8,15,16,17,24,25,26,33,34,35,42,43,44,51,52,53];
        var leftIndices = [0,1,2,9,10,11,18,19,20,27,28,29,36,37,38,45,46,47];
        if(rightIndices.includes(selectedSquareIndex)){
            validRelativeLocations = [-10,-9,-8,2,3,4,8,9,10];
        }
        else if(leftIndices.includes(selectedSquareIndex)){
            validRelativeLocations = [-10,-9,-8,-4,-3,-2,8,9,10];
        }
        else{
            validRelativeLocations = [-10,-9,-8,-4,-3,-2,2,3,4,8,9,10];
        }

        if(validRelativeLocations.includes(checkLocation)){            
            return true;     
        }else{
            return false;
        }
    }
    //This method returns true if the target square (i) is valid to move into by checking that the square is not in the deployment
    //row, that the square is adjacent, and that the square is neutral or under team control
    checkForValidMove(i){
        //first we block deployment row
        if((i>8) && (i<45)){
            //Can't go into an occupied square
            for (let x = 0; x < this.squares.length; x++) {
                if(this.squares[x].isSelected){
                    if(this.isFundamentalSquareAvailable(i,x)){
                        //Can only move one space at a time
                        //Can't move within the same square
                        if(this.isSquareAdjacent(x,i)){
                            return true;
                        }                      
                    }  
                }
            }         
        }
        return false;
    }

    //This method returns which selected squares are valid to move so that we can sort out which ones will work
    checkForValidMoveWithValidIndexes(i){
        var validSelectionsToMove = [];
        //first we block deployment row
        if((i>8) && (i<45)){
            //Can't go into an occupied square
            for (let x = 0; x < this.squares.length; x++) {
                if(this.squares[x].isSelected){
                    if(this.isFundamentalSquareAvailable(i,x)){
                        //Can only move one space at a time
                        //Can't move within the same square
                        if(this.isSquareAdjacent(x,i)){
                            validSelectionsToMove.push(x);
                        }                      
                    }  
                }
            }         
        }
        return validSelectionsToMove;
    }
    //This method returns true if the selected character can attack an enemy occupied adjacent fundamental square
    checkForAttack(selectedSquareIndex,i){
        //Can only shoot one space at a time
        if(this.isSquareAdjacent(selectedSquareIndex,i)){
            if((this.squares[i].value.team != this.currentTurn)&&(this.squares[i].value.team != "")){              
                return true;     
            }
        }else{
            return false;
        }

    }
    //simple sleep funtion. Asynchronous.
    sleepFunction(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //this method is for handling all of the effects of an attack on square (i)
    resolveAttack(i){
        var accuracy = this.squares[this.selectedSquareIndex].value.accuracy
        var strikeValue = Math.floor(Math.random() * 101);
        var scale = 100;
        if(scale*accuracy>=strikeValue){
            //hit
            if(this.squares[i].value.healthCurrent >= 2){
                this.squares[i].value.healthCurrent = this.squares[i].value.healthCurrent - 1;
                var hurtSound = new Audio(Squeaks);
                hurtSound.play();
            }else{
                //the enemy is slain
                this.squares[i].value = new Pawn("","","");
                var slainSound = new Audio(Cry);
                slainSound.play();
            }
        }else{
            //miss, nothing happens
        }
    }

    makeValidMovement(selectedSquareIndex, i){
        this.squares[i].value = this.squares[selectedSquareIndex].value;
        this.squares[selectedSquareIndex].value = new Pawn("","","");
        this.squares[i].value.hasPlayedThisTurn = true;

    }

    //method is directly connected in Vue with the end turn button. This handles all of the resetting and cleanup at the end of a turn
    async completeTurn(){   
        this.movesMade++;
        this.turnOver=false;
        this.checkForWinner();
        if(this.inProgress){
            this.currentTurn = (this.currentTurn === Game.O) ? Game.X : Game.O; //if it is O's turn set to X's turn, otherwise set it to O's turn
            for (let x = 0; x < this.squares.length; x++) {
                this.squares[x].value.hasPlayedThisTurn = false;
                this.squares[x].isSelected = false;
            }
            if(this.currentTurn == Game.X){
                var randomOrder = this.shuffle(this.shuffleAI);
                //AI time
                while(!this.turnOver){
                    for (let x = 0; x < this.squares.length; x++) {
                        if((this.squares[randomOrder[x]].value.team == 'X')&&(!this.squares[randomOrder[x]].value.hasPlayedThisTurn)){
                            this.squares[randomOrder[x]].isSelected = true;
                            var AIMove = this.enemyAI.determineMove(randomOrder[x], this.squares);
                            this.selectedSquareIndex=randomOrder[x];
                            await new Promise(done => setTimeout(() => done(), 500));  
                            this.makeMove(AIMove);
                        }
                    }
                }
                this.completeTurn();
            }       
        }
        else{
            //do nothing because the game is over
        }
        
    }

    setLevel(level){
        var blank = new Pawn("","","");
        var evilCaterpie = new Pawn(0,'X',1,"-864","-0");
        var evilCaterpie2 = new Pawn(0,'X',1,"-864","-0");
        var evilCaterpie3 = new Pawn(0,'X',1,"-864","-0");
        var levelArray = [
            [blank,blank,blank,evilCaterpie,evilCaterpie2],
            [blank,blank,blank,evilCaterpie,evilCaterpie2,evilCaterpie3]
        ]
        for (let i = 0; i < levelArray[level].length; i++) {
            var startIndex = 0;
            console.log("adding caterpie at " + (startIndex+i));
            this.squares[startIndex+i].value = levelArray[level][i];
        }
    }
    //Core game engine method handling almost every in grid action
    makeMove(i){

        //we don't have a tile selected
        if(this.inProgress && !this.selectionMade){
            this.checkForValidSelection(i);
        }
        //If there is already a selection made then we can try to make a move or attack
        else if(this.inProgress && this.selectionMade){
            if(i==-1){
                //AI skips turn because there are no possible moves
                this.squares[this.selectedSquareIndex].value.hasPlayedThisTurn = true;
                this.squares[this.selectedSquareIndex].isSelected = false;
            }
            else if(this.squares[i].value.team==this.currentTurn){
                this.checkForValidSelection(i);
            }
            else if(this.checkForValidMove(i)){
                //move normally
                var position = this.getPositionInFundamentalBlock(i);
                var filled= 0;
                var temp = i;
                var aligned = false;
                var validOptions = this.checkForValidMoveWithValidIndexes(i);
                for (let x = 0; x < this.squares.length; x++) {
                    if((validOptions.includes(x)&&(filled<3))){
                        if(!aligned){
                            if(position == 'left'){
                                //do nothing we are already left aligned
                                aligned=true;
                            }
                            else if(position == 'right'){
                                temp = temp - 2;
                                aligned=true;
                            }
                            else{ 
                                //centre
                                temp--;
                                aligned=true;
                            }
                        }
                        if(this.checkForValidMove(temp)){
                            this.makeValidMovement(x, temp);
                            temp++;
                            filled=1;
                        }
                        else if(this.checkForValidMove(temp+1)){
                            this.makeValidMovement(x, temp+1);
                            temp=temp+2;
                            filled=2;
                        }
                        else if(this.checkForValidMove(temp+2)){
                            this.makeValidMovement(x, temp+2);
                            filled=3;
                        }
                    }
                }
                for (let x = 0; x < this.squares.length; x++) {
                    this.squares[x].isSelected = false;
                }
            }
            //We can't move there but maybe we can attack there
            else if(this.checkForAttack(this.selectedSquareIndex,i)){      
                for (let x = 0; x < this.squares.length; x++) {
                    if(this.squares[x].isSelected){
                        var attackSound = new Audio(Cannon);
                        attackSound.play();
                        this.resolveAttack(i);
                        this.squares[x].value.hasPlayedThisTurn = true;
                        this.squares[x].isSelected = false;
                    }
                    
                }
            }
            //move is not valid
            else{
                this.selectedSquareIndex = null;
                for (let x = 0; x < this.squares.length; x++) {
                    this.squares[x].isSelected = false;
                }
            }

        }
        this.turnOver=true;
        for (let x = 0; x < this.squares.length; x++) {
            if((this.squares[x].value.team==this.currentTurn)&&(!this.squares[x].value.hasPlayedThisTurn)){
                this.turnOver=false;
            }
        }

    }

    checkForWinner(){
        var xAlive=false;
        var oAlive=false;
        for (let x = 0; x < this.squares.length; x++) {
            if(this.squares[x].value.team=='X'){
                xAlive=true;
            }
            else if ((this.squares[x].value.team=='O')){
                oAlive=true;
            }
        }
        if((!xAlive)||(!oAlive)){
            this.inProgress = false;
            if(!xAlive){
                this.setLevel(1);
            }
        }
            


    }
    shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

}

Game.O = 'O';
Game.X = 'X';