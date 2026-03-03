const XLSX = require("xlsx");
const db = require("./db");

// leread excel
const workbook = XLSX.readFile("data.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

async function migrate() {
    for (const row of rows) {
        // customer
    let [customer] = await db.query(
        "SELECT id FROM customers WHERE email = ?",
        [row.customer_email]
        );

    let customerId;
    if (customer.length === 0) {
    
        const result = await db.query(
        "INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)",
        [row.customer_name, row.customer_email, row.customer_address, row.customer_phone]
        );
        customerId = result[0].insertId;
    } else {
        customerId = customer[0].id;
    }

    // supplier
    let [supplier] = await db.query(
        "SELECT id FROM suppliers WHERE email = ?",
        [row.supplier_email]
    );

    let supplierId;
    if (supplier.length === 0) {
        const result = await db.query(
        "INSERT INTO suppliers (name, email) VALUES (?, ?)",
        [row.supplier_name, row.supplier_email]
        );
        supplierId = result[0].insertId;
    } else {
        supplierId = supplier[0].id;
    }

    // product
    let [product] = await db.query(
        "SELECT id FROM products WHERE sku = ?",
        [row.product_sku]
    );

    let productId;
    if (product.length === 0) {
        const result = await db.query(
        `INSERT INTO products (sku, name, category, unit_price, supplier_id)
        VALUES (?, ?, ?, ?, ?)`,
        [row.product_sku, row.product_name, row.product_category, row.unit_price, supplierId]
        );
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

    //order detail
    await db.query(
        `INSERT INTO order_details (order_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)`,
        [orderId, productId, row.quantity, row.unit_price]
    );

}

    console.log("Migrated successfully :)");
    process.exit();
}
//convert excel date to good format for myqsl
function excelDateToMySQL(dateValue) {
    if (typeof dateValue === "number") {
        const utc_days = Math.floor(dateValue - 25569);
        const utc_value = utc_days * 86400;
        const jsDate = new Date(utc_value * 1000);
        return jsDate.toISOString().split("T")[0];
    } else {
        return dateValue;
    }
}
migrate();
