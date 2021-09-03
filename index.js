const express = require('express');
const app = express();
const fs = require('fs/promises');
const axios = require('axios');

app.get('/enderecos/:cep', async (req, res)=>{
  const arquivoLido = await fs.readFile("./enderecos.json");
  const obJson = JSON.parse(arquivoLido);
  console.log(JSON.stringify(obJson));
  if(JSON.stringify(obJson)==="[]"){
    search(req);
    write(search(req), obJson, res);
    return;
  }
  const enderecoEncontrado = obJson.find(item=>
    item.cep.replace("-","") === req.params.cep
  );
  if(enderecoEncontrado){
    res.send("Encontrou");
  } else{
    search(req);
    write(search(req), obJson, res);
  }
});

async function search(req){
  const procura = await axios.get(`https://viacep.com.br/ws/${req.params.cep}/json/`);
  return procura.data;
}
async function write(endereco, arrayEnderecos, res){
  arrayEnderecos.push(endereco);
  fs.writeFile('./enderecos.json', JSON.stringify(arrayEnderecos), (err)=>{
    if(err){
      res.send("Não foi possível adicionar");
    } else{
      res.json(endereco);
    }
  });
}

app.listen(8000);