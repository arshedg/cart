/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.fishcartserver;

import com.butler.service.OrderDao;
import com.butler.service.PushNotifier;
import com.butler.service.UserDao;
import com.fishcart.order.OrderDetails;
import java.util.logging.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author arsh
 */
@RestController
public class OrderController {
    @Autowired
    OrderDao orderDao;
    @Autowired
    UserDao userDao;

    @RequestMapping("/placeOrder")
    public String placeOrder(@RequestParam(value="number") String number,
            @RequestParam(value="product") String productID,
            @RequestParam(value="quantity") float quantity,
            @RequestParam(value="immediate", required = false) boolean isExpress,
            @RequestParam(value="slot", required = false) String slot,
            @RequestParam(value="address",required=false)String address)
    {
        
        try{
            validateNumber(number);
            initUser(number,address);     
            long value = orderDao.placeOrder(number, productID, quantity,isExpress,slot);
            alertDelivery(number, productID, quantity);
            return "SUCCESS:"+value;
        }catch(NumberFormatException exception){
            return "<span style='color:red'>Your phone number doesn't looks correct.For support contact us on 9605657736</span>";
        }
        catch(Throwable e){
            alertError(number, productID, quantity, e);
             java.util.logging.Logger.getLogger(OrderController.class.getName()).log(Level.SEVERE, null, e);
            return "something went wrong";
        }
        
        //return "<span style='color:red'>Your order is succesfully placed with us. Please pay the amount when the product is delivered. For queries contact us on 9605657736</span>";
    }
     @RequestMapping("/orders/details")
    public OrderDetails getOrderDetails(@RequestParam(value="items") String items){
        return orderDao.getOrdersFromIds(items);
    }
    private void alertError(String number,String product,float units,Throwable throwable){
        String text="Order placeing failed."+"User:"+userDao.getName(number)+". Contact number"+number+
                "product:"+product;
        
    }
    private void alertDelivery(String number,String product,float units){
        PushNotifier.sendNotification();
    }

    private boolean initUser(String number,String address) {

       if(userDao.doesNumberExist( Long.valueOf(number))){
           userDao.updateAddress(address, number);
           return true;
       }
       userDao.saveUser("Auto generated", Long.valueOf(number));
       return true;
    }

    private void validateNumber(String number) {
        Long value = Long.valueOf(number.trim());
        if(value<5000000000l){
            throw new NumberFormatException();
        }
    }
}
