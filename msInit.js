// Initializes tile grid and all game data
function initGame(num)
{
  popup.classList.toggle("loading", true);
  popup.classList.toggle("win", false);
  popup.classList.toggle("lose", false);
  popup.classList.toggle("newgame", false);
  popup.innerHTML = 'Loading...';

  // Initialize game instance variables
  correctFlags = 0;
  incorrectFlags = 0;
  tilesRemaining = GRID_WIDTH * GRID_HEIGHT;
  NUM_BOMBS = num;
  numMoves = 0;
  board.innerHTML = '';
  grid = null;

  document.title = 'Minesweeper -- 0/' + NUM_BOMBS;

  // Initialize all data
  initTitle();
  initTileGrid();
  initEventListeners();
  initGridArray();
  initBombs();

  // Display game
  setVisibility(title, true);
  setVisibility(board, true);
  setVisibility(popup, false);
  popup.classList.toggle("loading", false);
}//end initGame

function initTitle()
{
  var bombCounter = document.getElementById("bombCounter");
  bombCounter.innerHTML = NUM_BOMBS;

  // Make bomb counter color match the difficulty selector
  if(NUM_BOMBS == 20)
  {
    bombCounter.classList.toggle("easy", true);
    bombCounter.classList.toggle("normal", false);
    bombCounter.classList.toggle("hard", false);
  }
  else if(NUM_BOMBS == 40)
  {
    bombCounter.classList.toggle("easy", false);
    bombCounter.classList.toggle("normal", true);
    bombCounter.classList.toggle("hard", false);
  }//end else if
  else if(NUM_BOMBS == 60)
  {
    bombCounter.classList.toggle("easy", false);
    bombCounter.classList.toggle("normal", false);
    bombCounter.classList.toggle("hard", true);
  }//end else if

  document.getElementById("moveCounter").innerHTML = 'Moves: ' + numMoves;
  document.getElementById("newGame").addEventListener('click', newGame);
}//end initStatus

function initTileGrid()
{
  // Grab game div to insert tiles into
  for(var y = 0; y < GRID_HEIGHT; y++)
  {
    for(var x = 0; x < GRID_WIDTH; x++)
    {
      // Insert a tile
      board.innerHTML += '<div class="tile" id="'+x+','+y+'" data-x="'+x+'" data-y="'+y+'"></div>';

      // Update tile positioning
      var tile = document.getElementById(x+','+y);
      tile.style.top = TILE_HEIGHT * y + 'px';
      tile.style.left = TILE_WIDTH * x + 'px';
    }//end for
  }//end for
}//end initTileGrid

// Adds click event listeners to each tile
function initEventListeners()
{
  for(var y = 0; y < GRID_HEIGHT; y++)
  {
    for(var x = 0; x < GRID_WIDTH; x++)
    {
      var tile = document.getElementById(x+','+y);
      tile.addEventListener('click', tileClick);
      tile.addEventListener('contextmenu', tileRightClick, false);
    }//end for
  }//end for
}//end initEventListeners

function removeEventListeners()
{
  for(var y = 0; y < GRID_HEIGHT; y++)
  {
    for(var x = 0; x < GRID_WIDTH; x++)
    {
      var tile = document.getElementById(x+','+y);
      tile.removeEventListener('click', tileClick);
      tile.removeEventListener('contextmenu', tileRightClick, false);

      // Add dummy event listeners to prevent context menu
      tile.addEventListener('contextmenu', function(ev) { ev.preventDefault(); return false; }, false);
    }//end for
  }//end for
}//end removeEventListeners

function initGridArray()
{
  grid = new Array(GRID_WIDTH);
  for(var i = 0; i < GRID_WIDTH; i++)
  {
    grid[i] = new Array(GRID_HEIGHT);
    for(var j = 0; j < GRID_HEIGHT; j++)
    {
      grid[i][j] = 0;
    }//end for
  }//end for
}//end initGridArray

function initBombs()
{
  var x_min = 0;
  var x_max = GRID_WIDTH;
  var y_min = 0;
  var y_max = GRID_HEIGHT;
  // Math.floor(Math.random() * (max - min) + min);
  for(var i = 0; i < NUM_BOMBS; i++)
  {
    var bombPlaced = false;
    var bombX = Math.floor(Math.random() * (x_max - x_min) + x_min);
    var bombY = Math.floor(Math.random() * (y_max - y_min) + y_min);
    while(grid[bombX][bombY] == -1)
    {
      bombX = Math.floor(Math.random() * (x_max - x_min) + x_min);
      bombY = Math.floor(Math.random() * (y_max - y_min) + y_min);
    }//end while

    grid[bombX][bombY] = -1;
    for(var y_offset = (bombY == 0 ? 0 : -1); y_offset <= 1 && y_offset + bombY < GRID_HEIGHT; y_offset++)
    {
      for(var x_offset = (bombX == 0 ? 0: -1); x_offset <= 1 && x_offset + bombX < GRID_WIDTH; x_offset++)
      {
        if(grid[bombX+x_offset][bombY+y_offset] != -1)
        {
          grid[bombX+x_offset][bombY+y_offset]++;
        }//end if
      }//end for
    }//end for
  }//end for
}//end initBombs
