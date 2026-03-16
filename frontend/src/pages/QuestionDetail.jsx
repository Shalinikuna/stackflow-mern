import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import AnswerItem from '../components/answers/AnswerItem';
import { toast } from 'react-toastify';
import './QuestionDetail.css';

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

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, aRes] = await Promise.all([
          api.get(`/questions/${id}`),
          api.get(`/answers/question/${id}`),
        ]);
        setQuestion(qRes.data.question);
        setAnswers(aRes.data.answers);
      } catch (err) {
        toast.error('Question not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to answer');
    if (answerBody.trim().length < 10) return toast.error('Answer must be at least 10 characters');

    setSubmitting(true);
    try {
      const res = await api.post(`/answers/${id}`, { body: answerBody.trim() });
      setAnswers([...answers, res.data.answer]);
      setQuestion((q) => ({ ...q, answerCount: q.answerCount + 1 }));
      setAnswerBody('');
      toast.success('Answer posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      toast.success('Question deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteAnswer = (answerId) => {
    setAnswers((prev) => prev.filter((a) => a._id !== answerId));
    setQuestion((q) => ({ ...q, answerCount: Math.max(0, q.answerCount - 1) }));
  };

  if (loading) return <div className="container"><div className="spinner" /></div>;
  if (!question) return null;

  const isAuthor = user?._id === question.author?._id;

  return (
    <div className="question-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <Link to="/" className="breadcrumb">← All Questions</Link>

        {/* Question */}
        <div className="detail-card card">
          <div className="detail-header">
            <h1 className="detail-title">{question.title}</h1>
            <div className="detail-meta">
              <span>Asked {timeAgo(question.createdAt)}</span>
              <span>{question.views} views</span>
              <span>{question.answerCount} answers</span>
            </div>
          </div>

          <div className="detail-body">{question.body}</div>

          <div className="detail-footer">
            <div className="detail-tags">
              {question.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="detail-author">
              <img src={question.author?.avatar} alt={question.author?.username} className="author-avatar" />
              <div>
                <div className="author-name">{question.author?.username}</div>
                <div className="author-rep">{question.author?.reputation} reputation</div>
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="detail-actions">
              <button className="btn btn-danger btn-sm" onClick={handleDeleteQuestion}>
                Delete Question
              </button>
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="answers-section">
          <h2 className="answers-heading">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {answers.length === 0 ? (
            <div className="empty-state">
              <h3>No answers yet</h3>
              <p>Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="answers-list card">
              {answers.map((answer) => (
                <AnswerItem
                  key={answer._id}
                  answer={answer}
                  questionAuthorId={question.author?._id}
                  onDelete={handleDeleteAnswer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Answer */}
        <div className="post-answer-section">
          <h2 className="post-answer-heading">Your Answer</h2>
          {user ? (
            <form onSubmit={handleSubmitAnswer} className="card">
              <div className="form-group">
                <label htmlFor="answer-body">Write your answer</label>
                <textarea
                  id="answer-body"
                  value={answerBody}
                  onChange={(e) => setAnswerBody(e.target.value)}
                  placeholder="Share your knowledge and expertise..."
                  rows={8}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          ) : (
            <div className="sign-in-prompt card">
              <p>
                <Link to="/login">Sign in</Link> or <Link to="/register">create an account</Link> to post an answer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
