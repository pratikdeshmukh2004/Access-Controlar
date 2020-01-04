const express = require("express")
require("dotenv").config()
const bodyparser = require("body-parser")
const app = express()
const jwt = require("jsonwebtoken")
aws = require("aws-sdk"),
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.REGION
});
var s3 = new aws.S3();
app.use(bodyparser())
fileUpload = require("express-fileupload");
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))
// knex connnetion
const knex = require("knex")({
    client : "mysql",
    connection:{
        host : process.env.HOST,
        user : process.env.USER_NAME,
        password : process.env.PASSWORD,
        database : process.env.DB_NAME
    }
})


require("./Routes/Databases")(knex)

app.use(superadmin = express.Router())
require('./Routes/Signup')(superadmin,knex,jwt,process.env.SECREAT)

app.use(login = express.Router())
require('./Routes/Login')(login,knex,jwt,process.env.SECREAT)

app.use(upload = express.Router())
require ('./Routes/Upload')(upload,knex,jwt,s3);

app.use(posts = express.Router())
require("./Routes/Getposts")(posts,knex,jwt)

app.use(delpost = express.Router())
require("./Routes/Deletepost")(delpost,knex,jwt,s3)

app.use(editpost = express.Router())
require("./Routes/Editpost")(editpost,knex,jwt,s3)

app.use(deluser = express.Router())
require("./Routes/Deluser")(deluser,knex,jwt)

app.use(giverole = express.Router())
require("./Routes/Giverole")(giverole,knex,jwt)

app.use(Company = express.Router())
require("./Routes/Company")(Company,knex,jwt)


app.get('/',(req,res)=>{
    res.redirect('/login')
})
app.listen(process.env.PORT,()=>{
    console.log(`server is listning on port ${process.env.PORT}`)
})