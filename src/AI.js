import Game from "./Game";

export default class AI{
    constructor(){

    }
    getRandomInt(max) {
        return Math.floor((Math.random() * max));
    }
    determineMove(selectedSquare, board){
        var move = this.getOpenAdjacentSquares(selectedSquare, board);
        //console.log("our choice is: " + move[randomlyChosenMove]);
        return this.pickBestMove(move, board);
        //var randomlyChosenMove = this.getRandomInt(move.length);
        
        //return move[randomlyChosenMove];
    }
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
    getOpenAdjacentSquares(selectedSquareIndex, board){
        //Can't move within the same square
        var refinedPosition = this.getPositionInFundamentalBlock(selectedSquareIndex);
        var checkLocation = selectedSquareIndex;
        if(refinedPosition == 'left'){
            checkLocation++;
        }else if (refinedPosition == 'right'){
            checkLocation--;
        }//no position adjustment for centre

        var validRelativeLocations = [];
        var moveOptions = [];
        var rightIndices = [6,7,8,15,16,17,24,25,26,33,34,35,42,43,44,51,52,53];
        var leftIndices = [0,1,2,9,10,11,18,19,20,27,28,29,36,37,38,45,46,47];
        if(rightIndices.includes(checkLocation)){
            validRelativeLocations = [-10,-9,-8,-4,-3,-2,8,9,10];
        }
        else if(leftIndices.includes(checkLocation)){
            validRelativeLocations = [-10,-9,-8,2,3,4,8,9,10];
        }
        else{
            validRelativeLocations = [-10,-9,-8,-4,-3,-2,2,3,4,8,9,10];
        }
        var temp;
        for (let x = 0; x < validRelativeLocations.length; x++) {
            temp = validRelativeLocations[x] + checkLocation;
            if((temp>8)&&(temp<45)&&(board[temp].value.team!='X')){ //can't go back to deployment area or on top of our own team
                if(this.isFundamentalSquareAvailable(temp,selectedSquareIndex,board)){
                    moveOptions.push(validRelativeLocations[x] + checkLocation);
                }
                else{ //enemy 'O' occupied square
                    if(board[temp].value.team=='O'){
                        moveOptions.push(validRelativeLocations[x] + checkLocation);
                    }


                }
                
            }
        }
        return moveOptions;

    }
    //This method uses a selected square (selectedSquare) and a destination choice (i) and returns true if the character can move there
    isFundamentalSquareAvailable(i, selectedSquareIndex,board){
        var refinedPosition = this.getPositionInFundamentalBlock(i);
        let movingTeam = board[selectedSquareIndex].value.team;
        if(refinedPosition == 'left'){        
            for (let x = i; x < (i+3); x++) {
                if((board[x].value.team==movingTeam) && (board[i].value.team=="")){
                    //we found a friendly in the fundamental square and we have an opening to move into the chosen refined spot
                    return true;
                }
                else if((board[x].value.team!=movingTeam) && (board[x].value.team!="")){
                    //it is an enemy, we can't go there
                    return false;
                }           
            }
        }else if (refinedPosition == 'right'){                
            for (let x = (i-2); x <= i; x++) {              
                if((board[x].value.team==movingTeam) && (board[i].value.team=="")){
                    //we found a friendly in the fundamental square and we have an opening to move into the chosen refined spot
                    return true;
                }
                else if((board[x].value.team!=movingTeam) && (board[x].value.team!="")){
                    //it is an enemy, we can't go there
                    return false;
                }   
            }
        }else{
            //centre  
            for (let x = (i-1); x <= i+1; x++) {   
                if((board[x].value.team==movingTeam) && (board[i].value.team=="")){
                    //we found a friendly in the fundamental square and we have an opening to move into the chosen refined spot
                    return true;
                }
                else if((board[x].value.team!=movingTeam) && (board[x].value.team!="")){
                    //it is an enemy, we can't go there
                    return false;
                }   
            }
        }
        if(board[i].value.team==""){
            return true;
        }
        else{
            return false;
        }

    }

    pickBestMove(possibleMoves, board){
        possibleMoves.sort(function(a, b){return b - a});
        for (let x = 0; x < (possibleMoves.length); x++) {
            //pick the best move. Priority is to attack if possible
            if(board[possibleMoves[x]].value.team == 'O'){
                return possibleMoves[x]
            }
        }
        return possibleMoves[this.getRandomInt(possibleMoves.length)];
    }

}
