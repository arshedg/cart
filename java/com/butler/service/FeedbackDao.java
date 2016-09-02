/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.service;

import com.butler.data.Feedback;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 *
 * @author arsh
 */
public class FeedbackDao  extends JdbcTemplate {
     public void save(Feedback feedback) {
        String sql = "insert into feedback (number,relatedOrder,delivery,quality,message) values(?,?,?,?,?)";
        this.update(sql, feedback.getNumber(),feedback.getRelatedOrder(),
                feedback.getDeliveryRating(),feedback.getProductRating(),feedback.getComment());
    }
    
}
