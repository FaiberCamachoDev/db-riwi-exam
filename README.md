# Megastore Database Project
This project implements a hybrid database system using MySQL and MongoDB.
MySQL is used for transactional and structured data, while MongoDB is used for audit logs when records are deleted.
The system reads sales data from an Excel file and migrates it into a normalized relational database.
It also provides a REST API to manage products and logs deletions into MongoDB.
---
## Technologies

- Node.js

- Express.js

- MySQL

- MongoDB

- Mongoose

- XLSX

- dotenv

## Features

Data migration from Excel to MySQL

Normalized relational model

REST API for product management (CRUD)

Foreign key relationships

Business Intelligence queries

Audit log stored in MongoDB when a product **is deleted**
---
## Installation

### Install dependencies:

npm install

Configure environment variables in a .env file:

DB_HOST=168.119.183.3
DB_USER=root
DB_PASSWORD=g0tIFJEQsKHm5$34Pxu1
DB_NAME=db_faibercamacho
PORT=3307
Data Migration

To migrate data from the Excel file to the database:

**node migrate.js**

This process reads the Excel file and distributes the information into normalized tables such as customers, suppliers, products, orders, and order details.
It also avoids duplicated records by checking existing data before inserting.

Running the API

To start the API server:

node app.js

The API will run on:

http://168.119.183.3:3307
API Endpoints

POST /products → Create a product

GET /products → Get all products

PUT /products/:id → Update a product

DELETE /products/:id → Delete a product and store audit log in MongoDB

Audit Log (MongoDB)

When a product is deleted, its data is stored in MongoDB in a collection called deletionlogs.
This allows keeping historical records without affecting transactional performance.

Business Intelligence

### The system supports analytical queries such as:

Total sales by product

Total sales by customer

Best-selling products

Sales grouped by date

These queries use the relational model for reporting and analysis.

Conclusion:
This project demonstrates

- Data normalization

- Integration between SQL and NoSQL

- Data migration from Excel

- REST API implementation

- Audit logging

- Business Intelligence queries


## why use SQL for other data...
- the data insert into MySQL need to be flexible and not inmutable, the data have many ways for relation it, so, is better for optimized querys and make subquerys. 
## why migrated like that...
- the migration process read the excel file and then distribute de data into a normalized relational model.
A validation step checks if customers, suppliers, products and orders already exist before inserting them, ensuring idempotent behavior and avoiding duplicated master records.
### for use the migrated script you need to:
- execute in console **node migrated.js**
---
## why on mongoDB audit logs (deletionLogs)...
- MongoDB is used as a NoSQL for storage logs for audit purposes. The schema validation is applied using mongoose for data consistency.
Documents embed the full state of the deleted entity, beacause logs are inmutable (no one can re-write a deletion log) and in this way optimized for read operations. 