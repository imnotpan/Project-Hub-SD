import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './routes/login';
import About from './routes/about';
import SearchProject from './routes/SearchProject';
import Register from './routes/register';
import HomePage from './routes/HomePage';
import PageNotFound from './routes/PageNotFound'; // Importa tu componente de página no encontrada
import ProjectsPage from './routes/ProjectsPage';
import TeamsPage from './routes/TeamsPage';
import Profile from './routes/Profile';
import { userAuthStore } from './routes/authStore';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const login = userAuthStore.getState().state;

  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <SearchProject /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/search-project"
          element={isLoggedIn ? <SearchProject /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isLoggedIn ? <ProjectsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/teams"
          element={isLoggedIn ? <TeamsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default App;
