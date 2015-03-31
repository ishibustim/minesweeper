// Initialization functions in initFunctions.js

var title;
var board;
var popup;

var TILE_WIDTH = 30;
var TILE_HEIGHT = 30;
var GRID_WIDTH = 20;
var GRID_HEIGHT = 20;

var NUM_BOMBS;

// Shouldn't need to put objects in here. Should be able to check correctFlags vs NUM_BOMBS and tilesRemaining vs NUM_BOMBS
var grid;

// When this equals NUM_BOMBS, victory
var correctFlags;

// Used to verify flag victory
var incorrectFlags;

// When this equals NUM_BOMBS, victory
var tilesRemaining;

// Track number of moves
var numMoves;

// Flag Unicode Character
var flagSymbol = '\u2714';

// Bomb Unicode Character
var bombSymbol = '\u2734';

// Create game on window load
//window.onload = function()
function windowLoad()
{
  // This will inject the correct divs into the game div
  var game = document.getElementById('game');
  game.innerHTML += '<div id="popup" class="loading">Loading</div>';
  game.innerHTML += '<div id="title"></div>';
  game.innerHTML += '<div id="board"></div>';

  popup = document.getElementById('popup');
  title = document.getElementById('title');
  board = document.getElementById('board');

  title.innerHTML += '<div class="newgame" id="newGame">New Game</div>';
  title.innerHTML += '<div class="title">Minesweeper</div>';
  title.innerHTML += '<div class="moves" id="moveCounter">Moves: 0</div>';
  title.innerHTML += '<div class="counter" id="bombCounter"></div>';
  
  // Add dummy event listener to prevent right click
  game.addEventListener('contextmenu', function(ev) { ev.preventDefault(); return false; }, false);

  // This loads the difficulty selector
  newGame();
};//end onload

function newGame()
{
  document.title = 'Minesweeper';

  setVisibility(title, false);
  setVisibility(board, false);
  popup.classList.toggle("win", false);
  popup.classList.toggle("lose", false);
  popup.classList.toggle("loading", false);
  popup.classList.toggle("newgame", true);
  popup.innerHTML = '<div class="easy" onclick="initGame(20)">Easy</div><div class="normal" onclick="initGame(40)">Normal</div><div class="hard" onclick="initGame(60)">Hard</div>';
  setVisibility(popup, true);
}//end newGame

function tileClick(event)
{
  // Update move counter
  numMoves++;
  document.getElementById("moveCounter").innerHTML = 'Moves: ' + numMoves;

  // Get clicked tile div
  var tile = event.currentTarget;

  // Find x and y coords
  var x = parseInt(tile.getAttribute('data-x'));
  var y = parseInt(tile.getAttribute('data-y'));

  selectTile(x, y);
}//end tileClick

function tileRightClick(event)
{
  // Prevent the context menu from appearing
  event.preventDefault();

  // Get clicked tile div
  var tile = event.currentTarget;

  // Find x and y coords
  var x = parseInt(tile.getAttribute('data-x'));
  var y = parseInt(tile.getAttribute('data-y'));

  if(!tile.classList.contains('clicked'))
  {
    // Update move counter
    numMoves++;
    document.getElementById("moveCounter").innerHTML = 'Moves: ' + numMoves;

    if(!tile.classList.contains('flagged'))
    {
      // Update the right-clicked status
      tile.classList.toggle('flagged', true);

      // Enter the tile display info
      tile.innerHTML = flagSymbol;

      // Remove the regular click listener
      tile.removeEventListener('click', tileClick);  

      // Manage flag counters
      if(grid[x][y] == -1)
      {
        correctFlags++;
      }//end if
      else
      {
        incorrectFlags++;
      }//end else
    }//end if
    else
    {
      //update the right-clicked status
      tile.classList.toggle('flagged', false);

      // Enter the tile display info
      tile.innerHTML ='';

      // Add the regular click listener back in
      tile.addEventListener('click', tileClick);

      // Manage flag counters
      if(grid[x][y] == -1)
      {
        correctFlags--;
      }//end if
      else
      {
        incorrectFlags--;
      }//end else
    }//end else
    document.getElementById('bombCounter').innerHTML = NUM_BOMBS - (correctFlags + incorrectFlags);
    document.title = 'Minesweeper -- ' + (correctFlags + incorrectFlags) + '/' + NUM_BOMBS;
    checkWin();
  }//end if

  // Prevent the conext menu from appearing when bubbling
  return false;
}//end tileRightClick

function selectTile(x, y)
{
  updateTile(x, y);
  if(grid[x][y] == 0)
  {
    clearGrid(x, y);
  }//end if
  checkWin();
}//end selectTile

// This function updates the text that is displayed on the tile when it is selected
function updateTile(x, y)
{
  var tile = document.getElementById(x+','+y);

  if(!tile.classList.contains("clicked"))
  {
    // Decrement remaining tile counter
    tilesRemaining--;

    // Update clicked status
    tile.classList.toggle("clicked", true);

    // Enter tile display info
    if(grid[x][y] == -1)
    {
      tile.innerHTML = bombSymbol;
      checkLoss(x, y);
    }//end if
    else
    {
      tile.innerHTML = (grid[x][y] != 0 ? grid[x][y] : '');
    }//end else

    // Remove the click listener since this can no longer be clicked
    tile.removeEventListener('click', tileClick);
  }//end if
}//end updateTile

function clearGrid(x, y)
{
  updateTile(x, y);
  if(grid[x][y] == 0)
  {
    for(var yOffset = (y == 0 ? 0 : -1); yOffset <= 1 && y + yOffset < GRID_HEIGHT; yOffset++)
    {
      for(var xOffset = (x == 0 ? 0 : -1); xOffset <= 1 && x + xOffset < GRID_WIDTH; xOffset++)
      {
        // Don't clearGrid on current tile again
        if(xOffset != 0 || yOffset != 0)
        {
          var tile = document.getElementById((x+xOffset)+','+(y+yOffset));
          // Don't clearGrid for tile that has already been selected or flagged
          if(!tile.classList.contains('clicked') && !tile.classList.contains('flagged'))
          {
            clearGrid(x + xOffset, y + yOffset);
          }//ned if
        }//end if
      }//end for
    }//end for
  }//end if
}//end clearGrid

function checkWin()
{
  // Check flag win and click win
  if((correctFlags == NUM_BOMBS && incorrectFlags == 0) || tilesRemaining == NUM_BOMBS)
  {
    popup.innerHTML = "You Win!";
    popup.classList.toggle("win", true);
    setVisibility(popup, true);
    removeEventListeners();
  }//end if
}//end checkWin

function checkLoss(x, y)
{
  if(grid[x][y] == -1)
  {
    popup.innerHTML = "You Lose!";
    popup.classList.toggle("lose", true);
    setVisibility(popup, true);
    var tile = document.getElementById(x+','+y);
    tile.style.background = "red";
    tile.style.borderColor = "red";
    removeEventListeners();
  }//end if
}//end checkLoss

function setVisibility(elem, flag)
{
  if(flag)
  {
    elem.style.visibility = 'visible';
  }//end if
  else
  {
    elem.style.visibility = 'hidden';
  }//end else
}//end setVisibility
