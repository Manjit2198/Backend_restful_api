const Order   = require("../models/order");
const Product = require("../models/product");
const mongooose= require("mongoose");


// get the list of all the orders
exports.order_get_all = (req, res, next)=> {
    Order.find()
    .select("productId quantity _id")
    .populate("productId", "name")
    .exec()
    .then(docs=>{
     res.status(200).json(docs.map(doc=>{
         return{
             _id: doc._id,
             productId: doc.productId,
             quantity: doc.quantity,
             request:{
                 type: "GET",
                 url: "http://localhost:3090/orders/" + doc._id
             }
         }
     })); 
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}


// create new order
exports.order_create_order = (req, res, next)=> {
    
    Product.findById(req.body.productId)
    
    
    .then(productId=>{
        if(!productId){
           return res.status(404).json({
               
               message:"Product not found"
           });
        }console.log("hyy");
        const order = new Order({
            _id: mongooose.Types.ObjectId(),
            productId: req.body.productId,
            quantity:req.body.quantity
            
        });
        return order.save();
    })
    .then(result => {
        res.status(201).json({
            message:"Order Stored",
            createdOrder:{
                _id: result._id,
                productId: result.productId,
                quantity: result.quantity 
            },
            request:{
                type: "GET",
                url: "http://localhost:3090/orders/"+ result._id
            }
        })
    })
    .catch(err =>{
        console.log(err);
       return res.status(500).json({
            error:err
        })
    })
}


// get a particular order 
exports.order_get_order = (req, res, next)=>{
    Order.findById(req.params.orderId)
   .populate("productId")
   .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message:"Order not found"
            });
        }
        res.status(200).json({
            order: order,
            request:{
                type:"GET",
                url:"http://localhost:3090/orders"
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err 
        })
    })
}


// delete the order
exports.order_delete = (req, res, next)=>{
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"Order deleted",
            request:{
                type:"POST",
                url: "http://localhost:3090/orders",
                body:{productId: "ID", quantity: "Number"}
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
    }