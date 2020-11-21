const mongoose = require("mongoose");
const Product = require("../models/product");

// get the list of all the products
exports.product_get_all = (req, res, next)=>{
    Product.find().select("name price _id productImage").exec().then(docs =>{
      const response ={
          count:docs.length,
          product:docs.map(doc=>{
              return{
                  name:doc.name,
                  price:doc.price,
                  productImage:doc.productImage,
                  _id:doc._id,
                  request:{
                      type:"GET",
                      url:"http://localhost:3090/products/"+ doc._id
                  }
              }
          })
      };
        if(docs.length>0){
          res.status(200).json(response);
        }else{
            res.status(404).json({
                message: "No entries found"
            })
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err})
    })
  }

  // create a new product
exports.product_create_product = (req, res, next)=> {
    const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         name: req.body.name,
         price: req.body.price,
         productImage: req.file.path
     });
     product
     .save()
     .then(result =>{
         console.log(result);
         res.status(201).json({
             message:"created product successfully",
             
             createdProduct:{
                 name: result.name,
                 price: result.price,
                 _id: result._id,
                 request:{
                     type:"GET",
                     url:"http://localhost:3090/products/"+ result._id
                 }
             }
     })
 })
     .catch(err => {
         console.log(err)
         res.status(500).json({
             error:err
         })
     });
     
     }  

//get a particular product on the basis of productId
exports.product_get_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id).select("name price _id productImage").exec().then(doc =>{
        
        if(doc){
            res.status(200).json({
                product:doc,
                request: {
                    type:"GET",
                    description: "view all products",
                    url: "http://localhost:3090/products"
                }
            });
        }else{
            res.status(404).json({message:"NO valid entry found"})
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err})
    });

}

//update a product
exports.product_update_product = (req, res, next)=>{
    const id = req.params.productId; 
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id:id}, {$set:updateOps})
    .exec().then(result=>{
        console.log(result);
        res.status(200).json({
            message:"product updated",
            description:"view updated product",
            request:{
                type:"GET",
                url:"http://localhost:3090/products/"+ id

            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(404).json({
            error:err
        })
    })
    }
   
// delete a product    
exports.product_delete = (req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id:id}).exec().then(result=>{
        res.status(200).json({
            message:"Product Deleted",
            request:{
                type:"POST",
                url:"http://localhost:3090/products",
                body:{name:"String", price:"Number" }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(404).json(err);
    })
}    