/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 *
 * @author arsh
 */
public class UservisitDao extends JdbcTemplate{
    @Autowired
    UserDao userDao;
    public void saveVisit(String number){
        String name = userDao.getName(number);
        String query="insert into uservisit(number,name) values(?,?) ";
        this.update(query,number,name);
    }
}
