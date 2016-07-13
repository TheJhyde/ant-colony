var colors = ["white", "red", "black"]

var size = 20; //How big the grid is on each size

var playerX = Math.floor(Math.random() * size);
var playerY = Math.floor(Math.random() * size);

var Grid = React.createClass({
  getInitialState: function(){
    //create a big empty grid
    var row = []
    for(var j = 0; j < size; j++){
      row.push(0);
    }

    var grid = {}
    for(var i = 0; i < size; i++){
      //gotta put in this slice otherwise all the rows will be the same object, change and update as one
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
            //Looks through the data to see if there's a box at this location
            var box = data.find(function(box){
              return box["x"] == i && box["y"] == j
            });
            if(box != undefined){
              //If there is a box, put that color into state
              row.push(box["color"])
            }else{
              //If not, it's a white box, put that into state
              row.push(0)
            }
          }
          grid[i] = row
        }
        this.setState(grid);
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString(), "loadGrid error");
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.loadGridFromServer();
    //Update the grid every second
    setInterval(this.loadGridFromServer, 1000);
    //event listener for key presses
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
    var nextColor = (color + 1) % colors.length
    return nextColor
  },
  updateGrid: function(x, y, newColor){
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
        //Update the state a second time, in case a server update switched it back.
        var updateValue = {}
        updateValue[x] = this.state[x]
        updateValue[x][y] = newColor
        this.setState(updateValue);
      }.bind(this),
      error: function(xhr, status, err){
        //Switches the state change back since the creation failed
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
    var divStyle = {
      background: colors[this.props.color]
    };
    var boxClass = "box"
    if(this.props.column == playerX && this.props.row == playerY){
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