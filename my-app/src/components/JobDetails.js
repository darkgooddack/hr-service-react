import React, { useEffect, useState } from 'react';

const JobDetails = ({ jobId }) => {
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            const response = await fetch(`http://localhost:8000/api/v1/vacancy/${jobId}`);
            const data = await response.json();
            if (response.ok) {
                setJob(data);
            } else {
                console.error('Ошибка получения данных');
            }
        };

        fetchJob();
    }, [jobId]);

    return job ? (
        <div>
            <h2>Вакансия: {job.title}</h2>
            <p><strong>Статус:</strong> {job.status}</p>
            <p><strong>Компания:</strong> {job.company_name}</p>
            <p><strong>Адрес:</strong> {job.company_address}</p>
            <p><strong>Описание:</strong> {job.description}</p>
            <img src={job.logo_url} alt={`${job.company_name} logo`} />
        </div>
    ) : (
        <p>Загрузка...</p>
    );
};

export default JobDetails;
