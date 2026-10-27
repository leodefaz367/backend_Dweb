// Importación de librerías
const express = require('express')
const {engine} = require('express-handlebars')
const path = require('path')

const app = express()

app.use(express.json())

app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname,"views"))


// Manejo de rutas
app.get('/',(req,res)=>{
    res.send("Amazon - Página principal")
})

app.get('/dashboard',(req,res)=>{
    res.send("Dashboard de Amazon - Tus pedidos")
})


// Manejo de request en Express
app.post('/login',(req,res)=>{
    const {user,email} = req.body
    const response = user ==="leonardo" && email=="leonardo@hotmail.com" ? true : false
    response ? res.status(200).json(`Bienvenido ${user}, inicio de sesión exitoso en Amazon`) : res.status(401).json("Credenciales inválidas")
})

app.get('/products/:id',(req,res)=>{
    const {id}= req.params
    const productsBDD = [
        {
            id: 1,
            title: "Laptop Dell",
            price: 1099.99,
        },
        {
            id: 2,
            title: "iPhone 16",
            price: 899.99,
        }
    ]
    const response = productsBDD.find(product => product.id === +id)
    response ? res.status(200).json(response) : res.status(404).json("Producto no encontrado")
})

app.get('/departamento/:categoria/accesorios/:tipo', (req, res) => {
    const { categoria, tipo } = req.params
    if (categoria !== "tecnologia") {
        return res.status(404).json("Departamento no encontrado")
    }
    const responses = {
        "cargadores": "Cargadores y cables para tecnología",
        "fundas": "Fundas y protectores",
        "audifonos": "Audífonos y accesorios de audio"
    }
    const response = responses[tipo] || "Accesorio no encontrado"
    res.status(200).json(response)
})

app.get('/search',(req,res)=>{
    const { q } = req.query;
    const responses = {
        "laptop": "Resultados para Laptops en Amazon",
        "iphone": "Resultados para iPhone en Amazon"
    }
    const response = responses[q?.toLowerCase()] || "No se encontraron resultados para tu búsqueda"
    const status = responses[q?.toLowerCase()] ? 200 : 404
    res.status(status).send(response);
})


// Manejo de response en Express
app.get('/carrito/simple',(req,res)=>{
    res.send("Carrito vacío")
})

console.log(__dirname)
app.get('/carrito/logo',(req,res)=>{
    res.sendFile('./carrito.png',{
        root:__dirname
    })
})

app.get('/carrito/info',(req,res)=>{
    res.sendFile('./guantes.docx',{
        root:__dirname
    })
})

app.get('/carrito/resumen',(req,res)=>{
    res.status(200).json({
        "productos": 2,
        "total": 1999.98,
        "moneda": "USD"
    })
})

app.get('/ofertas',(req,res)=>{
    res.render('home')
})


// Manejo de middlewares
app.get('/checkout',(req,res)=>{
    res.send("Proceder al pago - Amazon")
})

// Middleware que valida solo para /pago
app.use('/pago', (req, res, next) => {
    const { email, password } = req.body

    console.log("Email:", email, email === "leonardo@hotmail.com")
    console.log("Password:", password, password === "12345")

    if (email === "leonardo@hotmail.com" && password === "12345") {
        return next()
    }

    return res.send("Usuario no registrado para finalizar compra")
})

app.post('/pago',(req,res)=>{
    res.send(`Pago autorizado - ${req.body.email}`)
})



app.listen(3000)
console.log('Servidor ejecutandose en el puerto 3000')
