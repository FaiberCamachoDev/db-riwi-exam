const express = require("express");
const router = express.Router();
const db = require("../db");
const DeletionLog = require("../models/deletionLogs");

// all products
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
});

//one product
router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.json({ message: "Product not found" });
    res.json(rows[0]);
});

// create product
router.post("/", async (req, res) => {
    const { sku, name, category, unit_price, supplier_id } = req.body;

    const [result] = await db.query(
    "INSERT INTO products (sku, name, category, unit_price, supplier_id) VALUES (?, ?, ?, ?, ?)",
    [sku, name, category, unit_price, supplier_id]
    );

    res.json({ id: result.insertId, message: "Product created" });
});

//update product
router.put("/:id", async (req, res) => {
    const { name, category, unit_price, supplier_id } = req.body;

    await db.query(
    "UPDATE products SET name=?, category=?, unit_price=?, supplier_id=? WHERE id=?",
    [name, category, unit_price, supplier_id, req.params.id]
    );

    res.json({ message: "Product updated" });
});

// delete product +log
router.delete("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.json({ message: "Product not found" });

    const product = rows[0];

    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);

    await DeletionLog.create({
    entity: "product",
    entity_id: product.id,
    reason: "manual delete",
    data: product
    });

    res.json({ message: "Product deleted and logged" });
});

module.exports = router;