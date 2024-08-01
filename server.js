const express = require("express")
const budgetsRouter = require("./router/budgetsRouter.js")

const port = 3000;
const app = express()

app.listen(port, ()=>{
    console.log(`Server running on port ${port}...`)
})


app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// End points for Budgets
app.use("/budget", budgetsRouter)


