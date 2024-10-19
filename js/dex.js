var game_score = 0;
var game_score_best = 0;
var GAME_TIMER_START = 30;
var game_timer = 0;
var game_highscores = false;
var game_over = false;
var gameCountdownTimer;
var gameSpecialTimer = 0;
var game_scores = [
  {
    name: "Md Akij Islam",
    score: 131
  },
  {
    name: "Github/xdotdex",
    score: 999999999999
  },
  {
    name: "DEメTER",
    score: 0
  },
  {
    name: "Don't trust anyone",
    score: 0
  },
  {
    name: "Bhosdi ke Apna gand mara🤣",
    score: 0
  },
  {
    name: "Could be you",
    score: 0
  },
  {
    name: "Could be you",
    score: 0
  },
  {
    name: "Could be you",
    score: 0
  },
  {
    name: "Could be you",
    score: 0
  },
  {
    name: "Could be you",
    score: 0
  }
];
game_scores.sort(function(a, b) {
  return b.score - a.score; 
});

// get random number between min and max value
function rand(min, max) {
  return Math.floor(Math.random() * (max + 1)) + min;
}

//add explosions when you click on a particle
function explode(x, y, bitcolor) {
  var particles = 15,
      // explosion container and its reference to be able to delete it on animation end
      explosion = $('<div class="explosion"></div>');

  //put the explosion container into the game page
  $('#game').append(explosion);

  //position the container to be centered
  explosion.css('left', x - explosion.width() / 2);
  explosion.css('top', y - explosion.height() / 2);

  for (var i = 0; i < particles; i++) {
    //random end positions for each of the particles
    var x = (explosion.width() / 2) + rand(80, 150) * Math.cos(2 * Math.PI * i / rand(particles - 10, particles + 10));
    var y = (explosion.height() / 2) + rand(80, 150) * Math.sin(2 * Math.PI * i / rand(particles - 10, particles + 10));

    //create the particle elements
    elm = $('<div class="bit bit-' + bitcolor + '" style="' +
            'top: ' + y + 'px; ' +
            'left: ' + x + 'px"></div>');

    // no need to add the listener on all generated elements
    if (i == 0) { 
      //when animation ends then it will automatically remove the element
      elm.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
        explosion.remove();
      });
    }
    //add the particle
    explosion.append(elm);
  }
}

//event triggered when the user clicks on a particle
var particleClick = function(e) {
  let particleWidth = this.offsetWidth;

  //if particle reached full width
  if(particleWidth === 150) {
    //add appropriate score/time based on type of particle
    switch($(this).data("type")) {
      case "time":
        game_score++;
        game_timer+=5;
        break;
      case "points":
        game_score+=5;
        game_timer++;
        break;
      default:
        game_score++;
        game_timer++;
    }

    //add the score to the screen
    $(".game-score").text(game_score);

    //get the color of the particle
    var arr = $(this).attr("class").split('-');
    var item = arr[arr.length-1];

    //remove the particle
    this.remove();

    //add explosions
    explode(e.pageX, e.pageY, item);

    //create a new particle in place if the existing one
    createParticle();
  }
}

//creates each particle
var createParticle = function() {
  //initiate and set properties on particle
  let particle = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + 20,
    size: Math.random() * 25 + 10,
    speed: Math.random() * 6 + 3,
    delay: Math.random() * 0.3 + 0.2,
    color: Math.random() < 0.33 ? "red" : Math.random() < 0.5 ? "green" : "blue",
    data: "normal"
  };

  //increase the special timer so that we get a
  //special particle at least every 5 particles
  gameSpecialTimer = (gameSpecialTimer + 1) % 5;

  //if special particle the set properties here
  if(Math.random() < 0.1 || gameSpecialTimer === 0) {
    particle.color = "gold";
    particle.data = Math.random() < 0.3 ? "time" : "points";
  }

  //append the particle to the particle box
  $("#particle-box").append("<div class='particle particle-" + 
                            particle.color + "' data-type='" + particle.data + "'></div>");

  //get the particle that was just added
  var last = $("#particle-box").children().last();

  //setup the click event for the particle
  last.on( "click", particleClick );

  //add appropriate css properties including css animation
  last.css(
    "animation", 
    "move " + particle.speed + "s infinite linear " + particle.delay + "s");
  last.css(
    "left", 
    particle.x);
  last.css(
    "top", 
    particle.y);
  last.css(
    "width", 
    particle.size);
  last.css(
    "height", 
    particle.size);
}

