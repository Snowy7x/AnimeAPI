const express = require("express")
const axios = require("axios");
const app = express()
const cors=require("cors");
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/ar/v1", require("./routes/ar/v1"))
app.use("/ar/v2", require("./routes/ar/v2"))

app.listen(4444, err => {
    if (err) return console.log("Error: ", err)
    console.log("Listening on port: 3069")
})
