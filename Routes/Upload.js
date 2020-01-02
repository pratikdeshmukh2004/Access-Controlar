module.exports=(app,knex,jwt,s3)=>{
app.post('/upload', function(req, res){
  if (req.headers.cookie){   
    var token = req.headers.cookie.slice(16);
    jwt.verify(token,process.env.SECREAT,(err,t_data)=>{
        if (!err){
          knex.select("*").from("users").where("id",t_data.id)
          .then((user)=>{
            if (user[0].role === "SuperAdmin" || user[0].role === "Admin"){
              console.log(req.files,req.body);
              
              if (req.files !== undefined && req.body.name !== undefined){
                var filename=req.body.name+"."+(req.files.image.mimetype.split("/")[1])
                console.log(filename);
                knex.select("*").from("files").where("file_name",filename)
                .then((isfile)=>{
                  if (isfile.length<1){                    
                  var params = {
                    Bucket: 'acpkaplu',
                    Key: "Pratik/"+filename,
                    Body: req.files.image.data,
                    ACL: 'public-read'                  };

                  s3.putObject(params, function (perr, pres) {
                      if (perr) {
                        res.send(perr);
                      } else {
                        knex("files").insert({user_id:t_data.id,file_name:filename,url:"https://acpkaplu.s3.ap-south-1.amazonaws.com/Pratik/"+filename})
                        .then((id)=>{
                          res.redirect("/post")
                        })
                      }
                  });
                  }else{ 
                    res.render(process.cwd() + "/Pages/Error.ejs",{error:"This Post Not Exists."})
                  }
                })
              }else{
                res.render(process.cwd() + "/Pages/Error.ejs",{error:"You Did Not Select Any File."})
              }
            }else{
              res.render(process.cwd() + "/Pages/Error.ejs",{error:"You Don't have access to add Post."})
            }
          })
        }else{
         res.redirect("/login")
        }
      })
    }else{
      res.redirect("/login")
    }
  });
  app.get("/upload",(req,res)=>{
    if (req.headers.cookie){
      res.sendFile(process.cwd()+"/Pages/Upload.html")
    }else{
      res.redirect("/login")
    }
  })
}
