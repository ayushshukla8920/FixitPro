<?php
    class JWT {
        private $secret = 'ayush8920';
        public function createJWT($payload) {
            $header = json_encode(["alg" => "HS256", "typ" => "JWT"]);
            $base64Header = $this->base64UrlEncode($header);
            $payload = json_encode($payload);
            $base64Payload = $this->base64UrlEncode($payload);
            $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $this->secret, true);
            $base64Signature = $this->base64UrlEncode($signature);
            return "$base64Header.$base64Payload.$base64Signature";
        }
        public function decodeJWT(string $jwt){
            $parts = explode('.', $jwt);
            if (count($parts) !== 3) {
                return ["error" => "Invalid token format"];
            }
            [$base64Header, $base64Payload, $base64Signature] = $parts;
            $header = json_decode($this->base64UrlDecode($base64Header), true);
            $payload = json_decode($this->base64UrlDecode($base64Payload), true);
            $validSignature = hash_hmac('sha256', "$base64Header.$base64Payload", $this->secret, true);
            $validBase64Signature = $this->base64UrlEncode($validSignature);
    
            if ($validBase64Signature !== $base64Signature) {
                return ["error" => "Invalid signature"];
            }
            return $payload;
        }
        private function base64UrlEncode($data) {
            return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
        }
        private function base64UrlDecode($data){
            $urlSafeData = str_replace(['-', '_'], ['+', '/'], $data);
            return base64_decode($urlSafeData);
        }
    }
?>