// components/FormInput.tsx

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import InputField from '../../components/InputField';
import { EmployeeData } from '../../interface/employeeData.interface';
import Select from '../../components/Select';
import { Gender, Amphur, Province, Tambon } from '../../interface/masterData.interface';

interface InputFieldProps {
    gender: Gender[];
    tambon: Tambon[];
    amphur: Amphur[];
    province: Province[];
    onSubmit: (data: EmployeeData) => void;
    datas?: any[];
}

const FormCreate: React.FC<InputFieldProps> = ({ gender, tambon, amphur, province, onSubmit, datas }) => {
    const initialFormData: EmployeeData = {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        address: '',
        idCardExpirationDate: '',
        tambonId: tambon.length > 0 ? tambon[0].id : 0,
        amphurId: amphur.length > 0 ? amphur[0].id : 0,
        provinceId: province.length > 0 ? province[0].id : 0,
        genderId: gender.length > 0 ? gender[0].id : 0
    };
    const [formData, setFormData] = useState<EmployeeData>(() => {
        if (datas && datas.length > 0) {
            const dataEmployee = datas[0];
            console.log('dataEmployee', dataEmployee)
            return {
                firstName: dataEmployee?.first_name,
                lastName: dataEmployee?.last_name,
                dateOfBirth: dataEmployee?.date_of_birth,
                address: dataEmployee?.address,
                idCardExpirationDate: dataEmployee?.id_card_expiration_date,
                tambonId: dataEmployee?.tambon_id,
                amphurId: dataEmployee?.amphur_id,
                provinceId: dataEmployee?.province_id,
                genderId: dataEmployee?.gender_id
            };
        }
        return initialFormData;
    });

    const [filteredAmphur, setFilteredAmphur] = useState<Amphur[]>([]);
    const [filteredTambon, setFilteredTambon] = useState<Tambon[]>([]);

    useEffect(() => {
        const newFilteredAmphur = amphur.filter((a: any) => a.province_id == formData.provinceId);
        setFilteredAmphur(newFilteredAmphur);
        if (newFilteredAmphur.length === 0) {
            setFormData(prevData => ({ ...prevData, amphurId: 0, tambonId: 0 }));
        } else if (!newFilteredAmphur.find(a => a.id === formData.amphurId)) {
            setFormData(prevData => ({ ...prevData, amphurId: newFilteredAmphur[0].id, tambonId: 0 }));
        }
    }, [formData.provinceId]);

    useEffect(() => {
        const newFilteredTambon = tambon.filter((t: any) => t.amphure_id == formData.amphurId);
        setFilteredTambon(newFilteredTambon);
        if (newFilteredTambon.length === 0) {
            setFormData(prevData => ({ ...prevData, tambonId: 0 }));
        } else if (!newFilteredTambon.find(t => t.id === formData.tambonId)) {
            setFormData(prevData => ({ ...prevData, tambonId: newFilteredTambon[0].id }));
        }
    }, [formData.amphurId]);
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            onSubmit(formData)
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <form className="grid grid-cols-2 gap-x-4 gap-y-4" onSubmit={handleSubmit}>
            <InputField
                id="firstName"
                label="ชื่อ"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
            />
            <InputField
                id="lastName"
                label="นามสกุล"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
            />
            <Select
                id="genderId"
                label="เพศ"
                value={formData.genderId ?? ""}
                options={gender}
                onChange={handleChange}
                require={true}
            />
            <InputField
                id="dateOfBirth"
                label="วันเดือนปีเกิด"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
            />
            <InputField
                id="address"
                label="ที่อยู่"
                type="text"
                value={formData.address}
                onChange={handleChange}
            />
            <Select
                id="tambonId"
                label="ตำบล"
                value={formData.tambonId ?? ""}
                options={filteredTambon}
                onChange={handleChange}
                require={true}
                disabled={!formData.amphurId}
            />
            <Select
                id="amphurId"
                label="อำเภอ"
                value={formData.amphurId ?? ""}
                options={filteredAmphur}
                onChange={handleChange}
                require={true}
                disabled={!formData.provinceId}
            />
            <Select
                id="provinceId"
                label="จังหวัด"
                value={formData.provinceId ?? ""}
                options={province}
                onChange={handleChange}
                require={true}
                disabled={false}
            />
            <InputField
                id="idCardExpirationDate"
                label="วันที่บัตรประชาชนหมดอายุ"
                type="date"
                value={formData.idCardExpirationDate}
                onChange={handleChange}
            />
            <div className="col-span-2 flex justify-end">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    บันทึกข้อมูล
                </button>
            </div>
        </form>
    );
};

export default FormCreate;
