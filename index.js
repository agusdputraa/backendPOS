const express = require ("express")
const productRoutes = require ("./routes/product_routes")
const categoryRoutes = require ("./routes/category_routes")
const userRoutes = require ("./routes/user_routes")
const app = express()
const dotenv = require ("dotenv")
dotenv.config()

app.use(express.json())

app.use("/products", productRoutes)
app.use("/categories", categoryRoutes)
app.use("/users", userRoutes)

app.use("/ping", (req, res) => {
    res.send("API is running Now")
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running at port:${port}`)
} )