package com.datafolder;

import static spark.Spark.*;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;

public class WebhookServer {
    private static final Gson gson = new Gson();
    
    public static void main(String[] args) {
        port(8080);
        
        // Webhook endpoint
        post("/webhook", (req, res) -> {
            res.type("application/json");
            
            try {
                String body = req.body();
                System.out.println("Received webhook data: " + body);
                
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Webhook received successfully");
                response.put("data", body);
                
                res.status(200);
                return gson.toJson(response);
            } catch (Exception e) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", e.getMessage());
                
                res.status(400);
                return gson.toJson(errorResponse);
            }
        });
        
        // Health check endpoint
        get("/health", (req, res) -> {
            res.type("application/json");
            Map<String, String> response = new HashMap<>();
            response.put("status", "healthy");
            return gson.toJson(response);
        });
        
        System.out.println("Java webhook server running on port 8080");
    }
}
