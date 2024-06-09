'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import FormCreate from './formCreate'
import { Gender, Tambon, Amphur, Province } from '../../interface/masterData.interface'
import axios from 'axios'
import { EmployeeData } from '../../interface/employeeData.interface'

import Swal from 'sweetalert2';

export default function Create() {
    const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000'
    const router = useRouter();

    const [useGender, setGender] = useState<Gender[]>([])
    const [useTambon, setTambon] = useState<Tambon[]>([])
    const [useAmphur, setAmphur] = useState<Amphur[]>([])
    const [useProvince, setProvince] = useState<Province[]>([])

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchGender = async (): Promise<Gender[]> => {
        try {
            const response = await axios.get(`${apiUrl}/master/getGender`);
            return response.data
        } catch (err) {
            console.error('Error fetching gender:', err);
            throw err;
        }
    };

    const fetchTambon = async (): Promise<Tambon[]> => {
        try {
            const response = await axios.get(`${apiUrl}/master/getTambon`);
            return response.data
        } catch (err) {
            console.error('Error fetching tambon:', err);
            throw err;
        }
    };

    const fetchAmphur = async (): Promise<Amphur[]> => {
        try {
            const response = await axios.get(`${apiUrl}/master/getAmphur`);
            return response.data
        } catch (err) {
            console.error('Error fetching amphur:', err);
            throw err;
        }
    };

    const fetchProvince = async (): Promise<Province[]> => {
        try {
            const response = await axios.get(`${apiUrl}/master/getProvince`);
            return response.data
        } catch (err) {
            console.error('Error fetching province:', err);
            throw err;
        }
    };

    useEffect(() => {
        const fetchBoth = async () => {
            const tempLoadedGender = await fetchGender();
            const tempLoadedTambon = await fetchTambon();
            const tempLoadedAmphur = await fetchAmphur();
            const tempLoadedProvince = await fetchProvince();
            // console.log('tempLoadedTambon', tempLoadedTambon)
            // console.log('tempLoadedAmphur', tempLoadedAmphur)
            // console.log('tempLoadedProvince', tempLoadedProvince)
            setGender(tempLoadedGender);
            setTambon(tempLoadedTambon);
            setAmphur(tempLoadedAmphur);
            setProvince(tempLoadedProvince);
            setIsLoading(false);
        };

        fetchBoth();
    }, []);

    const handleSubmit = async (e: EmployeeData) => {
        try {
            // console.log('formData', e)
            const response = await axios.post(`${apiUrl}/employees/createEmployee`, e);
            if (response.status === 201) {
                Swal.fire("บันทึก สำเร็จ!", "", "success");
                console.log('Data saved successfully:', response.data);
                router.push('/');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    return (
        <>
            {isLoading ? ("Loading ...") :
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">เพิ่มข้อมูลพนักงาน</h1>
                    <FormCreate gender={useGender} tambon={useTambon} amphur={useAmphur} province={useProvince} onSubmit={(data: EmployeeData) => handleSubmit(data)} />
                </div>
            }
        </>
    );
}
