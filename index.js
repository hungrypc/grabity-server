const express = require('express')
const app = express()
let port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(port, () => {
  console.log('server is listening')
})