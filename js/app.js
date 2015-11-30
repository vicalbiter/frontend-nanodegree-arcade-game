// Declare useful global variables
var DISTANCE_X = 101,
    DISTANCE_Y = 83,
    OFFSET_X = 25,
    OFFSET_Y = 30,
    HOME_X = 202,
    HOME_Y = 405,
    ENEMY_HOME_X = -100,
    BOARD_WIDTH = 505,
    HITBOX_X = 50.5,
    HITBOX_Y = 41.5,
    INITIAL_HEALTH = 3,
    INITIAL_SCORE = 0,
    CHANGE_COLLECTIBLE_TIMER = 10,
    MASTER_TIMER = 60000;


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Set the initial x position in which the enemy will appear
    this.x = ENEMY_HOME_X;

    // Set the initial row (y position) in which the enemy will appear
    this.y = this.setRow();

    // Set enemy initial speed
    this.speed = this.setSpeed();

    // Create a circular hitbox to check for collisions with other game entities
    this.hitbox = {
        radius: 30,
        x: this.x + HITBOX_X,
        y: this.y + HITBOX_Y
    };

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Move the enemy acording to its speed
    this.x = this.x + this.speed * dt;

    // Update the row and speed of the enemy when it finishes its run
    if (this.x > BOARD_WIDTH) {
        this.x = ENEMY_HOME_X;
        this.speed = this.setSpeed();
        this.y = this.setRow();
    }

    // Update the hitbox
    this.hitbox.x = this.x + HITBOX_X;
    this.hitbox.y = this.y + HITBOX_Y;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Randomly select row in which the enemy will appear
Enemy.prototype.setRow = function() {

    // Generate random number between 1 and 3
    var row = Math.floor((Math.random() * 3) + 1);
    // Row 1 : 60;   Row 2 : 143;   Row 3 : 226;
    if (row === 1) {
        return 60;
    } else if (row === 2) {
        return 143;
    } else if (row === 3) {
        return 226;
    }
};

// Randomly select enemy speed
Enemy.prototype.setSpeed = function() {

    // Return a multiple of 20 in the range of [40, 200]
    return (Math.floor((Math.random() * 10) + 2)) * 20;

};

// Implement a method that will look for collisions with the player
/* As every hitbox is an imaginary circle, the condition to declare a collision
will be met if both the enemy and the player hitboxes are within a certain
distance. */
Enemy.prototype.collision = function(playerHitbox) {

    // Calculate distance between the hitboxes' centers
    var dx = this.hitbox.x - playerHitbox.x;
    var dy = this.hitbox.y - playerHitbox.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // Return a collision if the distance between the hitboxes' centers is less than
    // the sum of their radius
    if (distance < this.hitbox.radius + playerHitbox.radius) {
        return true;
    }

};

// Reset the enemy 
Enemy.prototype.reset = function() {
    this.x = ENEMY_HOME_X;
    this.y = this.setRow();
    this.setSpeed();
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // Assign the image for the player
    this.sprite = 'images/char-boy.png';

    // Assign the home position, the initial health and score for the player
    this.home();
    this.health = INITIAL_HEALTH;
    this.score = INITIAL_SCORE;

    // Create a circular hitbox to check for collisions with other game entities
    this.hitbox = {
        radius: 30,
        x: this.x + HITBOX_X,
        y: this.y + HITBOX_Y
    };

    // Initiate a flag that will check for when the player reaches the water
    this.scoreWater = false;

    // Initiate a character ID, so that a sprite is assigned to this value
    this.characterID = 0;
};

