export interface EmployeeData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  idCardExpirationDate: string;
  tambonId: number | null;
  amphurId: number | null;
  provinceId: number | null;
  genderId: number | null;
}

export interface EmployeeDataExport {
  firstName: string;
  lastName: string;
  genderName: string;
  dateOfBirth: string;
  address: string;
  idCardExpirationDate: string;
  tambonName: string;
  amphurName: string;
  provinceName: string;
}

export interface EmployeeDataTable {
  id: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
}

export interface filterDataTable {
  dateOfBirthMonth: string;
  idCardExpirationDate: boolean;
}

export interface paginationDataTable {
  currentPage: number,
  itemsPerPage: number,
  total: number
}
