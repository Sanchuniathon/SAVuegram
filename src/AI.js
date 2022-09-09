import Game from "./Game";

export default class AI{
    constructor(){

    }
    //simple sleep funtion. Asynchronous.
    sleepFunction(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    determineMove(selectedSquare, board){
        var potentialMove = this.getRandomInt(45);
        this.sleepFunction(200);
        return potentialMove;
    }


}