// Update the player's position
Player.prototype.update = function(dt) {

    // Update the hitbox
    this.hitbox.x = this.x + HITBOX_X;
    this.hitbox.y = this.y + HITBOX_Y;

    // Check if the player has reached the water
    this.scoreWater = this.reachedWater();
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Change the player position according to keyboard input
// The movement is limited so that the player won't move outside the canvas
Player.prototype.handleInput = function(pressedKey) {
    switch (pressedKey) {
        case 'left':
            if (this.x > 0) {
                this.x = this.x - DISTANCE_X;
            }
            break;
        case 'up':
            if (this.y > -10) {
                this.y = this.y - DISTANCE_Y;
            }
            break;
        case 'right':
            if (this.x < 404) {
                this.x = this.x + DISTANCE_X;
            }
            break;
        case 'down':
            if (this.y < 405) {
                this.y = this.y + DISTANCE_Y;
            }
            break;
    }
};

// Check if player has reached the water
Player.prototype.reachedWater = function() {

    // If the player has reached the water, score some points and then return it 
    // to its home position
    if (this.y === -10) {
        this.changeScore(2);
        this.home();
        return true;
    }

    return false;

};

// Send the player back to home
Player.prototype.home = function() {
    this.x = HOME_X;
    this.y = HOME_Y;
};

// Change the player's health by a certain "amount"
Player.prototype.changeHealth = function(amount) {
    this.health = this.health + amount;
};

// Change the player's score by a certain "amount"
Player.prototype.changeScore = function(amount) {
    this.score = this.score + amount;
};

// Reset the player to the home position, with the initial health and score
Player.prototype.reset = function() {
    this.home();
    this.health = INITIAL_HEALTH;
    this.score = INITIAL_SCORE;
};

// Change the character
Player.prototype.changeCharacter = function() {
    // Look for the next character ID when the function is called
    this.characterID++;

    // As there are only two characters, keep characterID with values of [0, 1]
    if (this.characterID === 2) {
        this.characterID = 0;
    }

    // Make a lookup for the corresponding sprite
    switch (this.characterID) {
        case 0:
            this.sprite = 'images/char-boy.png';
            break;
        case 1:
            this.sprite = 'images/char-pink-girl.png';
            break;
    }
};

// Collectibles class
var Collectible = function() {

    // Initiate the collectible coordinates
    this.x = 0;
    this.y = 0;

    // Initiate a variable which will tell the type of collectible this is
    this.collectibleType = '';

    // Initiate a timer variable that will determine when the collectible will apear/disappear
    this.timer = 0;

    // Create a circular hitbox to check for collisions with the player
    this.hitbox = {
        radius: 30,
        x: this.x + HITBOX_X - OFFSET_X,
        y: this.y + HITBOX_Y - OFFSET_Y
    };

    // Randomly assign which collectible will appear and where
    this.setCollectible();
};

// Update the collectible status (appear, dissapear and change type accordingly)
Collectible.prototype.update = function(dt) {

    // Increase the timer every dt
    this.timer = this.timer + dt;

    // Chance the collectible if the time has elapsed
    if (this.timer > CHANGE_COLLECTIBLE_TIMER) {

        this.setCollectible();

        // Reset the collectible timer
        this.timer = 0;
    }

};

// Randomly assign a collectible image and type
Collectible.prototype.setCollectible = function() {

    // Assign a random number from 1 to 3 to determine which type of collectible will appear
    var type = Math.floor((Math.random() * 4) + 1);

    // Set the sprite and the collectible type according to the random generated number
    if (type === 1) {
        this.sprite = 'images/Heart.png';
        this.collectibleType = 'heart';
    } else if (type === 2) {
        this.sprite = 'images/GemBlue.png';
        this.collectibleType = 'gem';
    } else if (type === 3) {
        this.sprite = 'images/GemGreen.png';
        this.collectibleType = 'gem';
    } else if (type === 4) {
        this.sprite = 'images/GemOrange.png';
        this.collectibleType = 'gem';
    }

    // Randomly assign the collectible position
    this.setPosition();

    // Update the collectible hitbox
    this.hitbox.x = this.x + HITBOX_X - OFFSET_X;
    this.hitbox.y = this.y + HITBOX_Y - OFFSET_Y;

    // Reset the collectible timer
    this.timer = 0;

};

// Randomly set the x and y parameters of the collectible item
Collectible.prototype.setPosition = function() {

    // Randomly assign a row and a column in which the collectible
    // will appear (limited to the stone blocks area)
    var row = Math.floor((Math.random() * 3) + 1);
    var column = Math.floor((Math.random() * 5));

    // Set the image position on the grid
    // The offset variables are used to center the images within the squares
    this.x = (DISTANCE_X * column) + OFFSET_X;
    this.y = (DISTANCE_Y * row) + OFFSET_Y;
};

// Draw the collectible on the screen
Collectible.prototype.render = function() {
    // Resize the collectible images to fit the squares
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 85);
};

// Check for a collision with the player
Collectible.prototype.collision = function(playerHitbox) {

    // Calculate distance between the hitboxes' centers
    var dx = this.hitbox.x - playerHitbox.x;
    var dy = this.hitbox.y - playerHitbox.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // Return a collision if the distance between the hitboxes' centers is less than
    // the sum of their radius
    if (distance < this.hitbox.radius + playerHitbox.radius) {
        return true;
    }

};

// Reset the collectible parameters
Collectible.prototype.reset = function() {
    this.setCollectible();
};

