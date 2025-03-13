import React, { useState, useEffect } from 'react';

const JobEditForm = ({ jobId, onJobUpdated }) => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/${jobId}`);
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
        };

        fetchJob();
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
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/${jobId}/update`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setError('');
                onJobUpdated(); // Вызываем функцию, чтобы обновить данные о вакансии
            } else {
                setError(data.detail || 'Ошибка при редактировании вакансии');
            }
        } catch (error) {
            setError('Не удалось подключиться к серверу');
        }
    };

    return (
        <div>
            <h2>Редактирование вакансии</h2>
            <form onSubmit={handleSubmit}>
                {/* Здесь поля аналогичны JobCreateForm */}
                {/* При успешном редактировании вызывается onJobUpdated */}
            </form>
        </div>
    );
};

export default JobEditForm;
