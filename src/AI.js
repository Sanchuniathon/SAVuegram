import Game from "./Game";

export default class AI{
    constructor(){

    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    determineMove(selectedSquare, board){
        var potentialMove = this.getRandomInt(44);
        
        return potentialMove;
    }


}
