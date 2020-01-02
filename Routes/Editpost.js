module.exports = (app, knex, jwt, s3) => {
    app.post("/editpost/:postid", (req, res) => {
        if (req.headers.cookie) {
            var token = req.headers.cookie.slice(16);
            jwt.verify(token, process.env.SECREAT, (err, t_data) => {
                if (!err) {
                    knex.select("*").from("users").where("id", t_data.id)
                        .then((data) => {
                            if (data[0].role === "SuperAdmin" || data[0].role === "Admin" || data[0].role === "Editor") {
                                knex.select("*").from("files").where("id", req.params.postid)
                                    .then((data) => {
                                        if (data.length > 0) {
                                            if (req.files !== undefined && req.body.name !== undefined) {
                                                var filename = req.body.name + "." + (req.files.image.mimetype.split("/")[1])
                                                console.log(filename);
                                                knex.select("*").from("files").where("file_name", filename)
                                                    .then((isfile) => {
                                                        if (isfile.length == 0) {
                                                            var params = {
                                                                Bucket: 'acpkaplu',
                                                                Key: "Pratik/" + filename,
                                                                Body: req.files.image.data,
                                                                ACL: 'public-read'
                                                            };

                                                            s3.putObject(params, function (perr, pres) {
                                                                if (perr) {
                                                                    res.send(perr);
                                                                } else {
                                                                    var params = {
                                                                        Bucket: 'acpkaplu',
                                                                        Key: "Pratik/" + data[0].file_name,
                                                                    };
                                                                    s3.deleteObject(params, function (perr, pres) {
                                                                        if (perr) {
                                                                            res.send(perr);
                                                                        } else {
                                                                            knex("files").update({ user_id: t_data.id, file_name: filename, url: "https://acpkaplu.s3.ap-south-1.amazonaws.com/Pratik/" + filename }).where("id", req.params.postid)
                                                                                .then((id) => {
                                                                                    res.redirect("/post")
                                                                                })
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        } else {
                                                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"This Post Already Exists Please Change Name"})
                                                        }
                                                    })
                                            }
                                        } else {
                                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"This Post Not Exists."})
                                        }
                                    })
                            } else {
                                res.render(process.cwd() + "/Pages/Error.ejs",{error:"You Don't Have Access TO Edit."})
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

    app.get("/editpost/:postid", (req, res) => {
        if (req.headers.cookie) {
            var token = req.headers.cookie.slice(16);
            jwt.verify(token, process.env.SECREAT, (err, t_data) => {
                if (!err) {
                    knex.select("*").from("users").where("id", t_data.id)
                        .then((data) => {
                            if (data[0].role === "SuperAdmin" || data[0].role === "Admin" || data[0].role === "Editor") {
                                knex.select("*").from("files").where("id", req.params.postid)
                                    .then((data) => {
                                        if (data.length > 0) {
                                            res.render(process.cwd() + "/Pages/Edit.ejs", { postId: req.params.postid })
                                        } else {
                                            res.render(process.cwd() + "/Pages/Error.ejs",{error:"This Post Not Exists."})
                                        }
                                    })
                            } else {
                                res.send([{ Acess: "You Don't Have Access TO Edit" }])
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