const express = require("express");
require("dotenv").config();
const connectMongo = require("./mongo");

const productsRoutes = require("./routes/products.route");

const app = express();
app.use(express.json());

async function start() {
    await connectMongo();
    app.use("/products", productsRoutes);
    app.listen(process.env.PORT, () => {
        console.log(`API running on port ${process.env.PORT}`);
    });
}
start();