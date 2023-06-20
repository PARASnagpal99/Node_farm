const fs = require('fs') ;
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const {replaceTemplate} = require('./modules/replaceTemplate');

// 1. Reading and writing files with Node.js
// const path = './txt/input.txt';


// // Blocking synchronous way to read and write files 
// const textIn = fs.readFileSync(path , 'utf-8')
// console.log(textIn);

// const textOut = `This is what we know about the avocado : ${textIn}. \n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File Written!');


// // Non Blocking , asyncronous way to read and write files 
// fs.readFile('./txt/start.txt','utf-8',(err , data1) =>{
//     if(err) return console.log('Error 😢');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err , data2) =>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err , data3) =>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err => {
//                 if(err){
//                     console.log(error)
//                 }else{
//                     console.log('Your file has been written 😁');
//                 }
//             })
//         })
//     })
// })
// console.log('Will read file!');

// 2. Creating a simple web Server with Node.js

// const port = 3000 ;

// // Server is an event emitter that is why we can listen to it and respond to it .
// http.createServer((req , res) => {
//      //console.log(req);
//      // Set the response status and headers 
//      res.statusCode = 200 ;
//      res.setHeader('Content-Type','text/plain');

//      // sending a response 
//      res.end('Hello from the server');
// })
// .listen(port , () =>{
//     console.log(`Server running at http://localhost:${port}/`);
// })



// NODE FARM 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObj = JSON.parse(data);


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')

const slugs = dataObj.map((el) => slugify(el.productName,{lower : true}));
//console.log(slugs);

const server = http.createServer((req,res)=>{
    // console.log(req.url);
    const {query , pathname} = url.parse(req.url,true);
  //  console.log(query,pathname);
    // Overview 
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200,{'Content-type' : 'text/html'});
         
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);       
        //console.log(output);
        res.end(output);
        // Product 
    }else if(pathname === '/product'){
        res.writeHead(200,{'Content-type' : 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);        
        res.end(output);
        // API 
    }else if(pathname === '/api'){
         res.writeHead(200,{'Content-type' : 'application/json'});
         res.end(data);
         // Not Found 
    }else{
        res.writeHead(404 , {
            'Content-type' : 'text/html' ,
            'my-own-header' : 'hello-world' 
        });
        res.end(`<h1>Page not Found</h1>`)
    }
})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to requests on port 8000')
})