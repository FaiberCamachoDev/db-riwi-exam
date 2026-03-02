const xlsx = require('xlsx');
const db = require('./db');
//read excel file
const workbook = xlsx.readFile('./data/data.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

async function migrateData() {
    for (const row of data) {
        //customer
        let [customer] = await db.query('SELECT id FROM customers WHERE email = ?', [row.customer_email]);
        let customerId;
        if (customer.length === 0) {
            const result = await db.query('INSERT INTO customers (name, email) VALUES (?, ?)', [row.customer_name, row.customer_email]);
            customerId = result[0].insertId;
        } else {
            customerId = customer[0].id;
        }
        // supplier
        let [supplier] = await db.query('SELECT id FROM suppliers WHERE name = ?', [row.supplier_name]);
        let supplierId;
        if (supplier.length === 0) {
            const result = await db.query('INSERT INTO suppliers (name) VALUES (?)', [row.supplier_name]);
            supplierId = result[0].insertId;
        } else {
            supplierId = supplier[0].id;
        }
        // product
        let [product] = await db.query('SELECT id FROM products WHERE name = ?', [row.product_name]);
        let productId;
        if (product.length === 0) {
            const result = await db.query('INSERT INTO products (name, price, supplier_id) VALUES (?, ?, ?)', [row.product_name, row.product_price, supplierId]);
            productId = result[0].insertId;
        } else {
            productId = product[0].id;
        }
        // order
        let [order] = await db.query(
        "SELECT id FROM orders WHERE transaction_code = ?",
        [row.transaction_id]
        );

    let orderId;
    if (order.length === 0) {
        const orderDate = excelDateToMySQL(row.date);
        const result = await db.query(
        "INSERT INTO orders (transaction_code, order_date, customer_id) VALUES (?, ?, ?)",
        [row.transaction_id, orderDate, customerId]
        );
        orderId = result[0].insertId;
        } else {
            orderId = order[0].id;
        }
        //order_details
        await db.query('INSERT INTO order_details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)', [orderId, productId, row.quantity, row.unit_price]);
    }
    console.log('Migrated data successfully :)');
    process.exit();
}
// fuction to convert excel date to mysql date
function excelDateToMySQL(dateValue) {
    if (typeof dateValue === "number") {
        const utc_days = Math.floor(dateValue - 25569);
        const utc_value = utc_days * 86400;
        const jsDate = new Date(utc_value * 1000);
        return jsDate.toISOString().split("T")[0];
    } else {
        return dateValue; // if its already a string, return as is"
    }
}
migrateData();