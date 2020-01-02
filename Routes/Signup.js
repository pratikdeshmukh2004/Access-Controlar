module.exports = (superadmin,knex,jwt)=>{
    superadmin.post("/register",(req,res)=>{
        var body = req.body
        if (body.Email !== undefined && body.Password !== undefined && body.Role !== undefined){
            knex('users').select('*')
            .then((data)=>{
                if (data.length === 0){
                    knex('users').insert({
                        "email" : req.body.Email,
                        'password' : req.body.Password,
                        'role' : "SuperAdmin"
                    }).then((id)=>{
                        res.send(id)
                    }).catch((err)=>{
                        res.send([{Error:"Error in Database..." }])
                    })
                }else{
                    if (req.headers.cookie){   
                        var token = req.headers.cookie.slice(16);
                        jwt.verify(token,process.env.SECREAT,(err,data)=>{
                            if (!err){
                                if (data.id == 1){
                                    knex.select("*").from("users").where("email",body.Email)
                                    .then((data)=>{
                                        if (data.length<1){
                                            knex('users').insert({
                                                "email" : body.Email,
                                                'password' : body.Password,
                                                'role' : req.body.Role
                                            })
                                            .then((id)=>{
                                                res.redirect("/login")
                                            })
                                        }else{
                                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"This User Aready Exists Please Login."})
                                        }
                                    })
                            }else{
                                res.render(process.cwd() + "/Pages/Error.ejs",{error:"Only Super Admin Can Create User."})
                            }
                        }
                        })                        
                    }else{
                        res.render(process.cwd() + "/Pages/Error.ejs",{error:"Only Super Admin Can Create User."})
                    }
                }
            })
            .catch((err)=>{
                res.send(err)
            })
        }else{
            res.render(process.cwd() + "/Pages/Error.ejs",{error:"Server Problem"})
        }
    })
    superadmin.get("/register",(req,res)=>{
        res.sendFile(process.cwd()+"/Pages/Signup.html")
    })
}
