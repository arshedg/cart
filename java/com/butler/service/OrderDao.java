/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.service;

import com.butler.data.OrderDetails;
import com.fishcart.order.Order;
import com.fishcart.order.OrderStatus;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

/**
 *
 * @author arsh
 */
public class OrderDao extends JdbcTemplate {

    @Autowired
    UserDao userDao;
   
    public int placeOrder(String number, String order, float quantity, boolean isImmediate,String slot){
        KeyHolder holder = new GeneratedKeyHolder();
        String sql = "insert into orders(number,product,quantity,status,immediate,slot) values(?,?,?,?,?,?)";
        this.update(new PreparedStatementCreator() {           

                @Override
                public PreparedStatement createPreparedStatement(Connection connection)
                        throws SQLException {
                    PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                    ps.setString(1, number);
                    ps.setString(2, order);
                    ps.setFloat(3, quantity);
                    ps.setString(4, "TODO");
                    ps.setBoolean(5, isImmediate);
                    ps.setString(6, slot);
                    return ps;
                }
            }, holder);
        return holder.getKey().intValue();
    }
    public void updateFeedBack(String number, String feedback) {
        String sql = "update orders set feedback=? where number=? and status='TODO'";
        this.update(sql, feedback, number);
    }

    public List<OrderDetails> getPendingOrders() {
        String sql = "select name, o.number, address, o.feedback,o.product, o.quantity, o.immediate,o.stamp as time from orders o,(select name,address,number from user)as y where o.number = y.number and o.id>1126 order by time desc";
        //return this.getJdbcTemplate().queryForList(sql, OrderDetails.class);
        return this.query(sql, new RowMapper() {

            public Object mapRow(ResultSet rs, int i) throws SQLException {
                OrderDetails details = new OrderDetails();
                details.setName(rs.getString("name"));
                details.setNumber(rs.getString("number"));
                details.setAddress(rs.getString("address"));
                details.setProduct(rs.getString("product"));
                details.setQuantity(rs.getString("quantity"));
                Timestamp time = rs.getTimestamp("time");
                details.setTime(Util.getIndianTime(time));
                details.setFeedback(rs.getString("feedback"));
                details.setImmediate(rs.getBoolean("immediate"));
                return details;
            }
        });
    }

    public Long getLastOrderId() {
        String query = "select MAX(id) from orders";
        return this.queryForObject(query, Long.class);
    }

    public Collection<OrderDetails> getPendingOrdersGroupedByCustomer() {
        List<OrderDetails> orders = this.getPendingOrders();
        Map<String, OrderDetails> groupedOrder = new HashMap<>();
        orders.stream().forEach(order -> {
            if (groupedOrder.containsKey(order.getNumber())) {
                OrderDetails details = groupedOrder.get(order.getNumber());
                details.setProduct(details.getProduct() + "," + order.getProduct());
            } else {
                groupedOrder.put(order.getNumber(), order);
            }
        });
        return groupedOrder.values();
    }

    public List<Order> getOrders(String ids) {
        String sql = "select id,number,product,quantity,status,immediate from orders where id in ("+ids+")";
        return this.query(sql, new OrderRowMapper());
    }

   public com.fishcart.order.OrderDetails getOrdersFromIds(String ids){
        List<Order> orders = this.getOrders(ids);
        com.fishcart.order.OrderDetails orderDetails = new com.fishcart.order.OrderDetails();
        orderDetails.setOrders(orders);
        if(orders.size()==0){
            return orderDetails;
        }
        orderDetails.setUser(userDao.getUserDetails(orders.get(0).getNumber()));
        return orderDetails;
    } 
    static OrderStatus getStatus(String string) {
        if (string == null || string.trim().equals("")) {
            return OrderStatus.TODO;
        }
        try {
            return OrderStatus.valueOf(string.toUpperCase());
        } catch (Exception ex) {
            return OrderStatus.TODO;
        }
    }

}

class OrderRowMapper implements RowMapper {

    public static OrderRowMapper getInstance() {
        return new OrderRowMapper();
    }

    @Override
    public Object mapRow(ResultSet rs, int i) throws SQLException {
        Order order = new Order();
        order.setOrderId(rs.getInt("id"));
        order.setNumber(rs.getLong("number"));
        order.setProduct(rs.getString("product"));
        order.setQuantity(rs.getFloat("quantity"));
//        Timestamp time = rs.getTimestamp("time");
//        order.setOrderedTime(Util.getIndianTime(time));
        order.setImmediate(rs.getBoolean("immediate"));
        order.setOrderStatus(OrderDao.getStatus(rs.getString("status")));
        return order;
    }

}
