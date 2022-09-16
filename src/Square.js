import Pawn from "./Pawn";
export default class Square{
    constructor(){
        this.value = new Pawn("","","");
        this.isHighlighted = false;
        this.isSelected = false;
    }
}