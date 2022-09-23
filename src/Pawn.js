export default class Pawn{
    constructor(name, team, health, characterX, characterY){
        this.team = team;
        this.name = name;
        this.healthTotal = health;
        this.healthCurrent=health;
        if(this.team == 'X'){ //weak evil guys
            this.accuracy = .35;
        }
        else{
            this.accuracy = .5;
        }
        this.isHighlighted = false;
        this.hasPlayedThisTurn = false;
        this.character = [characterX,characterY]//[-2880,-1920];//default to empty space

    }
}