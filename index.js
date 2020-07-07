const express = require('express')
const grabity = require('grabity')
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

let port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use("/", router);

router.get('/', (req, res) => {
  res.send('Hello')
})

async function getMetaData(url) {
  if (url) {
    const metaData = await grabity.grabIt(url)
    return metaData
  } else {
    return
  }
}

router.post('/', async (req, res) => {
  const url = req.body.url
  const meta = await getMetaData(url)
  res.send(meta)
})


app.listen(port, () => {
  console.log('server is listening')
})