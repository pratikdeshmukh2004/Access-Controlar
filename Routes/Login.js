module.exports = (login,knex,jwt)=>{
    login.post("/login",(req,res)=>{
        var secret_key = process.env.SECREAT;
        var body = req.body;
        console.log(body);
        
        if (body.Email !== undefined && body.Password !== undefined){
            knex.select('*').from("users").where('email',req.body.Email)
            .then((data)=>{
                if (data.length>0){
                    if (data[0].password==req.body.Password){
                        let token = jwt.sign({id:data[0].id},secret_key)
                        res.cookie("accesscontrolar",token)
                        delete data[0].password
                        // res.send([{Success:data[0]}])
                        res.redirect("/post")
                    }else{
                        res.render(process.cwd() + "/Pages/Error.ejs",{error:"Invalid UserName Password."})
                    }
                }else{
                    res.render(process.cwd() + "/Pages/Error.ejs",{error:"This User Not Exists."})
                }
            }).catch((err)=>{
                console.log(err);
                
               res.send([{Database:"Error In database..."}])
            })
        }else{
            res.send([{Error : "Please fill empty body..."}])
        }
    })

    login.get("/logout",(req, res)=>{
        res.clearCookie("accesscontrolar")
        res.redirect("/login")
    })
    login.get("/login",(req,res)=>{
        if (req.headers.cookie){
            res.redirect("/post")
        }else{
            res.sendFile(process.cwd()+"/Pages/Login.html")
        }
    })
}
