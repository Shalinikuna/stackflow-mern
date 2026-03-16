import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './AnswerItem.css';

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const AnswerItem = ({ answer: initialAnswer, questionAuthorId, onDelete }) => {
  const { user } = useAuth();
  const [answer, setAnswer] = useState(initialAnswer);
  const [voting, setVoting] = useState(false);

  const userId = user?._id;
  const hasUpvoted = answer.upvotes?.some((id) => id === userId || id?._id === userId);
  const hasDownvoted = answer.downvotes?.some((id) => id === userId || id?._id === userId);
  const voteScore = (answer.upvotes?.length || 0) - (answer.downvotes?.length || 0);

  const handleVote = async (type) => {
    if (!user) return toast.error('Sign in to vote');
    if (voting) return;
    setVoting(true);
    try {
      const res = await api.post(`/answers/${answer._id}/vote`, { type });
      setAnswer(res.data.answer);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Vote failed');
    } finally {
      setVoting(false);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await api.post(`/answers/${answer._id}/accept`);
      setAnswer(res.data.answer);
      toast.success(res.data.answer.isAccepted ? 'Answer accepted ✓' : 'Acceptance removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this answer?')) return;
    try {
      await api.delete(`/answers/${answer._id}`);
      toast.success('Answer deleted');
      onDelete(answer._id);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className={`answer-item ${answer.isAccepted ? 'answer-accepted' : ''}`}>
      {answer.isAccepted && (
        <div className="accepted-badge">
          <span>✓ Accepted Answer</span>
        </div>
      )}

      <div className="answer-layout">
        {/* Vote column */}
        <div className="vote-col">
          <button
            className={`vote-btn up ${hasUpvoted ? 'active' : ''}`}
            onClick={() => handleVote('up')}
            disabled={voting}
            title="Upvote"
          >
            ▲
          </button>
          <span className={`vote-score ${voteScore > 0 ? 'pos' : voteScore < 0 ? 'neg' : ''}`}>
            {voteScore}
          </span>
          <button
            className={`vote-btn down ${hasDownvoted ? 'active' : ''}`}
            onClick={() => handleVote('down')}
            disabled={voting}
            title="Downvote"
          >
            ▼
          </button>

          {/* Accept button — only question author can accept */}
          {user && questionAuthorId === userId && (
            <button
              className={`accept-btn ${answer.isAccepted ? 'accepted' : ''}`}
              onClick={handleAccept}
              title={answer.isAccepted ? 'Remove acceptance' : 'Accept this answer'}
            >
              ✓
            </button>
          )}
        </div>

        {/* Body */}
        <div className="answer-body-col">
          <div className="answer-body">{answer.body}</div>

          <div className="answer-footer">
            <div className="answer-meta">
              <img src={answer.author?.avatar} alt={answer.author?.username} className="meta-avatar" />
              <span className="meta-author">{answer.author?.username}</span>
              <span className="meta-rep">{answer.author?.reputation} rep</span>
              <span className="meta-time">{timeAgo(answer.createdAt)}</span>
            </div>

            {user && answer.author?._id === userId && (
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
