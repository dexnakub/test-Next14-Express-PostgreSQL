'use client'

import { useEffect, useState } from "react";
import Table from "../components/table";
import axios from "axios";
import { EmployeeDataExport, EmployeeDataTable, filterDataTable, paginationDataTable } from "../interface/employeeData.interface";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation'
import FormSearch from "./formSearch";

export default function Page() {
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000'
  const [employee, setEmployee] = useState<EmployeeDataTable[]>([])
  const [employeeExports, setEmployeeExports] = useState<EmployeeDataExport[]>([])
  const [filterData, setFilterData] = useState<filterDataTable>({
    dateOfBirthMonth: "",
    idCardExpirationDate: false
  })
  const [pagination, setPagination] = useState<paginationDataTable>({
    currentPage: 1,
    itemsPerPage: 2,
    total: 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const columnName = [
    { id: 1, name: '' },
    { id: 2, name: 'Full Name' },
    { id: 3, name: 'Gender' },
    { id: 4, name: 'Date Of Birth' },
    { id: 5, name: 'IDCard Expiration Date' },
    { id: 6, name: 'Address' },
    { id: 7, name: 'Action' }
  ];

  const months = [
    { id: '', name_th: 'ทั้งหมด' },
    { id: 1, name_th: 'มกราคม' },
    { id: 2, name_th: 'กุมภาพันธ์' },
    { id: 3, name_th: 'มีนาคม' },
    { id: 4, name_th: 'เมษายน' },
    { id: 5, name_th: 'พฤษภาคม' },
    { id: 6, name_th: 'มิถุนายน' },
    { id: 7, name_th: 'กรกฎาคม' },
    { id: 8, name_th: 'สิงหาคม' },
    { id: 9, name_th: 'กันยายน' },
    { id: 10, name_th: 'ตุลาคม' },
    { id: 11, name_th: 'พฤศจิกายน' },
    { id: 12, name_th: 'ธันวาคม' }
  ];

  const expirationDate = [
    { id: '', name_th: 'ทั้งหมด' },
    { id: 'expire', name_th: 'หมดอายุ' },
    { id: 'notexpire', name_th: 'ไม่หมดอายุ' },
  ];

  const fetchEmployee = async (currentPage: any = 1): Promise<any[]> => {
    try {
      const response = await axios.post(`${apiUrl}/employees/getEmployees`, {
        currentPage: currentPage,
        itemsPerPage: pagination.itemsPerPage,
        dateOfBirthMonth: filterData.dateOfBirthMonth,
        idCardExpirationDate: filterData.idCardExpirationDate
      });
      // console.log('response', response.data)

      setPagination(prevState => ({
        ...prevState,
        currentPage: response.data.currentPage,
        itemsPerPage: response.data.itemsPerPage,
        total: response.data.total
      }));

      return response.data.data

    } catch (err) {
      console.error('Error fetching gender:', err);
      throw err;
    }
  }

  const mapDataEmployee = (dataEmployee: any[]) => {
    const mapData = dataEmployee.map(data => {
      return {
        id: data.id,
        fullName: data.first_name + ' ' + data.last_name,
        gender: data.gender_name,
        dateOfBirth: data.date_of_birth,
        idCardExpirationDate: data.id_card_expiration_date,
        address: data.address + ' ' + data.tambon_name + ' ' + data.amphur_name + ' ' + data.province_name + ' '
      }
    })
    return mapData
  }

  const mapDataEmployeeExports = (dataEmployee: any[]) => {
    const mapData = dataEmployee.map(data => {
      return {
        firstName: data.first_name,
        lastName: data.last_name,
        genderName: data.gender_name,
        dateOfBirth: new Date(data.date_of_birth as string).toLocaleDateString(),
        address: data.address,
        idCardExpirationDate: new Date(data.date_of_birth as string).toLocaleDateString(),
        tambonName: data.tambon_name,
        amphurName: data.amphur_name,
        provinceName: data.province_name
      }
    })
    const dataArray = Object.values(mapData);
    setEmployeeExports([...dataArray]);
  }

  useEffect(() => {
    const fetchBoth = async () => {
      const tempLoadedEmployee = await fetchEmployee(pagination.currentPage);
      const mapData = mapDataEmployee(tempLoadedEmployee)
      mapDataEmployeeExports(tempLoadedEmployee)
      setEmployee(mapData);
      setIsLoading(false);
    };

    fetchBoth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempLoadedEmployee = await fetchEmployee(1);
        const mapData = mapDataEmployee(tempLoadedEmployee);
        mapDataEmployeeExports(tempLoadedEmployee)
        setEmployee(mapData);
      } catch (error) {
        console.error('Error fetching and processing employee data:', error);
      }
    };
    fetchData();
  }, [filterData]);

  const handleEdit = async (e: any) => {
    try {
      // console.log(e)
      router.push(`employee/edit/${e}`);
    } catch (error) {
      console.error('Error edit data:', error);
    }
  };

  const handleDelete = async (e: any) => {
    try {
      Swal.fire({
        title: "คุรต้องการลบข้อมูล Employee หรือไม่?",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {

          const response = await axios.delete(`${apiUrl}/employees/deleteEmployee/${e}`, e);
          if (response.status === 200) {
            const tempLoadedEmployee = await fetchEmployee();
            const mapData = mapDataEmployee(tempLoadedEmployee)
            mapDataEmployeeExports(tempLoadedEmployee)
            setEmployee(mapData);
            Swal.fire("ลบข้อมูล สำเร็จ!", "", "success");
          }
        }
      });

    } catch (error) {
      console.error('Error delete data:', error);
    }
  };

  const handleSelectPagination = async (currentPage: any) => {
    setPagination(prevState => ({
      ...prevState,
      currentPage: currentPage
    }));

    const tempLoadedEmployee = await fetchEmployee(currentPage);
    const mapData = mapDataEmployee(tempLoadedEmployee)
    mapDataEmployeeExports(tempLoadedEmployee)
    setEmployee(mapData);
  };

  const handleFilterSubmit = async (formData: any) => {
    try {
      filterData.dateOfBirthMonth,
        filterData.idCardExpirationDate
      setFilterData(prevState => ({
        ...prevState,
        ...formData
      }));

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleExportCSV = () => {

    const csvData = `firstName,lastName,genderName,dateOfBirth,address,idCardExpirationDate,tambonName,amphurName,provinceName\n` +
      `${employeeExports.map(({ firstName, lastName, genderName, dateOfBirth, address, idCardExpirationDate, tambonName, amphurName, provinceName }) =>
        `${firstName},${lastName},${genderName},${dateOfBirth},${address},${idCardExpirationDate},${tambonName},${amphurName},${provinceName}`
      ).join('\n')}`;

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataEmployee.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  return (
    <>
      <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 mb-4">
        <div className="text-xl font-bold mb-4">
          กรองข้อมูล
        </div>
        <FormSearch month={months} expirationDate={expirationDate} onSubmit={handleFilterSubmit} />
      </div>
      {isLoading ? ("Loading ...") :
        <>
          {
            employee.length > 0 ?
              <>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 rounded-lg shadow p-4">
                  <div className="flex justify-end my-4 pr-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleExportCSV}>Export CSV</button>
                  </div>
                  <Table columnName={columnName} pagination={pagination} datas={employee} onEdit={handleEdit} onDelete={handleDelete} onSelectPagination={handleSelectPagination} />
                </div>
              </>
              :
              <div className="text-center text-gray-500">
                ไม่มีข้อมูล
              </div>
          }
        </>
      }
    </>
  );
}
