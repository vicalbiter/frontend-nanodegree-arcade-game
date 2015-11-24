// Declare useful global variables
var distanceX = 101,
    distanceY = 83,
    homeX = 202,
    homeY = 405,
    enemyHomeX = -100,
    boardWidth = 505,
    boardHeigh = 606,
    hitboxX = 50.5,
    hitboxY = 41.5,
    changeCollectibleTimer = 10;


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Set the initial x position in which the enemy will appear
    this.x = enemyHomeX;

    // Set the initial row (y position) in which the enemy will appear
    this.y = this.setRow();

    // Set enemy initial speed
    this.speed = this.setSpeed();

    // Create a circular hitbox to check for collisions with other game entities
    this.hitbox = {
        radius : 30,
        x: this.x + hitboxX,
        y: this.y + hitboxY
    };

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Move the enemy acording to its speed
    this.x = this.x + this.speed*dt;

    // Update the row and speed of the enemy when it finishes its run
    if (this.x > boardWidth) {
        this.x = enemyHomeX;
        this.speed = this.setSpeed();
        this.y = this.setRow();
    }

    // Update the hitbox
    this.hitbox.x = this.x + hitboxX;
    this.hitbox.y = this.y + hitboxY;

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
    if (row === 1) { return 60; }
    else if (row === 2) { return 143; }
    else if (row === 3) { return 226; }
};

// Randomly select enemy speed
Enemy.prototype.setSpeed = function() {

    // Return a multiple of 20 in the range of [40, 200]
    return (Math.floor((Math.random() * 10) + 2)) * 20;

};

// Check for a collision with the player
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // Assign the image for the player
    this.sprite = 'images/char-boy.png';

    // Assign the home position for the player
    this.home();

    // Assign an initial health
    this.health = 3;

    // Assign an initial score
    this.score = 0;

    // Create a circular hitbox to check for collisions with other game entities
    this.hitbox = {
        radius : 30,
        x: this.x + hitboxX,
        y: this.y + hitboxY
    };
};

// Update the player's position
Player.prototype.update = function(dt) {

    // Update the hitbox
    this.hitbox.x = this.x + hitboxX;
    this.hitbox.y = this.y + hitboxY;

    // Check if the player has reached the water
    this.reachedWater();
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Change the player position according to keyboard input
// The movement is limited so that the player won't move outside the canvas
Player.prototype.handleInput = function(pressedKey) {
    switch(pressedKey) {
        case 'left': 
            if (this.x > 0) { this.x = this.x - distanceX; }
            break;
        case 'up':
            if (this.y > -10) { this.y = this.y - distanceY; }
            break;
        case 'right':
            if (this.x < 404) { this.x = this.x + distanceX; }
            break;
        case 'down':
            if (this.y < 405) { this.y = this.y + distanceY; }
            break;
    }
};

// Check if player has reached the water
Player.prototype.reachedWater = function() {

    // If the player has reached the water, score some points and then return it 
    // to its home position
    if (player.y === -10) {
        this.changeScore(2);
        this.home();
    }

};

// Send the player back to home
Player.prototype.home = function() {
    this.x = homeX;
    this.y = homeY;
};

// Change the player's health by a certain "amount"
Player.prototype.changeHealth = function(amount) {
    this.health = this.health + amount;
};

// Change the player's score by a certain "amount"
Player.prototype.changeScore = function(amount) {
    this.score = this.score + amount;
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
        radius : 30,
        x: this.x + hitboxX,
        y: this.y + hitboxY
    };

    // Randomly assign which collectible will appear and where
    this.setCollectible();
};

// Update the collectible status (appear, dissapear and change type accordingly)
Collectible.prototype.update = function(dt) {
    
    // Increase the timer every dt
    this.timer = this.timer + dt;

    // Chance the collectible if the time has elapsed
    if (this.timer > changeCollectibleTimer) {
        
        this.setCollectible();

        // Reset the collectible timer
        this.timer = 0;
    }

};

// Randomly assign a collectible image and type
Collectible.prototype.setCollectible = function() {

    // Assign a random number from 1 to 3 to determine which collectible will appear
    var collectible = Math.floor((Math.random() * 4) + 1);

    // Set the sprite and the collectible type according to the random generated number
    if (collectible === 1) { this.sprite = 'images/Heart.png'; this.collectibleType = 'heart'; }
    else if (collectible === 2) { this.sprite = 'images/GemBlue.png'; this.collectibleType = 'gem'; }
    else if (collectible === 3) { this.sprite = 'images/GemGreen.png'; this. collectibleType = 'gem'; }
    else if (collectible === 4) { this.sprite = 'images/GemOrange.png'; this. collectibleType = 'gem'; }

    // Randomly assign the collectible position
    this.setPosition();

    // Update the collectible hitbox
    this.hitbox.x = this.x + hitboxX;
    this.hitbox.y = this.y + hitboxY;

    // Reset the collectible timer
    this.timer = 0;

};

// Randomly set the x and y parameters of the collectible item
Collectible.prototype.setPosition = function() {

    // Randomly assign a row and a column in which the collectible
    // will appear (limited to the stone blocks area)
    var row = Math.floor((Math.random() * 3) + 1);
    var column = Math.floor((Math.random() * 5));

    this.x = distanceX * column;
    this.y = distanceY * row;
};

// Draw the collectible on the screen
Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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

// Create a Scoreboard Class
var Scoreboard = function() {
    // Set a scoreboard variable in which all the game information will be
    // displayed. This variable should be an element (a 'div') from the DOM.
    this.scoreboard = '';
};

// Update the scoreboard with the current game timer, player health and score
Scoreboard.prototype.update = function(score, health, time) {
    this.scoreboard.innerHTML = '<h2>Scoreboard</h2>' + 
    '<div id="health">Lives: ' + health + '</div>' +
    '<div id="score">Score: ' + score + '</div>' +
    '<div id="timer">Time Left: ' + time + '</div>';

    if (health <= 0) {
        this.gameOver(score);
    }
};

// Display a "Game Over!" message in the scoreboard area
Scoreboard.prototype.gameOver = function(score) {
    this.scoreboard.innerHTML = '<h1>Game Over!</h1>' +
    '<h2> Your score:  ' + score + '</h2>';
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
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
