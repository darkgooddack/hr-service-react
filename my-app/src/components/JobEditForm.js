import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobEditForm = () => {
    const { id } = useParams();  // Получаем id из URL
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVacancy = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/vacancy/get/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setTitle(data.title);
                    setStatus(data.status);
                    setCompanyName(data.company_name);
                    setCompanyAddress(data.company_address);
                    setLogoUrl(data.logo_url);
                    setDescription(data.description);
                } else {
                    setError('Не удалось загрузить данные вакансии');
                }
            } catch (error) {
                setError('Ошибка при загрузке данных');
            }
        };
        fetchVacancy();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Создаем URLSearchParams вместо FormData
        const formData = new URLSearchParams();
        formData.append('title', title);
        formData.append('status', status);
        formData.append('company_name', companyName);
        formData.append('company_address', companyAddress);
        formData.append('logo_url', logoUrl);
        formData.append('description', description);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // указываем правильный тип контента
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formData.toString(), // Отправляем данные как строку
            });

            if (response.ok) {
                navigate(`/vacancy/${id}`);  // Перенаправляем на страницу вакансии после редактирования
            } else {
                const data = await response.json();
                setError(data.detail || 'Ошибка при редактировании вакансии');
            }
        } catch (error) {
            setError('Ошибка подключения к серверу');
        }
    };

    return (
        <div>
            <h2>Редактировать вакансию</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название вакансии:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Статус вакансии:</label>
                    <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
                </div>
                <div>
                    <label>Компания:</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                </div>
                <div>
                    <label>Адрес компании:</label>
                    <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} required />
                </div>
                <div>
                    <label>Логотип компании (URL):</label>
                    <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} required />
                </div>
                <div>
                    <label>Описание вакансии:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default JobEditForm;
