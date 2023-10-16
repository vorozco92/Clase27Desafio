import fs from "fs";

class ProductManager {
    
    constructor(path) {
        this.path = path;
        this.products = [];
        
    }
    
    addProduct=(product)=>{
        this.actionProduct(product);
    }

    editProduct=(product)=>{
        this.actionProduct(product, true);
    }

    actionProduct=( product, edit = false)=>{

        let pIndex = 0;
        let id_p = 1;
        if ((! product.id && edit) || ! product.title.trim().length || ! product.description.trim().length || ! product.price > 0 ||  ! product.thumbnail.trim().length || ! product.code.trim().length  || ! product.stock > 0)
            return;        

        if (! fs.existsSync(`${this.path}`)){

            if (! edit)
                product = {...{id: id_p},...product};            

            let product_list = []
            product_list.push(product);
            let result = JSON.stringify(product_list, null,'\t');
            //console.log(result);
            fs.writeFile(`${this.path}`, result, 'utf-8',(error,resultado)=>{ if (error) console.log('No fue posible crear el archivo.')});
        }
        else{
            fs.readFile(`${this.path}`,'utf-8', (error,resultado)=>{
                if (error) return console.log('Error al leer el archivo');
                let product_list = JSON.parse(resultado);
                if (edit){
                    pIndex  = product_list.findIndex(prod => prod.id === product.id);
                    if (pIndex === -1){
                        console.log('No existe para su edición');
                        return
                    }
                    product_list[pIndex] = product;
                }
                else{
                    let endProd = product_list.findLast(prod => prod.id > 0);
                    let product_new = {...{id: (endProd.id+1)},...product}
                    product_list.push(product_new);
                }
 
                fs.writeFile(`${this.path}`, JSON.stringify(product_list),'utf-8',(error,resultado)=>{ if (error) console.log('No fue posible crear el archivo.')}); 
            });
        }
  
        return true;
    }

    getProducts=async()=>{ 
        let list = await this.readProductList();  
        console.log(list);    
        return list;   
    }

    readProductList=async()=>{
        if (! fs.existsSync(`${this.path}`))
            return [];
        
        return fs.readFileSync(`${this.path}`,'utf-8', (error,resultado)=>{
            if (error) return console.log('Error al leer el archivo');
            return JSON.parse(resultado);   
        });      
    }

    getProductById=(id)=>{
        let data = fs.readFileSync(`${this.path}`,'utf-8');
        if (! data)
            return {}
        let product_list = JSON.parse(data);
        let pIndex  = product_list.findIndex(prod => prod.id === id);
        if (pIndex === -1){
            console.log('Producto no existe en listado');
            return
        }
        return product_list[pIndex];
    }

    deleteProductById=(id)=>{
        let data = fs.readFileSync(`${this.path}`,'utf-8');
        if (! data)
            return {}
        let product_list = JSON.parse(data);
        let pIndex  = product_list.findIndex(prod => prod.id === id);
        if (pIndex === -1){
            console.log('Producto no existe en listado');
            return
        }
        console.log('index deletle'+pIndex)
        product_list.splice(pIndex, 1)
        console.log('lid delete')
        console.error(product_list);
        fs.writeFileSync(`${this.path}`, JSON.stringify(product_list),'utf-8',(error,resultado)=>{ if (error) console.log('No fue posible crear el archivo.')}); 
    }

}

export default ProductManager;