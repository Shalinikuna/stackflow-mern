import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import QuestionCard from '../components/questions/QuestionCard';
import './Home.css';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';

  const [searchInput, setSearchInput] = useState(search);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (tag) params.tag = tag;
      const res = await api.get('/questions', { params });
      setQuestions(res.data?.questions || []);
setTotal(res.data?.total || 0);
setPages(res.data?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, tag]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = { page: '1' };
    if (searchInput.trim()) next.search = searchInput.trim();
    if (tag) next.tag = tag;
    setSearchParams(next);
  };

  const handleTagClick = (t) => {
    setSearchParams({ page: '1', tag: t });
    setSearchInput('');
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({ page: '1' });
  };

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero */}
        <div className="home-hero">
          <div className="hero-text">
            <h1>
              Every great answer
              <br />
              <span className="hero-accent">starts with a question.</span>
            </h1>
            <p>A community where developers ask, learn, and share.</p>
          </div>
          <Link to="/ask" className="btn btn-primary hero-ask-btn">
            Ask a Question
          </Link>
        </div>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Active filters */}
        {(search || tag) && (
          <div className="active-filters">
            <span className="filter-label">Filtering by:</span>
            {search && <span className="filter-chip">"{search}"</span>}
            {tag && <span className="filter-chip tag">{tag}</span>}
            <button className="clear-filters" onClick={clearFilters}>✕ Clear</button>
          </div>
        )}

        {/* Header */}
        <div className="questions-header">
          <h2>{total} {total === 1 ? 'Question' : 'Questions'}</h2>
        </div>

        {/* List */}
        <div className="questions-list card">
          {loading ? (
            <div className="spinner" />
          ) : questions?.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <h3>No questions found</h3>
              <p>Be the first to ask!</p>
            </div>
          ) : (
            questions.map((q) => (
              <QuestionCard key={q._id} question={q} onTagClick={handleTagClick} />
            ))
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${p === page ? 'active' : ''}`}
                onClick={() => {
                  const next = { page: String(p) };
                  if (search) next.search = search;
                  if (tag) next.tag = tag;
                  setSearchParams(next);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
