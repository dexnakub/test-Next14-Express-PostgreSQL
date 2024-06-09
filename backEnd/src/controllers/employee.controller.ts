import { Request, Response, NextFunction } from 'express'
import Database from '../config/dbConfig';

const database = Database.getInstance();

export const getEmployeesAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                e.date_of_birth,
                e.address,
                e.id_card_expiration_date,
                g.id as gender_id,
                g.name_th as gender_name,
                t.id as tambon_id,
                t.name_th as tambon_name,
                a.id as amphur_id,
                a.name_th as amphur_name,
                p.id as province_id,
                p.name_th as province_name
            FROM employee e
            LEFT JOIN gender g ON
            e.gender_id = g.id 
            LEFT JOIN tambon t ON
            e.tambon_id = t.id 
            LEFT JOIN amphur a ON
            t.amphure_id = a.id 
            LEFT JOIN province p ON
            a.province_id = p.id 
        `;

        const result = await client.query(query);
        client.release();
        const persons = result.rows;
        res.json(persons);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ errorMessage: 'Something went wrong' });
    }
}

export const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    const { currentPage, itemsPerPage, dateOfBirthMonth, idCardExpirationDate } = req.body;
    const offset = (currentPage - 1) * itemsPerPage;
    try {
        const client = await database.getPool().connect();

        let query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                e.date_of_birth,
                e.address,
                e.id_card_expiration_date,
                g.id as gender_id,
                g.name_th as gender_name,
                t.id as tambon_id,
                t.name_th as tambon_name,
                a.id as amphur_id,
                a.name_th as amphur_name,
                p.id as province_id,
                p.name_th as province_name,
                COUNT(*) OVER() AS total
            FROM employee e
            LEFT JOIN gender g ON
            e.gender_id = g.id 
            LEFT JOIN tambon t ON
            e.tambon_id = t.id 
            LEFT JOIN amphur a ON
            t.amphure_id = a.id 
            LEFT JOIN province p ON
            a.province_id = p.id 
        `;

        const values: any[] = [itemsPerPage, offset];
        let whereClauses: string[] = [];

        if (dateOfBirthMonth) {
            whereClauses.push(`EXTRACT(MONTH FROM e.date_of_birth) = ${dateOfBirthMonth}`);
        }

        if (idCardExpirationDate == 'expire') {
            whereClauses.push(`e.id_card_expiration_date::timestamp < CURRENT_TIMESTAMP`);
        }

        if (idCardExpirationDate == 'notexpire') {
            whereClauses.push(`e.id_card_expiration_date::timestamp > CURRENT_TIMESTAMP`);
        }

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += ' ORDER BY e.id';

        query += ' LIMIT $1 OFFSET $2';

        const result = await client.query(query, values);
        client.release();
        let data;
        if (result.rows.length > 0) {
            data = {
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                total: result.rows[0].total,
                data: result.rows.map(row => {
                    return {
                        id: row.id,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        date_of_birth: row.date_of_birth,
                        address: row.address,
                        id_card_expiration_date: row.id_card_expiration_date,
                        gender_id: row.gender_id,
                        gender_name: row.gender_name,
                        tambon_id: row.tambon_id,
                        tambon_name: row.tambon_name,
                        amphur_id: row.amphur_id,
                        amphur_name: row.amphur_name,
                        province_id: row.province_id,
                        province_name: row.province_name
                    };
                })
            };
        } else {
            data = {
                currentPage: currentPage,
                itemsPerPage: itemsPerPage,
                total: 0,
                data: []
            };
        }
        
        res.json(data);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ errorMessage: 'Something went wrong' });
    }
}

export const getEmployeesById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const client = await database.getPool().connect();
    try {
        // const result = await client.query('SELECT * FROM employee left join');

        const query = `
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                e.date_of_birth,
                e.address,
                e.id_card_expiration_date,
                g.id as gender_id,
                g.name_th as gender_name,
                t.id as tambon_id,
                t.name_th as tambon_name,
                a.id as amphur_id,
                a.name_th as amphur_name,
                p.id as province_id,
                p.name_th as province_name
            FROM employee e
            LEFT JOIN gender g ON
            e.gender_id = g.id 
            LEFT JOIN tambon t ON
            e.tambon_id = t.id 
            LEFT JOIN amphur a ON
            t.amphure_id = a.id 
            LEFT JOIN province p ON
            a.province_id = p.id 
            WHERE e.id = $1
        `;

        const values = [id];
        const result = await client.query(query, values);
        client.release();
        const employee = result.rows;
        res.json(employee);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ errorMessage: 'Something went wrong' });
    }
}

export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, dateOfBirth, address, idCardExpirationDate, tambonId, amphurId, provinceId, genderId } = req.body;
    const client = await database.getPool().connect();
    try {
        const query = `
        INSERT INTO employee (first_name, last_name, date_of_birth, address, id_card_expiration_date, tambon_id, amphur_id, province_id, gender_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
        const values = [firstName, lastName, dateOfBirth, address, idCardExpirationDate, tambonId, amphurId, provinceId, genderId];
        await client.query(query, values);
        client.release();
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (err) {
        res.status(500).json({ errorMessage: 'Something went wrong' })
    }
}

export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, dateOfBirth, address, idCardExpirationDate, tambonId, amphurId, provinceId, genderId } = req.body;
    const client = await database.getPool().connect();
    const id = req.params.id

    try {
        const query = `
        UPDATE employee
        SET first_name = $1,
            last_name = $2,
            date_of_birth = $3,
            address = $4,
            id_card_expiration_date = $5,
            tambon_id = $6,
            amphur_id = $7,
            province_id = $8,
            gender_id = $9
        WHERE id = $10
        
    `;
        const values = [firstName, lastName, dateOfBirth, address, idCardExpirationDate, tambonId, amphurId, provinceId, genderId, id];
        console.log('values', values)
        await client.query(query, values);
        client.release();
        res.status(200).json({ message: 'Employee Updated successfully' });
    } catch (err) {
        res.status(500).json({ errorMessage: 'Something went wrong' })
    }
}

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const client = await database.getPool().connect();
    try {
        const query = `
        DELETE FROM employee WHERE id = $1
    `;
        const values = [id];
        await client.query(query, values);
        client.release();
        res.status(200).json({ message: `Deleted employee ${id} successfully` });
    } catch (err) {
        res.status(500).json({ errorMessage: 'Something went wrong' })
    }
}
