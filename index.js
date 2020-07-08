const express = require('express')
const grabity = require('grabity')
const axios = require('axios')
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

let port = process.env.PORT || 4000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use("/", router);

router.get('/', (req, res) => {
  res.send('Hello')
})

let articles = {
  articlesData: {},
  totalPages: 0
}

const baseURL = 'https://hacker-news.firebaseio.com/v0'

async function getAllArticles() {
  const articleIds = await axios.get(`${baseURL}/beststories.json`)
    .then(res => res.data)
    .catch(err => {
      console.log(err)
    })

  return articleIds
}

async function getArticleData(id) {
  const articleData = await axios.get(`${baseURL}/item/${id}.json`)
    .then(res => res.data)
    .catch(err => {
      console.log(err)
    })
  return articleData
}

async function getData() {
  const listOfIds = await getAllArticles()
  console.log(listOfIds)
  for (const id of listOfIds) {
    articles.articlesData[id] = await getArticleData(id)
  }
  articles.totalPages = Math.floor(listOfIds.length / 30)
  console.log('done')
}

getData()
setInterval(async () => {
  getData()
}, 600000)


async function getMetaData(url) {
  if (url) {
    const metaData = await grabity.grabIt(url)
    return metaData
  } else {
    return
  }
}

router.post('/meta', async (req, res) => {
  const url = req.body.url

  // if (!query)
  const meta = await getMetaData(url)
  res.send(meta)
})

router.post('/articles', (req, res) => {
  const query = req.body.query
  const page = req.body.page

  let filtered = Object.values(articles.articlesData)
  if (query) {
    filtered = filtered.filter(article => article.title.toLowerCase().includes(query))
  }
  console.log(filtered)
  
  if (page === 1) {
    filtered = filtered.slice(0, 30)
  } else if (page > 1 && page < articles.totalPages) {
    filtered = filtered.slice((page-1)*30, page*30)
  } else {
    filtered = filtered
  }

  res.send(filtered)
})


app.listen(port, () => {
  console.log('server is listening')
})