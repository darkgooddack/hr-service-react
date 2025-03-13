import React, { useState } from 'react';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8000/api/v1/auth/token', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access_token', data.access_token);
                setError('');
                onLoginSuccess();  // Уведомление об успешной авторизации
            } else {
                setError(data.detail || 'Ошибка авторизации');
            }
        } catch (error) {
            setError('Не удалось подключиться к серверу');
        }
    };

    return (
        <div>
            <h2>Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Логин:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginForm;
