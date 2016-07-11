var size = 20;

var botX = Math.floor(Math.random() * size);
var botY = Math.floor(Math.random() * size);
//var botColor = Math.floor(Math.random() * 13 + 1);
var botColor = 1;
var botState = 0;
var interval;
var times = 0;

function knightBot(){
  if(botState < 2){
    botX = (botX + 1) % size;
    botState++;
  }else{
    botY = (botY + 1) % size;
    botState = 0;
  }

  postBox(botX, botY, botColor);

  times++;
  if(times > 20){
    console.log("Time to stop botting");
    window.clearInterval(interval);
  }
}

function postBox(x, y, color){
  var newBox = {x: x, y: y, color: color}

  $.ajax({
    url: '/boxes.json',
    datatype: 'json',
    type: 'POST',
    data: {box: newBox},
    error: function(xhr, status, err){
      console.error(this.props.url, status, err.toString(), "bluh");
    }.bind(this)
  });

}

//Antbot just gets stuck after a few seconds, so it's not very interesting
function antBot(){
  var antX = 10;
  var antY = 10;
  var grid;
  //this should update from time to time, but that's not necessary at this moment.
  $.ajax({
    url: '/boxes.json',
    datatype: 'json',
    cache: false,
    success: function(data) {
      grid = data;
    }
  });
  //Keep on moving ant bot.
  var antInterval = setInterval(function(){
    var currentBox = grid.find(function(box){
      return box.x == antX && box.y == antY
    });
    console.log(currentBox);
    //Since the players can only write, not delete, this isn't really a langton's ant
    //Just sort of Langton inspired
    if(currentBox == undefined || currentBox.color == 0){
      antX = (antX + 1) % size
    }else if(currentBox.color == 1){
      antY = (antY + 1) % size
    }else if(currentBox.color == 2){
      // antY--;
      // if(antY < 0){
      //   antY = size - 1;
      // }
      antX--;
      if(antX < 0){
        antX = size - 1;
      }
    }
    postBox(antX, antY, botColor);
  }, 600);
}

$(function(){
  var $content = $("#grid");
  if($content.length > 0){
    console.log("Time to bot!")
    //interval = setInterval(knightBot, 600);
    //antBot();
  }
});