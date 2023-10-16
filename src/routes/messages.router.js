import {Router} from "express"
import Messages  from "../dao/dbManagers/messages.js";


const router = Router();
const messagesManager = new Messages();

router.get('/',async(req,res)=>{

    req.app.io.on('connection', socket => {
        console.log("Nuevo cliente conectado")
      
        socket.on('message', data => {
            //messages.push(data);
            console.log(data)
            messagesManager.addMsg(data).then((result) => {
                let messages = messagesManager.getAll().then((result) => {
                    req.app.io.emit('messagesLogs',result);  
                    console.log('messaes tow::'+result)   
                
                }).catch((err) => {
                    
                });
            });
           
        })
    
        socket.on('newUser', data => {
            console.log('Se conecto un nuevo usuario');
            socket.broadcast.emit('newUserFront',data);
            console.log(data)
            let messages = messagesManager.getAll().then((result) => {
                req.app.io.emit('messagesLogs',result);  
                console.log('messaes:'+result)   
            }).catch((err) => {
                
            });
                    
        })
        
    })


    res.render('chat',{'messages':[]})
})



export default router;