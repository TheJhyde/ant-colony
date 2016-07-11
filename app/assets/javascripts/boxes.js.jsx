//var colors = ["white", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "maroon", "black"];
var colors = ["white", "red", "black"]

//If the size gets too big, the program seriously starts to chug
//There may be a better way to handle the state though so it's faster
var size = 20;

var playerX = Math.floor(Math.random() * size);
var playerY = Math.floor(Math.random() * size);
// var playerX = 10;
// var playerY = 10;
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
        //var grid = this.state.data;
        this.setState(function(){
          var updatedRows = {};
          var state = this.state
          data.forEach(function(box){
            if(!updatedRows[box.x]){
              updatedRows[box.x] = state[box.x]
            }
            updatedRows[box.x][box.y] = box.color
          });
          return updatedRows;
        });
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString(), "bluh");
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.loadGridFromServer();
    setInterval(this.loadGridFromServer, 2000);

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
        this.updateGrid(playerY, playerX, playerColor);
        break;
      case "a":
        playerX--;
        if(playerX < 0){
          playerX = size - 1;
        }
        this.updateGrid(playerY, playerX, playerColor);
        break;
      case "w":
        playerY--;
        if(playerY < 0){
          playerY = size - 1;
        }
        this.updateGrid(playerY, playerX, playerColor);
        break;
      case "s":
        playerY = (playerY + 1)%size;
        this.updateGrid(playerY, playerX, playerColor);
        break;
      case "l":
        this.updateGrid(10, 10, 1);
        break;
      default:
        break;
    }
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
      error: function(xhr, status, err){
        //rid[x][y] = oldColor;
        //this.setState({data: grid});
        var revertValue = {}
        revertValue[x] = this.state[x]
        revertValue[x][y] = oldColor
        this.setState(revertValue);

        console.error(this.props.url, status, err.toString(), "bluh");
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
    //My sloppy approach to xs and ys and rows and columns bites me in the ass here
    if(this.props.column == playerX && this.props.row == playerY){
      divStyle["borderColor"] = "grey"
    }
    return(
      <div className = "box" style={divStyle} /*onClick={this.handleClick}*/></div>
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