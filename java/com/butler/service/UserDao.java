/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.service;


import com.butler.data.User;
import com.mysql.jdbc.StringUtils;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;


/**
 *
 * @author arsh
 */
public class UserDao extends JdbcTemplate {


    public String saveUser(String name, long number) {
        String identity = generatePassword(number);
        int changes =  this.update("insert into user(name,number,identity) values(?,?,?) ", name,number,generatePassword(number));
        if(changes==1){//on success
            return identity;
        }
        return null;
    }
     public String saveUser(String name, long number,String address) {
        String identity = generatePassword(number);
        int changes =  this.update("insert into user(name,number,address) values(?,?,?) ", name,number,address);
        if(changes==1){//on success
            return identity;
        }
        return null;
    }
    public String generatePassword(Long number){
        return number.toString()+System.currentTimeMillis();
    }
   public User getUserDetails(Long number){
        String sql="select name,number,address,credit,identity from user where number=?";
        List<User> users = this.query(sql,new Object[]{number}, new RowMapper() {

            @Override
            public Object mapRow(ResultSet rs, int i) throws SQLException {
                User user = new User();
                user.setName(rs.getString("name"));
                user.setNumber(rs.getString("number"));
                user.setAddress(rs.getString("address"));
                user.setCredit(rs.getFloat("credit"));
                return user;
            }
        });
        return getBetterUserObject(users);
    }
    public void addCredit(String number,float amount){
        String name = getName(number);
        if(UNKNOWN.equals(name)){
            return;
        }
        float credits = getCredits(number)+amount;
        this.update("update user set credit=? where number=?",credits,number);
        
    }
    public float getCredits(String number){
        String query = "select credit from user where number=?";
        return this.queryForObject(query, new Object[]{number}, Float.class);

    }
    public String getName(String number){
        
        try{
            List<String> names = this.query("select name from user where number=?",new String[]{number}, new RowMapper() {

            @Override
            public Object mapRow(ResultSet rs, int i) throws SQLException {
                return rs.getString("name");
            }
        });
        return names.isEmpty()?UNKNOWN:names.get(0);
       // return this.getSimpleJdbcTemplate().queryForObject("select name from user where number=?", String.class, number);
        }catch(Throwable e){
            return UNKNOWN;
        }
    }
    private static final String UNKNOWN = "UNKNOWN";
    public String getAddress(String number){
        try{
        return this.queryForObject("select address from user where number=?", String.class, number);
        }catch(Throwable e){
            return "Address not found";
        }
    }
    public String getLocation(String number){
        
        try{
            List<String> locations = this.query("select gps from user where number=?",new String[]{number}, new RowMapper() {

            @Override
            public Object mapRow(ResultSet rs, int i) throws SQLException {
                return rs.getString("gps");
            }
        });
        return locations.isEmpty()?null:locations.get(0);
       // return this.getSimpleJdbcTemplate().queryForObject("select name from user where number=?", String.class, number);
        }catch(Throwable e){
            return null;
        }
    }
    public void updateUser(String name,String address,String number){
        this.update("update user set name=?,address=? where number=?", name,address,number);
    }
    public void updateAddress(String address,String number){
        if(address==null||address.trim().equals("")||address.trim().equals("undefined")){
            return;
        }
        this.update("update user set address=? where number=?", address,number);
    }
    public String updatePassword(String number){
        String password = this.generatePassword(Long.valueOf(number));
        int changes = this.update("update user set identity=? where number=?", password,number);
        String response = "SUCCESS:"+password;
        return changes>0?response:"failed to update";
    }
    public boolean hasPassword(String number){
        Integer passwordCount = this.queryForObject("select count(*) from user where identity is not null and number=?", new Object[]{number},Integer.class);
        return passwordCount != 0;
    }
    public boolean doesNumberExist(long number){
        try{
         this.queryForObject("select id from user where number=?", new Object[]{number},Integer.class);
        }catch(EmptyResultDataAccessException exception){
            return false;
        }
        catch(IncorrectResultSizeDataAccessException exception){
            if(exception.getActualSize()>0){
                return true;
            }else{
                return false;
            }     
        }
        return true;
    }
        private User getBetterUserObject(List<User> users) {       
        for(User user:users){
            if(!StringUtils.isEmptyOrWhitespaceOnly(user.getAddress())){
                return user;
            }
        }
        return users.get(0);
    }

    public void saveLocation(String number,String location) {
        int changes = this.update("update user set gps=? where number=?", location,number);
    }

 
}
