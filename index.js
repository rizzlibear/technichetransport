import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ejs from 'ejs';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = 'mongodb+srv://amarkrish873:oshkashbagash@transport.uxhpj.mongodb.net/transport?retryWrites=true&w=majority&appName=transport';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => console.log("Failed to connect to the database: ", err));

const { Schema } = mongoose;

const transportSchema = new Schema({
  registrationno: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Transport = mongoose.model('Transport', transportSchema);

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {
    try {
        const t = new Transport({
            registrationno: req.body.registrationno,
            from: req.body.from,
            to: req.body.to,
            location: req.body.location
        });

        await t.save();
        res.redirect('/');
    } catch (err) {
        console.error("Error saving vehicle:", err);
        res.status(500).send("Error saving vehicle");
    }
});

app.get('/', async (req, res) => {
    try {
        const transports = await Transport.find();
        res.render('home', { transports });
    } catch (err) {
        console.error("Error fetching transports:", err);
        res.status(500).send("Error fetching transports");
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        const transportItem = await Transport.findById(req.params.id);
        if (transportItem) {
            res.render('edit', { transport: transportItem });
        } else {
            res.status(404).send("Transport item not found");
        }
    } catch (err) {
        console.error("Error fetching transport for edit:", err);
        res.status(500).send("Error fetching transport for edit");
    }
});

app.post('/edit/:id', async (req, res) => {
    try {
        const updatedTransport = await Transport.findByIdAndUpdate(req.params.id, {
            registrationno: req.body.registrationno,
            from: req.body.from,
            to: req.body.to,
            location: req.body.location
        }, { new: true });

        if (updatedTransport) {
            res.redirect('/');
        } else {
            res.status(404).send("Transport item not found");
        }
    } catch (err) {
        console.error("Error updating transport:", err);
        res.status(500).send("Error updating transport");
    }
});
