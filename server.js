const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/rallyCars', {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=> console.log("Connected to MongoDB"))
    .catch(err => console.log("Could not connect to MongoDB", err));

const rallyCarSchema = new mongoose.Schema({
    name:String,
    horsepower:String,
    weight:String,
    config:String
});

const rallyCar = mongoose.model('rallyCar', rallyCarSchema);

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/rallyCars', (req,res)=>{
    getRallyCars(res);
});

async function getRallyCars(res){
    const rallyCars = await rallyCar.find();
    console.log(rallyCars);
    res.send(rallyCars)
}

app.get('/api/rallyCars/:id', (req,res)=>{
    // const rallycar = rallyCars.find(r => r.id === parseInt(req.params.id));
    // if(!rallycar) res.status(404).send("Rally Car with given id was not found");
    // res.send(rallycar);

    getRallyCar(req.params.id, res);

});

async function getRallyCar(id, res){
    const rallycar = await rallyCar.findOne({_id:id});
    console.log(rallycar)
    res.send(rallycar);
}

app.post('/api/rallyCars', (req,res)=>{
    const result = validateRallyCar(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const rallycar = {
        id:rallyCars.length+1,
        name:req.body.name,
        horsepower:req.body.horsepower,
        weight:req.body.weight,
        config:req.body.config
    };

    rallyCars.push(rallycar);
    res.send(rallycar);
});

app.put('/api/rallyCars/:id' ,(req,res)=>{
    const rallycar = rallyCars.find(r=>r.id === parseInt(req.params.id));

    if(!rallycar) res.status(404).send("Rally Car with given id was not found");

    const result = validateRallyCar(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    rallycar.name = req.body.name;
    rallycar.horsepower = req.body.horsepower;
    rallycar.weight = req.body.weight;
    rallycar.config = req.body.config;
    res.send(rallycar);
});

app.delete('/api/rallyCars/:id',(req,res)=>{
    const rallycar = rallyCars.find(r=>r.id === parseInt(req.params.id));

    if(!rallycar){
        req.status(404).send("This Rally car was not found");
    }

    const index = rallyCars.indexOf(rallycar);
    rallyCars.splice(index,1);

    res.send(rallycar);
})

function validateRallyCar(rallyCars){
    const schema = {
        name:Joi.string().min(3).required(),
        horsepower:Joi.string().min(3).required(),
        weight:Joi.string().min(3).required(),
        config:Joi.string().min(3).required()
    };

    return Joi.validate(rallyCars,schema);
}

app.listen(3000, ()=>{
    console.log("listening on port 3000")
});



