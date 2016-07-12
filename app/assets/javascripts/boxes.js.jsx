//var colors = ["white", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "maroon", "black"];
var colors = ["white", "red", "black"]

//If the size gets too big, the program seriously starts to chug
//There may be a better way to handle the state though so it's faster
var size = 20;

var playerX = Math.floor(Math.random() * size);
var playerY = Math.floor(Math.random() * size);
var playerColor = Math.floor(Math.random() * (colors.length-1) + 1);

var Grid = React.createClass({
  getInitialState: function(){
    //create a big empty grid
    var row = []
    for(var j = 0; j < size; j++){
      row.push(0);
    }

    var grid = {}
    for(var i = 0; i < size; i++){
      //gotta put in this slice otherwise all the rows will be the same row.
      //Due to witchcraft
      grid[i] = row.slice(0);
    }
    return grid;
  },
  loadGridFromServer: function() {
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      cache: false,
      success: function(data) {
        var grid = {}
        for(var i = 0; i < size; i++){
          var row = []
          for(var j = 0; j < size; j++){
            var box = data.find(function(box){
              return box["x"] == i && box["y"] == j
            });
            if(box != undefined){
              row.push(box["color"])
            }else{
              row.push(0)
            }
          }
          grid[i] = row
        }
        this.setState(grid);
        //This old version of set stand could only add boxes, not remove them
        // this.setState(function(){
        //   var updatedRows = {};
        //   var state = this.state
        //   data.forEach(function(box){
        //     if(!updatedRows[box.x]){
        //       updatedRows[box.x] = state[box.x]
        //     }
        //     updatedRows[box.x][box.y] = box.color
        //   });
        //   return updatedRows;
        // });
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString(), "loadGrid error");
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.loadGridFromServer();
    setInterval(this.loadGridFromServer, 1000);

    $(document).keydown(this.keyDown)
  },
  // handleBoxClick: function(box){
  //   var newColor = (box.color + 1) % colors.length
  //   this.updateGrid(box.x, box.y, newColor)
  // },
  keyDown: function(e){
    switch(e.key){
      case "d":
        playerX = (playerX + 1) % size;
        this.updateGrid(playerY, playerX, this.nextColor(playerX, playerY));
        break;
      case "a":
        playerX--;
        if(playerX < 0){
          playerX = size - 1;
        }
        this.updateGrid(playerY, playerX, this.nextColor(playerX, playerY));
        break;
      case "w":
        playerY--;
        if(playerY < 0){
          playerY = size - 1;
        }
        this.updateGrid(playerY, playerX, this.nextColor(playerX, playerY));
        break;
      case "s":
        playerY = (playerY + 1)%size;
        this.updateGrid(playerY, playerX, this.nextColor(playerX, playerY));
        break;
      case "l":
        this.updateGrid(10, 10, 1);
        break;
      default:
        break;
    }
  },
  nextColor: function(x, y){
    var color = this.state[y][x]
    //console.log("This square is " + color)
    var nextColor = (color + 1) % colors.length
    //console.log("Next color is  " + nextColor)
    return nextColor
  },
  updateGrid: function(x, y, newColor){
    //console.log("Updating the grid with a new", colors[newColor], "box");
    var oldColor = this.state[x][y]

    var updateValue = {}
    updateValue[x] = this.state[x]
    updateValue[x][y] = newColor
    this.setState(updateValue);

    var newBox = {x: x, y: y, color: newColor}

    $.ajax({
      url: '/boxes.json',
      datatype: 'json',
      type: 'POST',
      data: {box: newBox},
      success: function(){
        var updateValue = {}
        updateValue[x] = this.state[x]
        updateValue[x][y] = newColor
        this.setState(updateValue);
      }.bind(this),
      error: function(xhr, status, err){
        var revertValue = {}
        revertValue[x] = this.state[x]
        revertValue[x][y] = oldColor
        this.setState(revertValue);

        console.error(this.props.url, status, err.toString(), "updateGrid error");
      }.bind(this)
    });
  },
  render: function() {
    //var boxClickFunction = this.handleBoxClick
    var rowNodes = []
    for(var key in this.state){
      rowNodes.push(<Row data={this.state[key]} key={key} row={key} /*onBoxClick={boxClickFunction}*//>)
    }
    return (
      <div className="grid">
        {rowNodes}
      </div>
    );
  }
});

var Row = React.createClass({
  render: function(){
    var row = this.props.row
    //var clickFunction = this.props.onBoxClick
    var boxes = this.props.data.map(function(box, index){
      return(
        <Box key = {index} color={box} column={index} row={row} /*onBoxClick={clickFunction}*//>
      );
    });
    return(
      <div className = "row">
        {boxes}
      </div>
    );
  }
});

var Box = React.createClass({
  // handleClick: function(){
  //   this.props.onBoxClick({x: this.props.row, y: this.props.column, color: this.props.color});
  // },
  render: function(){
    //console.log("Drawing a ", colors[this.props.color], " box");
    var divStyle = {
      background: colors[this.props.color]
    };
    var boxClass = "box"
    //My sloppy approach to xs and ys and rows and columns bites me in the ass here
    if(this.props.column == playerX && this.props.row == playerY){
      //divStyle["borderColor"] = "grey"
      boxClass += " selected_box"
    }
    return(
      <div className = {boxClass} style={divStyle} /*onClick={this.handleClick}*/></div>
    );
  }
});

$(function(){
  var $content = $("#grid");
  if($content.length > 0){
    ReactDOM.render(
      <Grid url='/boxes.json'/>, document.getElementById('grid')
    );
  }
});