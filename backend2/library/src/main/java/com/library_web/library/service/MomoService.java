// package com.library_web.library.service;

// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.library_web.library.model.Fine;
// import com.library_web.library.repository.FineRepository;

// import org.apache.commons.codec.digest.HmacAlgorithms;
// import org.apache.commons.codec.digest.HmacUtils;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;

// import java.net.URI;
// import java.net.http.HttpClient;
// import java.net.http.HttpRequest;
// import java.net.http.HttpResponse;
// import java.time.LocalDateTime;
// import java.util.*;

// @Service
// public class MomoService {

//     @Autowired
//     private FineRepository fineRepo;

//     @Value("${momo.partnerCode}")
//     private String partnerCode;

//     @Value("${momo.accessKey}")
//     private String accessKey;

//     @Value("${momo.secretKey}")
//     private String secretKey;

//     @Value("${momo.redirectUrl}")
//     private String redirectUrl;

//     @Value("${momo.ipnUrl}")
//     private String ipnUrl;

//     public ResponseEntity<?> createPaymentRequest(String fineId) {
//         try {
//             Long id = Long.parseLong(fineId);
//             Fine fine = fineRepo.findById(id)
//                     .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu phạt"));

//             String requestId = UUID.randomUUID().toString();
//             String orderId = UUID.randomUUID().toString();
//             String requestType = "captureWallet";

//             double amount = fine.getSoTien(); // Lấy từ phiếu phạt

//             Map<String, String> rawData = new LinkedHashMap<>();
//             rawData.put("accessKey", accessKey);
//             rawData.put("partnerCode", partnerCode);
//             rawData.put("requestId", requestId);
//             rawData.put("amount", String.valueOf(amount));
//             rawData.put("orderId", orderId);
//             rawData.put("orderInfo", "Thanh toán phiếu phạt " + fineId);
//             rawData.put("redirectUrl", redirectUrl);
//             rawData.put("ipnUrl", ipnUrl);
//             rawData.put("extraData", "");
//             rawData.put("requestType", requestType);

//             String rawSignature = rawData.entrySet().stream()
//                     .map(e -> e.getKey() + "=" + e.getValue())
//                     .reduce((a, b) -> a + "&" + b).orElse("");

//             String signature = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, secretKey)
//                     .hmacHex(rawSignature);

//             Map<String, Object> body = new HashMap<>(rawData);
//             body.put("signature", signature);
//             body.put("lang", "vi");

//             HttpRequest request = HttpRequest.newBuilder()
//                     .uri(URI.create("https://test-payment.momo.vn/v2/gateway/api/create"))
//                     .header("Content-Type", "application/json")
//                     .POST(HttpRequest.BodyPublishers.ofString(new ObjectMapper().writeValueAsString(body)))
//                     .build();

//             HttpClient client = HttpClient.newHttpClient();
//             HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

//             JsonNode jsonResponse = new ObjectMapper().readTree(response.body());

//             if (jsonResponse.has("payUrl")) {
//                 // Ghi lại orderId để xác minh sau
//                 fine.setOrderId(orderId);
//                 fineRepo.save(fine);
//                 return ResponseEntity.ok(jsonResponse.get("payUrl").asText());
//             } else {
//                 return ResponseEntity.status(500).body("Không lấy được payUrl từ Momo");
//             }

//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("Lỗi khi tạo thanh toán Momo: " + e.getMessage());
//         }
//     }

//     public ResponseEntity<?> handleIpn(Map<String, Object> payload) {
//         try {
//             String orderId = String.valueOf(payload.get("orderId"));
//             String resultCode = String.valueOf(payload.get("resultCode"));

//             if ("0".equals(resultCode)) {
//                 Optional<Fine> optionalFine = fineRepo.findByCardId(orderId);
//                 if (optionalFine.isPresent()) {
//                     Fine fine = optionalFine.get();
//                     fine.setTrangThai(Fine.TrangThai.DA_THANH_TOAN);
//                     fine.setNgayThanhToan(LocalDateTime.now());
//                     fineRepo.save(fine);
//                     System.out.println("✅ Cập nhật thanh toán thành công cho orderId: " + orderId);
//                 } else {
//                     System.out.println("⚠️ Không tìm thấy phiếu phạt với orderId: " + orderId);
//                 }
//             } else {
//                 System.out.println("❌ Thanh toán thất bại cho orderId: " + orderId);
//             }

//             return ResponseEntity.ok("acknowledged");

//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("Lỗi khi xử lý IPN: " + e.getMessage());
//         }
//     }
// }