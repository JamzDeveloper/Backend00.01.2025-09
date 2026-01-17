import { request, response } from "express";
import { OrderModel } from "../models/order.model.js";

const getOrders = async (req=request, res=response) => {
    const result = await OrderModel.find();
    res.json({
        success: true,
        data: result
    });
};

const getOrderId = async (req=request, res=response) => {
    const {orderId} = req.params;
    const result = await OrderModel.findById(orderId);
    res.json({
        success: true,
        data: result
    })
}

const createOrder = async (req=request, res=response) => {
    try{
        const { products, customerId } = req.body;
        const order = await OrderModel.create({
            products,
            customerId
        });
        const orderToJson = order.toJSON();
        res.json({
            success: true,
            message: "Order created successfully",
            data: orderToJson
        })
    }catch(err){
        res.status(500).json({
            message: "Error: Order not created",
            error: err.message
        });
    }
}

export { getOrders, createOrder, getOrderId };