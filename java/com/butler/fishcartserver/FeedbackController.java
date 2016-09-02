/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.butler.fishcartserver;

import com.butler.data.Feedback;
import com.butler.service.FeedbackDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author arsh
 */
@RestController
public class FeedbackController {
    @Autowired
    private FeedbackDao dao;
    @RequestMapping("/feedback")
    public void saveFeedback(@RequestBody Feedback feedback){
        dao.save(feedback);
    }
}
