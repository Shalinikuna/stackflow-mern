import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import QuestionDetail from './pages/QuestionDetail';
import AskQuestion from './pages/AskQuestion';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/questions/:id" element={<QuestionDetail />} />
            <Route path="/ask" element={<AskQuestion />} />
          </Routes>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="dark"
          toastStyle={{
            background: '#1a1a2e',
            border: '1px solid #2a2a45',
            color: '#e8e8f0',
            fontFamily: "'Syne', sans-serif",
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
