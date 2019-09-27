require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')
const cors = require('cors')
const helmet = require('helmet')
const app = express();

app.use(cors())
app.use(helmet())
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`,
                     `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`,
                      `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];
                      

 app.use(function validateBearerToken(req, res, next) {
   
   const authToken = req.get('Authorization');
   const apiToken = process.env.API_TOKEN;
   
   if (!authToken || authToken.split(' ')[1] !== apiToken){
       return res.status(401).json({error: "unauthorized request"})
   }
   
   next()
 })


function handleGetTypes(req, res) {
  res.json(validTypes)
}

app.get('/types', handleGetTypes)
const PORT = process.env.PORT || 8000;

function handleGetPokemon(req, res){
    let response = POKEDEX.pokemon;

    if(req.query.name){
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        )
    }

    if(req.query.type) {
        response = response.filter(pokemon =>
            pokemon.type.includes(req.query.types)
        )
    }
    res.json(response)
}
app.get('/pokemon',handleGetPokemon)

app.listen(PORT, () => {
});