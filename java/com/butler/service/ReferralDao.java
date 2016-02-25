/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.SimpleJdbcDaoSupport;
import org.springframework.stereotype.Component;

/**
 *
 * @author arsh
 */
@Component
public class ReferralDao extends SimpleJdbcDaoSupport {
    
    @Autowired
    private UserDao userDao;
    public void saveReferral(String user,String referral){
        if(isAlreadyOrdered(user)){
            //existing customer
            return;
        }
        String query="insert into referral(user,referred_by) values(?,?)";
        this.getSimpleJdbcTemplate().update(query, user,referral);
    }
    
    public String getActiveReferrer(String number){
        String query="select referred_by from referral where user=? and rewarded=0";
        try{
        return this.getSimpleJdbcTemplate().queryForObject(query, String.class,number);
        }catch(Exception e){
            return "";
        }
    }
    private boolean isAlreadyOrdered(String number){
        String query="select count(*) from orders where number=?";
        int ordersPlaced = this.getSimpleJdbcTemplate().queryForInt(query, number);
        return !(ordersPlaced==0);
    }
}
