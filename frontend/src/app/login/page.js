'use client'
import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  // Function to handle login button click
  const handleLogin = () => {
    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Clear error if email is valid
    setEmailError("");

    // Console log email and password
    console.log("Email:", email);
    console.log("Password:", password);

    // Here you can add further login logic
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm p-6 rounded-lg shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>
        
        {/* Email Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Email</label>
        <Input
          clearable
          placeholder="Enter your email"
          fullWidth
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {/* Error message for email */}
        {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}
        
        {/* Password Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Password</label>
        <Input
          clearable
          placeholder="Enter your password"
          type="password"
          fullWidth
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Login Button */}
        <Button color="primary" size="lg" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
