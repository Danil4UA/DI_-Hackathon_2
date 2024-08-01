const express = require("express")
const budgets = require("./config/budjets.js")

const port = 3000;
const app = express()

app.listen(port, ()=>{
    console.log(`Server running on port ${port}...`)
})


app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Create Budget

app.get("/budget", (req,res)=>{
    res.json(budgets)
})


app.get("/budget/:id", (req,res)=>{
    const {id} = req.params
    const index = budgets.findIndex(item=>item.id == id)
    if(index === -1)res.json({message: "Buget not found"})
    res.json(budgets[index])
})

app.post("/budget", (req,res)=>{
    const newBudget = {id: budgets.length + 1, ...req.body}
    budgets.push(newBudget)
    res.json(newBudget)
})