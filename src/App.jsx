import React, { useState } from 'react';
import './App.css';

function App() {
  const CommentBox = () => {
    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState([]);

    const handleInputChange = (e) => {
      setComment(e.target.value);
    };

    const handleSubmit = (e, parentId = null) => {
      e.preventDefault();
      if (comment.trim() !== '') {
        const newComment = {
          id: Date.now(),
          text: comment,
          likes: 0,
          replies: [],
        };

        setCommentList((prevComments) => {
          if (parentId === null) {
            return [...prevComments, newComment];
          } else {
            return addReplyToComment(prevComments, parentId, newComment);
          }
        });

        setComment('');
      }
    };

    const addReplyToComment = (comments, parentId, newReply) => {
      return comments.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, newReply] }
          : { ...c, replies: addReplyToComment(c.replies, parentId, newReply) }
      );
    };

    const handleLike = (commentId) => {
      setCommentList((prevComments) =>
        updateLikes(prevComments, commentId)
      );
    };

    const updateLikes = (comments, commentId) => {
      return comments.map((c) =>
        c.id === commentId
          ? { ...c, likes: c.likes + 1 }
          : { ...c, replies: updateLikes(c.replies, commentId) }
      );
    };

    const renderComments = (comments) => {
      return (
        <ul>
          {comments.map((c) => (
            <li key={c.id}>
              {c.text}
              <button onClick={() => handleLike(c.id)}>
                Like ({c.likes})
              </button>
              {c.replies.length > 0 && renderComments(c.replies)}
              <form onSubmit={(e) => handleSubmit(e, c.id)}>
                <textarea
                  placeholder="Reply to this comment"
                  value={comment}
                  onChange={handleInputChange}
                />
                <button type="submit">Reply</button>
              </form>
            </li>
          ))}
        </ul>
      );
    };

    return (
      <div>
        <h2>Comment Box</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <textarea
            placeholder="Write your comment here"
            value={comment}
            onChange={handleInputChange}
          />
          <button type="submit">Add Comment</button>
        </form>
        <div>
          <h3>Comments:</h3>
          {commentList.length > 0 ? (
            renderComments(commentList)
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    );
  };

  return <CommentBox />;
}

export default App;


