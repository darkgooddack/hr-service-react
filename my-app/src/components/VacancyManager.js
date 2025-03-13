// src/components/VacancyManager.js
import React, { useState, useEffect } from 'react';

const VacancyManager = () => {
    const [vacancies, setVacancies] = useState([]);
    const [newVacancy, setNewVacancy] = useState('');
    const [editingVacancy, setEditingVacancy] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem('access_token');  // Получаем токен из localStorage

    // Функция для создания вакансии
    const handleCreateVacancy = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/vacancy/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newVacancy }),
            });

            const data = await response.json();

            if (response.ok) {
                setVacancies([...vacancies, data]);
                setNewVacancy('');
            } else {
                console.error('Ошибка создания вакансии:', data);
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };

    // Функция для получения вакансии
    const handleGetVacancy = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/get/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
            } else {
                console.error('Ошибка получения вакансии:', data);
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };

    // Функция для редактирования вакансии
    const handleEditVacancy = (id) => {
        const vacancyToEdit = vacancies.find((vacancy) => vacancy.id === id);
        setEditingVacancy(vacancyToEdit);
        setIsEditing(true);
    };

    const handleUpdateVacancy = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/vacancy/update', {
                method: 'PUT',  // Или PATCH
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editingVacancy),
            });

            const data = await response.json();

            if (response.ok) {
                setVacancies(
                    vacancies.map((vacancy) =>
                        vacancy.id === editingVacancy.id ? editingVacancy : vacancy
                    )
                );
                setEditingVacancy(null);
                setIsEditing(false);
            } else {
                console.error('Ошибка обновления вакансии:', data);
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };

    // Функция для удаления вакансии
    const handleDeleteVacancy = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setVacancies(vacancies.filter((vacancy) => vacancy.id !== id));
            } else {
                console.error('Ошибка удаления вакансии:', data);
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };

    return (
        <div>
            <h2>Управление вакансиями</h2>
            <div>
                {isEditing ? (
                    <div>
                        <h3>Редактировать вакансию</h3>
                        <input
                            type="text"
                            value={editingVacancy.title}
                            onChange={(e) => setEditingVacancy({ ...editingVacancy, title: e.target.value })}
                        />
                        <button onClick={handleUpdateVacancy}>Сохранить изменения</button>
                    </div>
                ) : (
                    <div>
                        <input
                            type="text"
                            value={newVacancy}
                            onChange={(e) => setNewVacancy(e.target.value)}
                            placeholder="Введите название вакансии"
                        />
                        <button onClick={handleCreateVacancy}>Создать вакансию</button>
                    </div>
                )}
            </div>

            <h3>Список вакансий:</h3>
            <ul>
                {vacancies.map((vacancy) => (
                    <li key={vacancy.id}>
                        {vacancy.title}
                        <button onClick={() => handleGetVacancy(vacancy.id)}>Просмотр</button>
                        <button onClick={() => handleEditVacancy(vacancy.id)}>Редактировать</button>
                        <button onClick={() => handleDeleteVacancy(vacancy.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VacancyManager;