// Create a Scoreboard Class in which the player score, health and game timer will be
// managed
var Scoreboard = function(score, health) {
    // Set a variable in which all the player information will be displayed.
    // This variable should be an element (a 'div') from the DOM.
    this.scoreboard = '';

    // Set a variable in which the game timer will be displayed. This
    // variable should be an element (a 'div') from the DOM.
    this.gameTimer = '';

    // Set the initial score and health variables
    this.score = score;
    this.health = health;

    // Set the actual game timer
    this.timedGameTimer = MASTER_TIMER;

    // Set a flag to identify when the game has finished
    this.gameFinished = false;

    // Set a flag to identify when the user wants to restart the game
    this.restartGame = false;

    // Set a flag to identify when the game is paused
    this.gamePaused = true;

    // Set a flag to identify when the game is started
    this.startGame = false;

    // Set a flag to identify when the user wants to change character
    this.changeCharacter = false;
};

// Update the scoreboard with the current player score and health
Scoreboard.prototype.updateSH = function(score, health) {

    // Update the score and health variables
    this.score = score;
    this.health = health;

    this.scoreboard.innerHTML = '<h1>Scoreboard</h1>' +
        '<div id="health">Lives: ' + health + '</div>' +
        '<div id="score">Score: ' + score + '</div>';

    // Display information on how to pause the game

    // If the player runs out of health, show the "Game Over" message
    if (this.health <= 0) {
        this.gameOver();
    }

};

// Update the gameTimer and show it on-screen
Scoreboard.prototype.updateGameTimer = function(dt) {
    // Only keep counting when the game has not finished
    if (!this.gameFinished && !this.gamePaused) {
        this.timedGameTimer = this.timedGameTimer - dt * 1000;
        this.gameTimer.innerHTML = '<h2>Time Left: ' + Math.floor(this.timedGameTimer / 1000 + 1) + '</h2>';
    }

    // Do not show any message if the game is paused
    if (this.gamePaused) {
        this.gameTimer.innerHTML = '';
    }

    // If the game timer runs out, show the "Game Over" message
    if (this.timedGameTimer <= 0) {
        this.gameOver();
    }
};

// Display a "Game Over!" message in the scoreboard area
Scoreboard.prototype.gameOver = function() {
    this.gameFinished = true;
    this.scoreboard.innerHTML = '<h1>Game Over!</h1>' +
        '<h1> Your score:  ' + this.score + '</h1>' +
        '<h2>Press "r" to reset</h2>';
    this.gameTimer.innerHTML = '';
};

// Display the pause/unpause message
Scoreboard.prototype.pause = function() {
    this.scoreboard.innerHTML = '<h1>Press "p" to unpause the game </h1>' +
        '<h3>... Or press "r" to reset</h3>';
};

// Display the "Start game" message
Scoreboard.prototype.start = function() {
    this.scoreboard.innerHTML = '<h1>Press "s" to start the game! </h1>' +
        '<h2>Instructions</h2>' +
        '<div class="instructions">-Use the keyboard arrows to move your character</h2>' +
        '<div class="instructions">-Press "p" to pause the game</h2>' +
        '<div class="instructions">-Before starting, you can change your by character pressing "c"</h3>';
    // Don't show the timer when the "Start game" message is on screen
    this.gameTimer.innerHTML = '';
};

// Handle input keys for starting, pausing and restarting the game
Scoreboard.prototype.handleInput = function(pressedKey) {
    switch (pressedKey) {
        // Key for restarting the game
        case 'r':
            this.resetGame = true;
            break;

        // Key for pausing the game
        case 'p':
            if (this.gamePaused && this.startGame) {
                this.gamePaused = false;
                this.updateSH(this.score, this.health);
            } else {
                this.gamePaused = true;
                this.pause();
            }
            break;

        // Key for starting the game
        case 's':
            if (!this.startGame) {
                this.startGame = true;
                this.gamePaused = false;
                this.updateSH(this.score, this.health);
            }
            break;

        // Key for changing the character when the game has
        // not started
        case 'c':
            if (!this.startGame) {
                this.changeCharacter = true;
            }
            break;
    }
};

// Reset the game
Scoreboard.prototype.reset = function(player) {
    this.timedGameTimer = MASTER_TIMER;
    this.updateSH(player.score, player.health);
    this.gameFinished = false;
    this.startGame = false;
    this.gamePaused = true;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

// Place the player object in a variable called player
var player = new Player();

// Place the collectible item in a variable named collectible
var collectible = new Collectible();

// Create the scoreboard object by passing global.scoreboard as its parameter
var board = new Scoreboard();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c',
        80: 'p',
        82: 'r',
        83: 's'
    };

    // Only allow the player to be moved if the game is not paused nor finished
    if (!board.gameFinished && !board.gamePaused) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
    board.handleInput(allowedKeys[e.keyCode]);
});