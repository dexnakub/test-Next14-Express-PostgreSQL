import fs from 'fs';
import path from 'path';

// ฟังก์ชันอ่านไฟล์ JSON
export const readJsonFile = (filePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
};

// ฟังก์ชันค้นหาชื่อจาก ID
export const findNamesByIds = async (ids: any) => {
    try {
        console.log('findNamesByIds')
        const subdistricts = await readJsonFile(path.join(__dirname, '../assets/thai_tambons.json'));
        const districts = await readJsonFile(path.join(__dirname, '../assets/thai_amphures.json'));
        const provinces = await readJsonFile(path.join(__dirname, '../assets/thai_provinces.json'));
        // const genders = await readJsonFile(path.join(__dirname, '../assets/genders.json'));

        const subDistrict = subdistricts.find((item: any) => item.subDistrictID === ids.subDistrictID);
        // console.log('subDistrict2', subDistrict)
        const district = districts.find((item: any) => item.districtID === ids.districtID);
        const province = provinces.find((item: any) => item.provinceID === ids.provinceID);
        // const gender = genders.find((item: any) => item.genderID === ids.genderID);

        return {
            subDistrictName: subDistrict ? subDistrict.name_th : 'Not found',
            districtName: district ? district.name : 'Not found',
            provinceName: province ? province.name : 'Not found',
            // genderName: gender ? gender.name : 'Not found'
        };
    } catch (error) {
        console.error('Error reading or parsing JSON files:', error);
        return null;
    }
};

// ฟังก์ชันอ่านไฟล์ JSON และเรียกใช้ findNamesByIds
export const checkJsonFile = async (persons: any, callback: (jsonData: any) => void) => {
    try {
        const results = [];
        // console.log('persons', persons)
        for (const person of persons) {
            const result = await findNamesByIds({
                subDistrictID: person.subDistrictID,
                districtID: person.districtID,
                provinceID: person.provinceID,
                genderID: person.genderID
            });
            results.push(result);
        }
        console.log('results', results)
        callback(results);
    } catch (error) {
        console.error('Error in checkJsonFile:', error);
        callback(null);
    }
};
