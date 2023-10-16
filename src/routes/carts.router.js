import { Router } from "express"
import Carts  from "../dao/dbManagers/carts.js";

const router = Router();
const cartManager = new Carts();

router.get('/',async(req,res)=>{
    let carts = await cartManager.getAll();
    res.send({status:'success',carts:carts})
})

router.post('/',async(req,res)=>{
    const {products} = req.body;
    let cart = {}

    if (products)
        cart.products = products

    let result =await cartManager.addCart(cart)
    res.send({status:'success',cart:result})
})

router.get('/:id', async(req, res)=>{
    let cartId = req.params.id;
    let cart = await cartManager.getCartByIdPopulate(cartId);
    if (cart)
        res.render('carts',{status:'success',products:cart.products})
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
})

router.put('/:id', async(req, res)=>{
    let cartId = req.params.id;
    let cart = await cartManager.getCartById(cartId);
    if (cart){
        let cartBody = req.body;
        let cartEdit = await cartManager.updateCartById(cartId, cartBody);
        res.send({status:'success',cart:cartEdit})
    }
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
})

router.delete('/:cid/products/:pid', async(req, res)=>{
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let cart = await cartManager.getCartById(cartId);
    if (cart){
        let cartEdit = await cartManager.deleteProductInCartById(cartId, productId);
        res.send({status:'success', cart: cartEdit});
    }
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
})

router.put('/:cid/products/:pid', async(req, res)=>{
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let {qty} = req.body;
    let cart = await cartManager.getCartById(cartId);
    if (cart){
        let cartEdit = await cartManager.updateProductInCartById(cartId, productId, qty);
        res.send({status:'success', cart: cartEdit});
    }
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
})

router.delete('/:cid', async(req, res)=>{
    let cartId = req.params.cid;
    let cart = await cartManager.getCartById(cartId);
    if (cart){
        let cartR = await cartManager.deleteProductsInCart(cartId);
        res.send({status:'success', cart: cartR});
    }
    else
        res.send({status:'error','error_description':`carrito con Id ${cartId} no fue encontrado.`})
})

export default router;