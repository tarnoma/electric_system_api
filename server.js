const express = require("express");
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")

global.__basedir = __dirname;
var corsOption = {
    origin: "*"
}
app.use(cors(corsOption)) 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res)=>{
    res.json({message: "Welcome to my rest. I'm Nicki."})
});

require("./app/routes/tech.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/device.routes")(app);
require("./app/routes/brand.routes")(app);
require("./app/routes/request.routes")(app);


const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
