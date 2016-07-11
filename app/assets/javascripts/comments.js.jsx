var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString(), "bluh");
      }.bind(this)
    });
  },
  componentDidMount: function(){
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      type: 'POST',
      data: {comment: comment},
      success: function(data){
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString(), "bluh");
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        I am a comment box. I am cool and not dumb.
        <h1>Clammets</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={ this.handleCommentSubmit }/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author} key = {comment.id}>
          {comment.text}
        </Comment>
      )
    })

    return (
      <div className = "commentList">
        {commentNodes}
      </div>
    )
  }
});

var CommentForm = React.createClass({
  getInitialState: function(){
    return {author: '', text: ''}
  },
  handleAuthorChange: function(e){
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e){
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if(!text || !author){
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function(){
    return (
      <form className = "commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Ur name" value ={this.state.author} onChange={this.handleAuthorChange}/>
        <input type="text" placeholder="Say words" value={this.state.text} onChange={this.handleTextChange}/>
        <input type="submit" value = "post" />
      </form>
    )
  }
});

var Comment = React.createClass({
  // rawMarkup: function(){
  //   var md = new Remarkable();
  //   var rawMarkup = md.render(this.props.children.toString());
  //   return {__html: rawMarkup};
  // },

  render: function(){
    //var md = new Remarkable();
    return(
      <div className = "comment">
        <h2 className = "commentAuthor">{this.props.author}</h2>
        {this.props.children}
      </div>
    )
  }
});

$(function(){
  var $content = $("#content");
  if($content.length > 0){
    ReactDOM.render(
      <CommentBox url = '/comments.json' pollInterval = {2000} />, document.getElementById('content')
    );
  }
})