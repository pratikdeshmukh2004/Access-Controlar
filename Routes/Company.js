module.exports=(app,knex,jwt)=>{
    app.get("/register",(req,res)=>{
        if (req.headers.cookie){
            res.sendFile(process.cwd()+"/Pages/Signup.html")
        }else{
            res.sendFile(process.cwd()+"/Pages/Company.html")
        }
    })
    app.post("/company",(req,res)=>{
        if (req.body){
            knex.select("*").from("Company").where("company_name",req.body.Company)
            .then((data)=>{
                if (data.length<1){
                    knex("Company").insert({company_name:req.body.Company})
                    .then((id)=>{
                        knex("users").insert({email:req.body.Email,password:req.body.Password,company:id[0],role:"SuperAdmin"})
                        .then((data)=>{
                            res.redirect("/login")
                        })
                    })
                }else{
                    res.render(process.cwd()+"/Pages/Error.ejs",{error:"This Company Already Exists."})
                }
            })
        }else{
            res.redirect("/register")
        }
    })
}