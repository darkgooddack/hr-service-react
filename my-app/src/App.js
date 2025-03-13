import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import JobCreateForm from './components/JobCreateForm';
import VacancyDetail from './components/VacancyDetail';
import JobEditForm from './components/JobEditForm';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const token = localStorage.getItem('access_token');

    return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route path="/create" element={<ProtectedRoute component={JobCreateForm} />} />
                <Route path="/vacancy/:id" element={<ProtectedRoute component={VacancyDetail} />} />
                <Route path="/edit/:id" element={<ProtectedRoute component={JobEditForm} />} />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
