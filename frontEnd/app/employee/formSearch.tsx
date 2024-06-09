// components/FormInput.tsx

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import InputField from '../components/InputField';
import Select from '../components/Select';

interface InputFieldProps {
    month: any[];
    expirationDate: any[];
    onSubmit: (data: filterDataTable) => void;
}

export interface filterDataTable {
    dateOfBirthMonth: string;
    idCardExpirationDate: string;
}

const FormSearch: React.FC<InputFieldProps> = ({ month, expirationDate, onSubmit }) => {
    const initialFormData: filterDataTable = {
        dateOfBirthMonth: '',
        idCardExpirationDate: ''
    };
    const [formData, setFormData] = useState<filterDataTable>(initialFormData);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            onSubmit(formData);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <form className="grid grid-cols-2 gap-x-4 gap-y-4" onSubmit={handleSubmit}>
            <Select
                id="dateOfBirthMonth"
                label="เดือน"
                value={formData.dateOfBirthMonth ?? ""}
                options={month}
                onChange={handleChange}
            />
            <Select
                id="idCardExpirationDate"
                label="บัตรประชาชน"
                value={formData.idCardExpirationDate ?? ''}
                options={expirationDate}
                onChange={handleChange}
            />
            <div className="col-span-2 flex justify-center">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    ค้นหา
                </button>
            </div>
        </form>
    );
};

export default FormSearch;
