const http = require('http');
const {v4: uuidv4} = require('uuid');
const errHandle = require('./errorHandle');
const todos =[]; //先把資料暫存在node.js的記憶體上去做讀取

const requestListener = (req,res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    let num = 0;
    req.on('data',chunk=>{
        body+=chunk;
    })
    
    if(req.url =="/todos"  && req.method == 'GET'){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"successful!",
            "data": todos,
        }));
        res.end();
    }else if (req.url =="/todos"  && req.method == 'POST'){
        req.on('end',()=>{
            try{
                const title = JSON.parse(body).title;
                if (title !== undefined){
                    const todo = {
                        "title":title,
                        "id": uuidv4()
                    };
                    todos.push(todo);
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                    "status":"successful!",
                    "data": todos,
                    }));
                    res.end();
                }else{
                    errHandle(res)
                }
            }catch(error){
                errHandle(res)
            }
        })  
     
    
    }else if(req.url =="/todos" && req.method == 'DELETE'){
        todos.length = 0; // 刪除的關鍵語法
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"successful!",
            "data": todos,
        }));
        res.end();
     }else if(req.url.startsWith("/todos/") && req.method =="DELETE"){
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id);
        if(index !== -1){
            todos.splice(index,1);
            res.writeHead(200,headers),
            res.write(JSON.stringify({
                "status":"successful!",
                "data":todos,
            }));
            res.end();
        }else{
            errHandle(res);
        }
        
    }else if(req.url.startsWith("/todos/") && req.method=="PATCH"){
        req.on('end',()=>{
            try{
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id ==id)
                if(todo !== undefined && index !== -1){
                    todos[index].title = todo;
                    res.writeHead(200,headers),
                    res.write(JSON.stringify({
                        "status":"successful!",
                        "data":todos,
                    }));
                    res.end();
                }else{
                    errHandle(res);
                }
            }catch{
                errHandle(res);
            }
        })
    }else if(req.method == 'OPTIONS'){
        res.writeHead(200,headers);
        res.end();
    }else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status":"false",
            "message":"無此網站路由"
        }));
        res.end()
    }
}

const server1 = http.createServer(requestListener);
server1.listen(3005); // 127.0.0.1:3005 // local host 127.0.0.1



