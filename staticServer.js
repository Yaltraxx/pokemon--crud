const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname)); 

app.listen(5501, () => {
    console.log("Servidor de frontend corriendo en http://localhost:5501");
  });