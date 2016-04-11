/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.service;

import org.springframework.jdbc.core.JdbcTemplate;



/**
 *
 * @author arsh
 */
public class RevisionDao extends JdbcTemplate{
    
    public Integer getAppVersion(){
        return this.queryForObject("select version from revision",Integer.class);
    }
}
