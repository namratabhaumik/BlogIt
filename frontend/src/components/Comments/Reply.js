import { useState } from "react";
import NewComment from "./NewComment";
import deleteIcon from "../images/icon-delete.svg";
import editIcon from "../images/icon-edit.svg";
import minusIcon from "../images/icon-minus.svg";
import plusIcon from "../images/icon-plus.svg";
import replyIcon from "../images/icon-reply.svg";

export default function Reply(props) {
  // State variables
  const [score, setScore] = useState(props.score); // Track the score of the reply
  const [disableUpvote, setDisableUpvote] = useState(false); // Manage upvote button state
  const [disableDownvote, setDisableDownvote] = useState(false); // Manage downvote button state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manage delete confirmation modal visibility
  let starterScore = props.score; // Initial score for comparison

  // Determine if the reply belongs to the current user
  const isCurrentUser = props.user.username === props.currentUser.username;

  // Determine if the reply is being replied to or edited
  const isReplying =
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "replying";
  const isEditing =
    props.activeComment &&
    props.activeComment.id === props.id &&
    props.activeComment.type === "editing";

  // Handler for score change (upvote/downvote)
  const handleScoreChange = (e) => {
    if (e.target.classList.contains("minus-btn")) {
      // Decrease score
      setScore((prevScore) => prevScore - 1);
      if (score - starterScore < 1) {
        setDisableDownvote(true);
        setDisableUpvote(false);
        starterScore = props.score;
      }
    }
    if (e.target.classList.contains("plus-btn")) {
      // Increase score
      setScore((prevScore) => prevScore + 1);
      if (starterScore - score < 1) {
        setDisableUpvote(true);
        setDisableDownvote(false);
        starterScore = props.score;
      }
    }
  };

  return (
    <div>
      <div className="comment">
        <div className="comment-heading">
          <img
            className="user-avatar"
            src={props.user.image.png}
            alt="user avatar"
          />
          <p className="username">{props.user.username}</p>
          {isCurrentUser && <p className="tag">you</p>}
          <p className="date">{props.createdAt}</p>
        </div>
        <div className="editing">
          {!isEditing && <p className="comment-content">{props.content}</p>}
          {isEditing && (
            <NewComment
              currentUser={props.currentUser}
              handleSubmit={(text) => {
                props.updateReply(text, props.id);
              }}
              initialText={props.content}
              isEdit
              buttonText="update"
            />
          )}
        </div>
        <div className="interact-comment">
          <div className="comment-votes">
            <button
              className={`plus-btn`}
              disabled={disableUpvote}
              onClick={handleScoreChange}
            >
              <img
                className={`plus-btn plus-icon`}
                src={plusIcon}
                alt="plus icon"
              />
            </button>
            <p className="comment-votes_total">{score}</p>
            <button
              disabled={disableDownvote}
              className={`minus-btn`}
              onClick={handleScoreChange}
            >
              <img
                className={`minus-btn minus-icon`}
                src={minusIcon}
                alt="minus icon"
              />
            </button>
          </div>
         
          <div className="comment-footer">
            {isCurrentUser ? (
              <div className="toggled-btns">
                <button
                  className="delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <img
                    className="delete-icon"
                    src={deleteIcon}
                    alt="delete icon"
                  />
                  Delete
                </button>
                <button
                  className="edit-btn"
                  onClick={() =>
                    props.setActiveComment({ id: props.id, type: "editing" })
                  }
                >
                  <img className="edit-icon" src={editIcon} alt="edit icon" />
                  Edit
                </button>
              </div>
            ) : (
              <button
                className="reply-btn"
                onClick={() =>
                  props.setActiveComment({ id: props.id, type: "replying" })
                }
              >
                <img className="reply-icon" src={replyIcon} alt="reply icon" />
                Reply
              </button>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <div>
          <NewComment
            currentUser={props.currentUser}
            placeholder={`Replying to @${props.user.username}`}
            handleSubmit={(text) =>
              props.addReply(`@${props.user.username}, ${text}`)
            }
            buttonText="reply"
          />
        </div>
      )}

      {showDeleteModal && (
        <div className="delete-modal-container">
          <div className="delete-modal">
            <h2 className="delete-modal_title">Delete comment</h2>
            <p className="delete-modal_content">
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="delete-modal_btns">
              <button
                className="delete-modal_btn no"
                onClick={() => setShowDeleteModal(false)}
              >
                No, cancel
              </button>
              <button
                className="delete-modal_btn yes"
                onClick={() => props.deleteReply(props.id)}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
