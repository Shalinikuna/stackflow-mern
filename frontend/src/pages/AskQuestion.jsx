import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AskQuestion.css';

const AskQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', tags: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.trim().length < 10) return setError('Title must be at least 10 characters');
    if (form.body.trim().length < 20) return setError('Body must be at least 20 characters');

    const tags = form.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5);

    setLoading(true);
    try {
      const res = await api.post('/questions', {
        title: form.title.trim(),
        body: form.body.trim(),
        tags,
      });
      toast.success('Question posted!');
      navigate(`/questions/${res.data.question._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-page">
      <div className="container">
        <div className="ask-header">
          <h1>Ask a Question</h1>
          <p>Be specific and clear — a well-asked question gets better answers faster.</p>
        </div>

        <div className="ask-layout">
          <form onSubmit={handleSubmit} className="ask-form card">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. How do I reverse a string in Python?"
                required
                autoFocus
              />
              <span className="field-hint">Summarize your problem clearly in one sentence.</span>
            </div>

            <div className="form-group">
              <label htmlFor="body">Body</label>
              <textarea
                id="body"
                name="body"
                value={form.body}
                onChange={handleChange}
                placeholder="Describe your problem in detail. Include what you've tried and what error you're seeing..."
                rows={12}
                required
              />
              <span className="field-hint">
                Include all the relevant details. The more context, the better the answer.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. javascript, react, node.js"
              />
              <span className="field-hint">Up to 5 tags, separated by commas.</span>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <div className="ask-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Posting...' : 'Post Question'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>

          {/* Tips sidebar */}
          <aside className="ask-tips card">
            <h3>Tips for a great question</h3>
            <ul className="tips-list">
              <li>
                <span className="tip-icon">✦</span>
                Search to see if your question has already been answered.
              </li>
              <li>
                <span className="tip-icon">✦</span>
                Be specific about what you're trying to do.
              </li>
              <li>
                <span className="tip-icon">✦</span>
                Include any relevant code, error messages, or screenshots.
              </li>
              <li>
                <span className="tip-icon">✦</span>
                Describe what you've already tried.
              </li>
              <li>
                <span className="tip-icon">✦</span>
                Use tags to help others find your question.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
