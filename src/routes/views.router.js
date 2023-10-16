import { Router } from "express"


const router = Router();


router.get('/register',async(req,res)=>{
    res.render('register');
})

router.get('/login',async(req,res)=>{

    if (req.session.user)
        res.redirect('/api/products')
   res.render('login')
})

router.get('/',(req,res)=>{
    if (!req.session.user)
        res.redirect('/login')
    res.render('profile', {user: req.session.user})
 })

 router.get('/reset',async(req,res)=>{
    res.render('reset')
 })

 export default router;