const express = require('express');
const path = require('path');
const app = express();
const filePath = "./dist/index.html";
const resolvedPath = path.resolve(filePath);

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/*', function(req, res) {
  res.sendFile(resolvedPath);
});

app.listen(process.env.PORT || 8080);

console.log(`Server: listening on port ${process.env.PORT || 8080}`);
