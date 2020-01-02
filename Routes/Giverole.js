module.exports = (app, knex, jwt) => {
    superadmin.post("/giverole", (req, res) => {
        var body = req.body
        if (body.Email !== undefined && body.Role !== undefined && body.Role !== 'SuperAdmin') {
            if (req.headers.cookie) {
                var token = req.headers.cookie.slice(16);
                jwt.verify(token, process.env.SECREAT, (err, data) => {
                    if (!err) {
                        if (data.id == 1) {
                            knex.select("*").from("users").where("email", body.Email)
                                .then((data) => {
                                    if (data.length > 0) {
                                        if (data[0].id !== 1) {
                                            knex("users").update({ role: body.Role }).where("email", body.Email)
                                                .then(() => {
                                                    res.redirect("/post")
                                                })
                                        }else{
                                            res.send([{
                                                Error:"This is your email you can't change your role..."
                                            }])
                                        }
                                    } else {
                                        res.render(process.cwd() + "/Pages/Error.ejs",{error:"This User Not Exists."})
                                    }
                                })
                        } else {
                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"Only Super Admin Can Give Role"})
                        }
                    }
                })
            } else {
                res.render(process.cwd() + "/Pages/Error.ejs",{error:"Only Super Admin Can Give Role."})
            }
        } else {
            res.send([{ Error: "You can give role like Admin,User,Viewer,Editer" }])
        }
    })
    app.get("/role", (req, res) => {
        if (req.headers.cookie) {
            var token = req.headers.cookie.slice(16);
            jwt.verify(token, process.env.SECREAT, (err, data) => {
                if (!err) {
                    if (data.id == 1) {
                        knex.select("*").from("users")
                        .then((data)=>{
                            res.render(process.cwd() + "/Pages/Role.ejs",{data:data})
                        })
                    }
                }
            })
        }
    })
}