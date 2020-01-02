module.exports = (app,knex,jwt)=>{
    app.get("/post",(req,res)=>{
        if (req.headers.cookie){   
            var token = req.headers.cookie.slice(16);
            jwt.verify(token,process.env.SECREAT,(err,t_data)=>{
                if (!err){
                    knex.select("*").from("users").where("id",t_data.id)
                    .then((data)=>{
                        if(data[0].role === "SuperAdmin" || data[0].role==="Editor" || data[0].role==="Viewer" || data[0].role==="Admin"){
                            console.log(data);
                            
                            knex.select("*").from("files")
                            .then((data)=>{
                                res.render(process.cwd()+"/Pages/Home.ejs",{data:data,admin:t_data.id})                          
                            })
                        }else{
                            res.render(process.cwd()+"/Pages/Home.ejs",{data:[],admin:t_data.id})                          
                        }
                    })
                }else{
                    res.redirect("/login")
                }
            })
        }else{
            res.redirect("/login")
        }
    })
}