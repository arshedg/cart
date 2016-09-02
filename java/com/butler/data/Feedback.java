/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.data;

import java.sql.Timestamp;

/**
 *
 * @author arsh
 */
public class Feedback {
    private String number;
    private Integer productRating;
    private Integer deliveryRating;
    private String comment;
    private Integer relatedOrder;
    private Timestamp timestamp;
    private Integer id;
    /**
     * @return the number
     */
    public String getNumber() {
        return number;
    }

    /**
     * @param number the number to set
     */
    public void setNumber(String number) {
        this.number = number;
    }

    /**
     * @return the productRating
     */
    public Integer getProductRating() {
        return productRating;
    }

    /**
     * @param productRating the productRating to set
     */
    public void setProductRating(Integer productRating) {
        this.productRating = productRating;
    }

    /**
     * @return the deliveryRating
     */
    public Integer getDeliveryRating() {
        return deliveryRating;
    }

    /**
     * @param deliveryRating the deliveryRating to set
     */
    public void setDeliveryRating(Integer deliveryRating) {
        this.deliveryRating = deliveryRating;
    }

    /**
     * @return the comment
     */
    public String getComment() {
        return comment;
    }

    /**
     * @param comment the comment to set
     */
    public void setComment(String comment) {
        this.comment = comment;
    }

    /**
     * @return the relatedOrder
     */
    public Integer getRelatedOrder() {
        return relatedOrder;
    }

    /**
     * @param relatedOrder the relatedOrder to set
     */
    public void setRelatedOrder(Integer relatedOrder) {
        this.relatedOrder = relatedOrder;
    }

    /**
     * @return the timestamp
     */
    public Timestamp getTimestamp() {
        return timestamp;
    }

    /**
     * @param timestamp the timestamp to set
     */
    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }
}
