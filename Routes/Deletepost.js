module.exports = (app, knex, jwt,s3) => {
    app.get("/deletepost/:postid", (req, res) => {
        if (req.headers.cookie) {
            var token = req.headers.cookie.slice(16);
            jwt.verify(token, process.env.SECREAT, (err, t_data) => {
                if (!err) {
                    knex.select("*").from("users").where("id", t_data.id)
                        .then((data) => {
                            if (data[0].role === "SuperAdmin" || data[0].role === "Admin") {
                                knex.select("*").from("files").where("id", req.params.postid)
                                    .then((data) => {
                                        if (data.length > 0) {
                                            var params = {
                                                Bucket: 'acpkaplu',
                                                Key: "Pratik/" + data[0].file_name,
                                            };
                                            s3.deleteObject(params, function (perr, pres) {
                                                if (perr) {
                                                    res.send(perr);
                                                } else {
                                                    knex.select("*").from("files").where("id", req.params.postid).del()
                                                        .then(() => {
                                                            res.redirect("/post")
                                                        })
                                                }
                                            });
                                        } else {
                                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"This Post Not Exists."})
                                        }
                                    })
                            } else {
                                res.render(process.cwd() + "/Pages/Error.ejs",{error:"Can You Ask To Super Admin."})
                            }
                        })
                } else {
                    res.redirect("/login")
                }
            })
        } else {
            res.redirect("/login")
        }
    })
}