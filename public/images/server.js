var express = require('express')
var axios = require('axios')
var app = express()
var path = require('path')

const HTML_CLIENT = 'angular-client'

app.set('view engine', 'pug')

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/front.html'));
})

app.get('/searchahead', function (req, res) {
axios.get('https://www.mapquestapi.com/search/v3/prediction?&limit=5&collection=adminArea,poi,address,category,franchise,airport&q=den', {
    params: {
      key: '3PGmI1qMtvRxfCRA7FEpSxBKjFqVCX29'
    }
  }) 
  .then(function (response) {
   res.json(response.data);
   console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
});
app.listen(3001)
