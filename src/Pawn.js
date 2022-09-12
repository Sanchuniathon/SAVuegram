export default class Pawn{
    constructor(id, team, health, character){
        this.team = team;
        this.id = id;
        this.health = health;
        if(this.team == 'X'){ //weak evil guys
            this.accuracy = .35;
        }
        else{
            this.accuracy = .5;
        }
        this.isHighlighted = false;
        this.hasPlayedThisTurn = false;
        this.character = [-100,0]//[-2880,-1920];//default to empty space

    }
}