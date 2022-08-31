export default class Pawn{
    constructor(id, team, health){
        this.team = team;
        this.id = id;
        this.health = health;
        this.accuracy = .5;
        this.isHighlighted = false;
        this.hasPlayedThisTurn = false;
    }
}