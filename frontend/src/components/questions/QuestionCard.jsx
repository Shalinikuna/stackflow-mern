import React from 'react';
import { Link } from 'react-router-dom';
import './QuestionCard.css';

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

const QuestionCard = ({ question }) => {
  const { _id, title, body, tags, author, views, answerCount, acceptedAnswer, createdAt } = question;

  return (
    <div className="question-card">
      <div className="question-stats">
        <div className={`stat ${answerCount > 0 ? 'has-answers' : ''} ${acceptedAnswer ? 'accepted' : ''}`}>
          <span className="stat-number">{answerCount}</span>
          <span className="stat-label">{answerCount === 1 ? 'answer' : 'answers'}</span>
        </div>
        <div className="stat">
          <span className="stat-number">{views}</span>
          <span className="stat-label">views</span>
        </div>
      </div>

      <div className="question-content">
        <Link to={`/questions/${_id}`} className="question-title">
          {title}
        </Link>
        <p className="question-excerpt">
          {body.length > 160 ? body.slice(0, 160) + '…' : body}
        </p>
        <div className="question-footer">
          <div className="question-tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <div className="question-meta">
            <img src={author?.avatar} alt={author?.username} className="meta-avatar" />
            <Link to="#" className="meta-author">{author?.username}</Link>
            <span className="meta-rep">{author?.reputation}</span>
            <span className="meta-time">{timeAgo(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
