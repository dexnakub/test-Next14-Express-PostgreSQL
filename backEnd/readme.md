<!-- npm init
npm init -y
npm i express body-parser cors
npm i @types/express typescript ts-node-dev rimraf --save-dev
npx tsc --init
npm install pg dotenv -->
# npm install
npm i

# docker
docker-compose up -d -- build

# Create Table
CREATE TABLE employee (
	id serial4 NOT NULL,
	first_name varchar(255) NULL,
	last_name varchar(255) NULL,
	date_of_birth date NULL,
	gender_id int4 NULL,
	address text NULL,
	id_card_expiration_date date NULL,
	tambon_id int4 NULL,
	amphur_id int4 NULL,
	province_id int4 NULL,
	CONSTRAINT employee_pkey PRIMARY KEY (id)
);

CREATE TABLE gender (
	id serial4 NOT NULL,
	name_th varchar(50) NULL,
	CONSTRAINT gender_pkey PRIMARY KEY (id)
);

CREATE TABLE tambon (
	id int4 NOT NULL,
	zip_code int4 NULL,
	name_th varchar(255) NULL,
	name_en varchar(255) NULL,
	amphure_id int4 NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	deleted_at timestamp NULL,
	CONSTRAINT tambon_pkey PRIMARY KEY (id)
);

CREATE TABLE amphur (
	id int4 NOT NULL,
	name_th varchar(255) NULL,
	name_en varchar(255) NULL,
	province_id int4 NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	deleted_at timestamp NULL,
	CONSTRAINT amphur_pkey PRIMARY KEY (id)
);

CREATE TABLE province (
	id int4 NOT NULL,
	name_th varchar(255) NULL,
	name_en varchar(255) NULL,
	geography_id int4 NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	deleted_at timestamp NULL,
	CONSTRAINT province_pkey PRIMARY KEY (id)
);

# add master data
post http://localhost:5000/master/createTambon
post http://localhost:5000/master/createAmphur
post http://localhost:5000/master/createProvince

# start
npm run dev
