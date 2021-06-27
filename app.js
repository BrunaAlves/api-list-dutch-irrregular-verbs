//Cria servidor
var cors = require('cors')
var corsOptions = {
    origin: '*',
    methods: "GET, PUT, POST, DELETE"
}

const express = require('express');
const app = express();

app.use(cors(corsOptions));

//Connect com o mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DutchIrregularVerbs', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.info("Connect with database")
});

//Collection
const verbsSchema = new mongoose.Schema({
    id: String,
    en: {
      infinitive: String
    },
    nl: {    
      infinitive: String,
      perfectum: String,
      imperfectum: String
    },
    data: {
      wrongAnswerCount: String,
      correctAnswerCount: String
    }
  });

  const Verbs = mongoose.model('verbs', verbsSchema);

//Registra API
app.get('/list/:word', async (req, res) => {
  let word = req.params.word;
  
  
  const query = await Verbs.find({ 
        $or: [{ 
            "en.infinitive": {
                     $regex:`.*${word}.*`, $options: "i"
                }
        },{ 
            "nl.infinitive": {
                     $regex:`.*${word}.*`, $options: "i"
                }
        }] 
    }).exec();

   res.status(200).send(query);
 
});

app.listen(3030, () => {
    console.log('Api started at *:3030');
});