//setup the initial particles for each game
var setupParticles = function() {
  //remove any existing particles
  $("#particle-box").empty();

  //create an initial set of 40 particles
  for(var i = 0; i < 40; i++) {
    createParticle();
  }
}

//reset the game
var resetGame = function() {
  //reset game timer    
  game_timer = 0;

  //set game over to true
  game_over = true;

  //reset special timer
  gameSpecialTimer = 0;

  //clear the existing interval if it exists
  clearInterval(gameCountdownTimer);

  //remove any existing explosions
  $(".explosion").empty();

  //remove all particles
  $("#particle-box").empty();

  //show/hide appropriate components
  $("#gameStartButton").show();
  $("#gameComponents").hide();
  $("#gameOver").hide();
}

//starts the game
var startGame = function() {
  //reset score
  game_score = 0;

  //set game over to false
  game_over = false;

  //reset game score
  $(".game-score").text(game_score);

  //reset timer
  game_timer = GAME_TIMER_START;

  //hide/show components
  $("#gameStartButton").hide();
  $("#gameOver").hide();
  $("#gameComponents").show();

  //setup particles
  setupParticles();

  //display initial timer
  $("#gameTimer").text(game_timer + " seconds remaining");

  //setup interval to control the timing of the game
  gameCountdownTimer = setInterval(function(){
    //if game over...
    if(game_timer <= 0){
      //clear the interval (remove it)
      clearInterval(gameCountdownTimer);

      if(!game_over) {
        //set best score to be the max score
        game_score_best = Math.max(game_score_best, game_score);

        //display the scores
        $("#gameScore").text("Score: " + game_score);
        $("#gameScoreBest").text("Best Score: " + game_score_best);

        //display the game over box
        $("#gameOver").show();

        //remove the particles
        $("#particle-box").empty();

        //hide the start button and game components
        $("#gameStartButton").hide();
        $("#gameComponents").hide();
      }
    }
    //else if game still in progress
    else {
      $("#gameTimer").text(game_timer + " seconds remaining");
    }
    //decrease the timer by 1 each second
    game_timer -= 1;
  },
                                   1000); //interval set to 1 second
}

setupScores = function() {
  var scoresTable = '<table cellspacing="0" class="table-scores">' +
      '<thead>' +
      '<tr>' +
      '<th class="scores-header-name">Name</th>' +
      '<th class="scores-header-score">Score</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';

  for(var i = 0; i < game_scores.length; i++) {
    let score = game_scores[i];

    scoresTable += '<tr>' +
      '<td class="scores-name">' + score.name + '</td>' +
      '<td class="scores-score">' + score.score + '</td>' +
      '</tr>';
  }

  scoresTable += '</tbody></table>';

  $("#scoresTable").empty();
  $("#scoresTable").append(scoresTable);
}

$(".page").css({display: "none"});
$("#home").css({display: "block"});
var switchPage = function (page){
  $(".page").css({display: "none"});
  $(page).css({display: "block",});

  $(".page").removeClass('showPage');
  $(page).addClass('showPage');

  $('button').removeClass('active');
  $(page+"Button").addClass('active');

  //reset game
  if(page === "#game") {
    resetGame();
  }
  //build highscores (only once)
  else if(page === "#scores" && !game_highscores) {
    setupScores();
  }
};
//switch to the home page when first get to the site
switchPage("#home");
