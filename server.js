const { Pool } = require('pg');
const express= require('express');
const app=express();
app.use(express.json())
require('dotenv').config();
const port=process.env.PORT;


/*EN https://vercel.com/dashboard/sergio-s-projects-f6a8a2d1/stores/postgres/store_Wrn0gILjK7zR8tuR/data
SEGUIR ESTE FORMATO CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    lastname VARCHAR(50),
    notes TEXT
)
*/

const pool = new Pool({
    user: 'default',
    host: 'ep-orange-smoke-08960365.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'bf3BTmnKYd4P',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});




const API_KEY=process.env.API_KEY;


const apikeyvalidation=(req,res,next)=>{
    const userapikey=req.get('x-api-key');
    if (userapikey && userapikey===API_KEY){
        next();
    } else {
        res.status(401).send('Invalid API key');
    }
};

app.use(apikeyvalidation)


app.listen(port, ()=>{
    console.log('The app is running on port: ', port)
})


app.get('/students', function(req,resp){
    const listUsersQuery = `SELECT * FROM students;`;
    pool.query(listUsersQuery)
    .then(res => {
    return resp.status(200).send(
        {
            users:res.rows,
            code:'Busqueda exitosa'
        })
    })
    .catch(err=>{
        console.error(err);
        res.status(400)
        res.send('Hubo un error al buscar la informacion')
    }) 
})


app.get('/students/:id', function(req,resp){
            const id=req.params.id;
            const select = `SELECT *FROM students WHERE id='${id}';`;
            pool.query(select)
            .then(res => {
                return resp.status(200).send({
                    users:res.rows,
                    code:'Busqueda exitosa'
                }) 
            })
            .catch(err=>{
                console.error(err);
                res.status(400)
                res.send('Hubo un error al buscar la informacion')
            }) 
})

app.put('/students/:id', function(req,resp){
    const id=req.params.id;
    const update = `UPDATE students SET id=${req.body.id}, name='${req.body.name}', lastname='${req.body.lastname}', notes='${req.body.notes}' WHERE id='${id}';`;
    pool.query(update)
    .then(res => {
        console.log(res.rows)
        return resp.status(201).send({
            code:'Informacion cambiada'
        })  
    })
    .catch(err=>{
    console.error(err);
    res.status(400)
    res.send('Hubo un error al actualizar la informacion')
}) 
})



app.delete('/students/:id', function(req,resp){
    const id=req.params.id;
    const Delete= `DELETE FROM students WHERE id='${id}';`;
    pool.query(Delete)
    .then(res => {
        console.log(res.rows)
        return resp.status(204).send({
            code:'Informacion eliminada'
        })
    })
    .catch(err=>{
        console.error(err);
        res.status(400)
        res.send('Hubo un error al eliminar la informacion')
    }) 
})


   

app.post('/students', function(req, resp){
    const insertar= `INSERT INTO students (id,name,lastname,notes) VALUES(${req.body.id},'${req.body.name}','${req.body.lastname}','${req.body.notes}');`;
    pool.query(insertar)
    .then(res=>{
    console.log(res.rows)
    return resp.status(201).send({
        code:'Student insert'
    })
}).catch(err=>{
        console.error(err);
        res.status(400)
        res.send('Hubo un error al insertar la informacion')
    })
})