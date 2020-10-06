

let grid = document.getElementById("tableroBM");
let qRow = document.getElementById("tableRow");
let qCol  = document.getElementById("tableCol");
let qMines  = document.getElementById("mineQty");
let easy  = document.getElementById("easy");
let medium  = document.getElementById("med");
let hard  = document.getElementById("hard");
// [displayMines] --> change value to display mines
let displayMines = true; 

function createTable() {
  
    grid.innerHTML="";
    document.body.className = '';

    let _qRow = Number(qRow.value);
    let _qCol  = Number(qCol.value);
    let _qMines  = Number(qMines.value);

    //beginning of the game with no input assigned
    if(_qRow == "" && _qCol == "" && _qMines == ""){
        _qRow = 10;
        _qCol  = 10;
        _qMines  = 10;
    }

    if( (_qRow != "" && _qCol != "" && _qMines != "") || 
        (document.querySelector('span').classList.contains("selected")) ){
        $('.error').hide();

        if(document.querySelector('#easy').classList.contains("selected")){
            _qRow = 10;
            _qCol  = 10;
            _qMines  = 10;
        }

        if(document.querySelector('#med').classList.contains("selected")){
            _qRow = 15;
            _qCol  = 15;
            _qMines  = 50;
        }

        if(document.querySelector('#hard').classList.contains("selected")){
            _qRow = 25;
            _qCol  = 25;
            _qMines  = 175;
        }

        for (let i=0; i<_qRow; i++) {
            row = grid.insertRow(i);
            for (let j=0; j<_qCol; j++) {
                cell = row.insertCell(j);
                cell.onclick = function() { 
                    clickCell(this,_qRow,_qCol); 
                };
                let mine = document.createAttribute("data-mine");       
                mine.value = "false";             
                cell.setAttributeNode(mine);
            }
        }
        addMines(_qRow,_qCol,_qMines);

    } else {
        $('.error').show();
    }

    //disable right click on board
    $('#tableroBM').mousedown(function(e){
        if(e.which == 3){
            $(this).bind("contextmenu",function(e){
                return false;
            });
        }
    })

    //win/lose
    let win = localStorage.getItem('victory');
    let def = localStorage.getItem('defeat');
    if(win == ''){ win = 0; }
    if(def == ''){ def = 0; }
    $('#vic').text(win);
    $('#def').text(def);

}

createTable();


function addMines(_qRow,_qCol,_qMines) {
    //Add mines randomly

    if(_qMines == ""){
        _qMines = 20;
    }

    let row, col;
    for (let i=0; i<_qMines; i++) {
        row = Math.floor(Math.random() * _qRow);
        col = Math.floor(Math.random() * _qCol);
        let cell = grid.rows[row].cells[col];
        cell.setAttribute("data-mine","true");
        if (displayMines) cell.innerHTML="X";
    }

}

function revealMines(_qRow,_qCol) {
    //Highlight all mines in red
    for (let i=0; i<_qRow; i++) {
        for(let j=0; j<_qCol; j++) {
            let cell = grid.rows[i].cells[j];
            if (cell.getAttribute("data-mine")=="true") cell.className="mine";
        }
    }
}

function checkLevelCompletion(_qRow,_qCol) {
  let levelComplete = true;
    for (let i=0; i<_qRow; i++) {
        for(let j=0; j<_qCol; j++) {
            if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
        }
    }
    if (levelComplete) {
        document.body.classList.add("victory");
        revealMines(_qRow,_qCol);
        let qty = localStorage.getItem('victory');
        if(qty == ''){
            qty = 1;
        } else {
            qty++;
        }
        $('#vic').text(qty);
        localStorage.setItem('victory', qty);
    }
}

function clickCell(cell,_qRow,_qCol) {
    //Check if the end-user clicked on a mine
    if (cell.getAttribute("data-mine")=="true") {
        revealMines(_qRow,_qCol);
        document.body.classList.add("defeat");

        let qty = localStorage.getItem('defeat');
        if(qty == ''){
            qty = 1;
        } else {
            qty++;
        }
        $('#def').text(qty);
        localStorage.setItem('defeat', qty);

    } else {
        cell.className="clicked";
        //Count and display the number of adjacent mines
        let mineCount=0;
        let cellRow = cell.parentNode.rowIndex;
        let cellCol = cell.cellIndex;

        for (let i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,_qRow-1); i++) {
            for(let j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,_qCol-1); j++) {
                if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
            }
        }
        cell.innerHTML=mineCount;
        if (mineCount==0) { 
            //Reveal all adjacent cells as they do not have a mine
            for (let i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,_qRow-1); i++) {
                for(let j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,_qCol-1); j++) {
                //Recursive Call
                if (grid.rows[i].cells[j].innerHTML=="") clickCell(grid.rows[i].cells[j],_qRow,_qCol);
                }
            }
        }
        checkLevelCompletion(_qRow,_qCol);
    }
}

$(document).ready(function(){
    $('.col span').on('click',function(){
        $('input').val('');
        $('.col span').not(this).removeClass('selected');
        $(this).addClass('selected');
    });

    $('input').on('click',function() {
        $('.difSelect').removeClass('selected');
    });
})