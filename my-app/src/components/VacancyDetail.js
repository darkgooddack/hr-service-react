// src/components/VacancyDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';

const VacancyDetail = () => {
    const { id } = useParams();  // Получаем id из URL
    const [vacancy, setVacancy] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/vacancy/get/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setVacancy(data);
                } else {
                    setError('Не удалось загрузить вакансию');
                }
            } catch (error) {
                setError('Ошибка подключения к серверу');
            }
        };
        fetchVacancy();
    }, [id]);

    const handleEdit = () => {
        navigate(`/vacancy/edit/${id}`);  // Используем navigate вместо history.push
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить вакансию?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/vacancy/delete/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    navigate('/vacancies');
                } else {
                    setError('Ошибка при удалении вакансии');
                }
            } catch (error) {
                setError('Ошибка при удалении вакансии');
            }
        }
    };

    return (
        <div>
            <h2>Детали вакансии</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {vacancy ? (
                <div>
                    <h3>{vacancy.title}</h3>
                    <p>{vacancy.company_name}</p>
                    <p>{vacancy.description}</p>
                    <p>Статус: {vacancy.status}</p>
                    <p>Адрес компании: {vacancy.company_address}</p>
                    <button onClick={handleEdit}>Редактировать</button>
                    <button onClick={handleDelete}>Удалить</button>
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );
};

export default VacancyDetail;
