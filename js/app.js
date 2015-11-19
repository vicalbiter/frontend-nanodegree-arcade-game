// Declare useful global variables to control both player and enemy movement
var distanceX = 101,
    distanceY = 83,
    homeX = 202,
    homeY = 405,
    enemyHomeX = -100,
    boardWidth = 505,
    boardHeigh = 606,
    hitboxX = 50.5,
    hitboxY = 41.5;


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
        radius : 40,
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

    var dx = this.hitbox.x - playerHitbox.x;
    var dy = this.hitbox.y - playerHitbox.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.hitbox.radius + playerHitbox.radius) {
        console.log("Collision detected!");
    }

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // Assign the image for the player
    this.sprite = 'images/char-boy.png';

    // Assign the home position for the player
    this.x = homeX;
    this.y = homeY;

    // Create a circular hitbox to check for collisions with other game entities
    this.hitbox = {
        radius : 40,
        x: this.x + hitboxX,
        y: this.y + hitboxY
    };
};

// Update the player's position
Player.prototype.update = function(dt) {

    // Update the hitbox
    this.hitbox.x = this.x + hitboxX;
    this.hitbox.y = this.y + hitboxY;
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

// Place the player object in a variable called player
var player = new Player();

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
