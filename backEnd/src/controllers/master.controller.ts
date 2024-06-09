import { Request, Response, NextFunction } from 'express'
import Database from '../config/dbConfig';
import { readJsonFile } from '../services/jsonFileService';

const database = Database.getInstance();

import path from 'path';

export const getGender = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        
        const result = await client.query(
            `SELECT g.id, g.name_th FROM gender g`
        );

        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error importing data', err);
    }
}

export const getTambon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        
        const result = await client.query(
            `SELECT t.id, t.name_th FROM tambon t`
        );

        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error importing data', err);
    }
}

export const getAmphur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        
        const result = await client.query(
            `SELECT a.id, a.name_th FROM amphur a`
        );

        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error importing data', err);
    }
}

export const getProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        
        const result = await client.query(
            `SELECT p.id, p.name_th FROM province p`
        );

        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error importing data', err);
    }
}

export const createTambon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        const data = await readJsonFile(path.join(__dirname, '../assets/thai_tambons.json'));

        for (const item of data) {
            const { id, zip_code, name_th, name_en, amphure_id, created_at, updated_at, deleted_at } = item;

            const createdAt = new Date(created_at);

            await client.query(
                `INSERT INTO tambon (id, zip_code, name_th, name_en, amphure_id, created_at, updated_at, deleted_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [id, zip_code, name_th, name_en, amphure_id, createdAt, null, null]
            );
        }

        client.release();
        res.json('Data imported successfully');
    } catch (err) {
        console.error('Error importing data', err);
    }
}


export const createAmphur = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        const data = await readJsonFile(path.join(__dirname, '../assets/thai_amphures.json'));

        for (const item of data) {
            const { id, name_th, name_en, province_id, created_at, updated_at, deleted_at } = item;

            const createdAt = new Date(created_at);

            await client.query(
                `INSERT INTO amphur (id, name_th, name_en, province_id, created_at, updated_at, deleted_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, name_th, name_en, province_id, createdAt, null, null]
            );
        }

        client.release();
        res.json('Data imported successfully');
    } catch (err) {
        console.error('Error importing data', err);
    }
}

export const createProvince = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await database.getPool().connect();
        const data = await readJsonFile(path.join(__dirname, '../assets/thai_provinces.json'));

        for (const item of data) {
            const { id, name_th, name_en, geography_id, created_at, updated_at, deleted_at } = item;

            const createdAt = new Date(created_at);

            await client.query(
                `INSERT INTO province (id, name_th, name_en, geography_id, created_at, updated_at, deleted_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, name_th, name_en, geography_id, createdAt, null, null]
            );
        }

        client.release();
        res.json('Data imported successfully');
    } catch (err) {
        console.error('Error importing data', err);
    }
}