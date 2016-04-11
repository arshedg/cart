/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.fishcartserver;

import com.butler.service.ReferralDao;
import com.butler.service.RevisionDao;
import com.butler.service.UserDao;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author arsh
 */
@RestController
public class LoginController {
    @Autowired
    RevisionDao revisionDao;
    @Autowired
    UserDao userDao;
    @Autowired
    ReferralDao referalDao;
    @RequestMapping("/appversion")
    public String versionInfo(){
        return revisionDao.getAppVersion()+"";
    }
    @RequestMapping("/register")
    public String register(@RequestParam(value="name") String name,
                            @RequestParam(value="no") String no,
                            @RequestParam(value="referred") String referred){
        if(name==null) return "Please enter your name";
        if(no==null||no.trim().length()!=10){
            return "Numbered doesn't looks correct, please try again";
        }
        Long number;
        try{
           number = Long.parseLong(no);
        }catch(Exception ex){
            return "Numbered doesn't looks correct, please try again";
        }        
        String response = userDao.saveUser(name, number);
        if(response!=null)
        {
            addReferre(number.toString(), referred);
            return "SUCCESS:"+response;
        }
        return "something went wrong. Please call us on 7204368605";
        
    }
    @RequestMapping("/updateuser")
    public String updateUser(HttpServletRequest request,HttpServletResponse response,@RequestParam(value="name") String name,@RequestParam(value="address") String address,
                                @RequestParam(value="number") String number) throws IOException, ServletException{
        userDao.updateUser(name, address, number);
        return "update successfull.Refresh the page to see changes";
    }
    @RequestMapping("/generatePassword/{number}")
    public String generatePassword(@PathVariable Long number){
        boolean hasPassword = userDao.hasPassword(number.toString());
        if(hasPassword){
            //migration mismatch - need to inform the user
            return "password exist";
        }
        return userDao.updatePassword(number.toString());
        
    }
    private void addReferre(String no,String referred){
        if(referred==null||"".equals(referred.trim())){
            return;
        }
        try{
            Long.valueOf(referred);
        }
        catch(Exception ex){
            return;
        }
        referalDao.saveReferral(no, referred);
    }
}