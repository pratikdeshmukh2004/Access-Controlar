module.exports = (app, knex, jwt) => {
    app.post("/deleteuser", (req, res) => {
        var body = req.body;
        if (body.Email !== undefined) {
            if (req.headers.cookie) {
                var token = req.headers.cookie.slice(16);
                jwt.verify(token, process.env.SECREAT, (err, data) => {
                    if (!err) {
                        if (data.id == 1) {
                            knex.select("*").from("users").where("email", body.Email)
                                .then((data) => {
                                    if (data.length == 1) {
                                        knex.select("*").from("users").where("email", body.Email).del()
                                            .then((id) => {
                                                res.redirect("/post")
                                            })
                                    } else {
                                        res.render(process.cwd() + "/Pages/Error.ejs",{error:"This User Not Exists."})
                                    }
                                })
                        } else {
                            res.redirect("/login")
                        }
                    }
                })
            } else {
                res.render(process.cwd() + "/Pages/Error.ejs",{error:"Only Super Admin Can delete User"})
            }
        } else {
            res.send([{ Error: "Please fill body..." }])
        }
    })
    app.get("/deleteuser", (req, res) => {
        if (req.headers.cookie) {
            var token = req.headers.cookie.slice(16);
            jwt.verify(token, process.env.SECREAT, (err, data) => {
                if (!err) {
                    knex.select("*").from("users").where("id",data.id)
                    .then((user)=>{
                        if (user.role==="SuperAdmin"){
                            knex.select("*").from("users").where("company",data.company)
                            .then((data)=>{
                                res.render(process.cwd() + "/Pages/Deluser.ejs",{data:data})
                            })
                        }else {
                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"Only Super Admin Can delete User"})
                        }
                    })
                }
            })
        }
    })
}