const express= require("express");
const fs = require("fs");
const app = express()
app.use(express.urlencoded({extended:true}));
app.use(express.json());
function validation (req,res,next){
    if(req.url === './user/login'){
        fs.readFile('./db.json','utf-8',(error,data)=>{
            const parsed = JSON.parse(data);
            let user = parsed.users.filter((user)=>
                user.email == req.bady.email && user.password == req.body.password 
            )
            console.log(user);
            if(user.length !== 0) next();
            else res.status(401).send({status:"Invalid Credentials"})
        })
    }
    next()
}

app.get("/",(req,res)=>{
    res.end("get data")
})
app.get("/user/login",(req,res)=>{
   fs.readFile("./db.json",{encoding:"utf-8"},(error,data)=>{
        res.end(data);
   })
})

app.post("/user/create",(req,res)=>{
    fs.readFile('./db.json',{encoding:"utf-8"},(error,data)=>{
        const parsed = JSON.parse(data);
        parsed.users = [...parsed.users,req.body];

        fs.writeFile('./db.json',JSON.stringify(parsed),{encoding:"utf-8"},()=>{
            res.status(201).send("user created");
            return{
                status:"user created",
                id:Math.random()
            }
        })
    })
})
app.post('/user/login',validation,(req,res)=>{
    fs.readFile("./db.json",{encoding:"utf-8"},(error,data)=>{
        const parsed =JSON.parse(data);
        parsed.users = [...parsed.users,req.body];

        fs.writeFile('./db.json'.JSON.stringify(parsed),{encoding:"utf-8"},(error,data)=>{
            res.data(data)
        })
    })
})

const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log("server started on http://localhost:PORT")
})