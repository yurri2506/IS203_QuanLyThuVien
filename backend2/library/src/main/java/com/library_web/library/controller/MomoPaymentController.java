// package com.library_web.library.controller;

// import com.library_web.library.service.MomoService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/fine")
// public class MomoPaymentController {

//     @Autowired
//     private MomoService momoService;

//     // API tạo thanh toán: client gọi POST để lấy payUrl từ Momo
//     @PostMapping("/pay-momo/{fineId}")
//     public ResponseEntity<?> createMomoPayment(@PathVariable String fineId) {
//         return momoService.createPaymentRequest(fineId);
//     }

//     // IPN callback: Momo gửi JSON về khi người dùng thanh toán xong
//     @PostMapping("/momo-ipn")
//     public ResponseEntity<?> handleMomoIpn(@RequestBody Map<String, Object> payload) {
//         return momoService.handleIpn(payload);
//     }
// }