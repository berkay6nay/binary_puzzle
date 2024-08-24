function setUpGame(){ 
    allocateRandomNumbersToAims();
    let startTime = Date.now();
        let timerElement = document.getElementById("timer");
        timerElement.classList.replace("timer-container-invisible" , "timer-container");

        let timerInterval = setInterval(function(){
            let elapsedTime = (Date.now() - startTime) / 1000;
            timerElement.textContent = `${elapsedTime.toFixed(2)} seconds`;
            if (checkIfGameHasEnded()){
                var reset = document.getElementById("reset-game-invisible");
                reset.setAttribute("class" , "reset-game");
                if(checkIfNewRecordBroken(elapsedTime)) timerElement.textContent = `New Record : ${elapsedTime.toFixed(2)} seconds`;
                else timerElement.textContent = `Puzzled solved in ${elapsedTime.toFixed(2)} seconds`;
                Game.timeList.push(elapsedTime);
                clearInterval(timerInterval);
                
            }
        },10);

    var setup = document.getElementById("setup-game");
    setup.setAttribute("class" , "setup-game-invisible");
}

document.getElementById("setup-game").onclick = setUpGame;
document.getElementById("reset-game-invisible").onclick = resetGame; 

function allocateRandomNumbersToAims(){
    for(var i = 0 ; i < Game.numberOfCellsInARow ; ++i){
        var id  = i.toString() + 4; 
        var aim_cell = document.getElementById(id);
        aim_cell.innerHTML = Math.floor(Math.random() * (15)) + 1;
    }
}

function resetGame(){
    resetTheAimReachedList();
    resetThePuzzleCells();
    var reset = document.getElementById("reset-game-invisible");
    reset.setAttribute("class" , "reset-game-invisible");
    setUpGame();
}

function resetTheAimReachedList(){
    for(var i = 0 ; i < Game.numberOfCellsInARow ; ++i){
        Game.isAimReachedList[i] = "unreached";
    }
}

function resetThePuzzleCells(){
    for(var i = 0 ; i < Game.numberOfCellsInARow ; ++i){
        var aimId = i.toString() + 4;
        var aim = document.getElementById(aimId);
        aim.classList.replace("reached" , "unreached");
        for(var j = 0 ; j < Game.numberOfCellsInARow ; ++j){
            var cellId = j.toString() + i;
            var cell = document.getElementById(cellId);
            cell.innerHTML = 0;
            if(cell.className == "puzzle-button-clicked"){
                cell.setAttribute("class" , "puzzle-button-non-clicked");
            }
        }
    }
}

var table = document.getElementById("main-table"); 
table.addEventListener("click" , function(e){
    var element = e.target;
    if(element.className == "puzzle-button-non-clicked"){
        element.innerHTML = 1;
        element.setAttribute("class" , "puzzle-button-clicked");
        changeAimCell(element);
    }
    else if(element.className == "puzzle-button-clicked"){
        element.innerHTML = 0;
        element.setAttribute("class" , "puzzle-button-non-clicked");
        changeAimCell(element);
    }
});

function changeAimCell(element){
    if(checkIfAimReached(element)){
        aimId = element.id.charAt(0) + Game.numberOfCellsInARow;
        aimElement = document.getElementById(aimId);
        changeStateOfAimCell(element , "reached");
        aimElement.classList.replace("unreached" , "reached");
        checkIfGameHasEnded();
    }
    else{
        aimId = element.id.charAt(0) + Game.numberOfCellsInARow;
        aimElement = document.getElementById(aimId);
        try{
            aimElement.classList.replace("reached" ,"unreached");
            changeStateOfAimCell(element , "unreached");
        }
        catch{
            console.log("aim already unreached");
        }
    }
}

function changeStateOfAimCell(element , state){
    indexOfAim = element.id.charAt(0);
    Game.isAimReachedList[indexOfAim] = state;
}

function checkIfGameHasEnded(){
    var flag = 0;
    for(var i = 0 ; i < Game.numberOfTotalAims; ++i){
        if(Game.isAimReachedList[i] === "reached") ++flag;
    }
    if(flag === Game.numberOfTotalAims){
        return true;
    } 
    return false;
}

function checkIfAimReached(element){
        var id = element.id.toString();
        var row_number = id.charAt(0);
        var aim_id = row_number + 4;
        var aim = document.getElementById(aim_id).innerHTML;
        var sum = 0;
        for(var i = 0 ; i < Game.numberOfCellsInARow  ; ++i){
            idOfCurrentCell = row_number + i;
            isBitLighted = document.getElementById(idOfCurrentCell);
            if(isBitLighted.innerHTML == 1){
                sum += Math.pow(2 , i);
            }
        }
        if(sum == aim){
            return true;
        }
        return false;
}

function checkIfNewRecordBroken(newTime){
    if(Game.timeList.length === 0){
        return false;
    }
    else{
        var smallestTime = Math.min(Game.timeList);
        if(newTime < smallestTime) return true;
        else return false;
    }
    
}

var Game = {
    numberOfCellsInARow : 4,
    numberOfTotalAims : 4,
    isAimReachedList : ["unreached" , "unreached" , "unreached" , "unreached"],
    timeList : []
}