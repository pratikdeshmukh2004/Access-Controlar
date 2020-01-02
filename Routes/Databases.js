module.exports = (knex)=>{
    const mysql = require("mysql")
    var con = mysql.createConnection({  
        host: process.env.HOST ,  
        user: process.env.USER_NAME,  
        password : process.env.PASSWORD
    })    


    // to create database if not exists
    con.connect((err)=>{
        if (err){console.log(err)}
        else{ 
            con.query(`create database if not exists ${process.env.DB_NAME}`,(err)=>{
                if (!err){console.log("database created")}
                else{console.log(err)}
            })
        }
    })
    knex.schema.hasTable('users').then((exist)=>{
        if (exist){
            console.log("table already exists")
        }else{
            knex.schema.createTable("users",(u)=>{
                u.increments("id").primary();
                u.string("email").notNullable();
                u.string("password").notNullable();
                u.string("role").notNullable();
            })
            .then(()=>{console.log("table created")})
            .catch((err)=>{
                console.log(err)
            })
        }
    })

    knex.schema.hasTable('files').then((exist)=>{
        if (exist){
            console.log("table already exists")
        }else{
            knex.schema.createTable("files",(u)=>{
                u.increments("id").primary();
                u.string("user_id").notNullable();
                u.string("file_name").notNullable();
                u.string("url").notNullable()
            })
            .then(()=>{console.log("table created")})
            .catch((err)=>{
                console.log(err)
            })
        }
    })    
}