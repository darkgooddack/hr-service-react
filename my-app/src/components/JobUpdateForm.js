import React, { useState, useEffect } from 'react';

const JobUpdateForm = ({ jobId, onJobUpdated }) => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Загружаем данные о вакансии, если jobId передан
        const loadJobData = async () => {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/get/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setTitle(data.title);
                setStatus(data.status);
                setCompanyName(data.company_name);
                setCompanyAddress(data.company_address);
                setLogoUrl(data.logo_url);
                setDescription(data.description);
            } else {
                setError(data.detail || 'Не удалось загрузить данные о вакансии');
            }
        };

        if (jobId) loadJobData();
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('status', status);
        formData.append('company_name', companyName);
        formData.append('company_address', companyAddress);
        formData.append('logo_url', logoUrl);
        formData.append('description', description);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/update/${jobId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setError('');
                onJobUpdated(); // Вызываем родительскую функцию, чтобы обновить данные
            } else {
                setError(data.detail || 'Ошибка при обновлении вакансии');
            }
        } catch (error) {
            setError('Не удалось подключиться к серверу');
        }
    };

    return (
        <div>
            <h2>Обновление вакансии</h2>
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Обновить вакансию</button>
            </form>
        </div>
    );
};

export default JobUpdateForm;
