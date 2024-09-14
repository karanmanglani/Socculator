'use client';
import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation'; // Next.js Router

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [cookies, setCookie] = useCookies(['authToken']); // Cookie management
  const router = useRouter(); // For redirection

  // Function to handle form submission
  const handleSignUp = async () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) errors.name = 'Name is required.';
    if (!phone) errors.phone = 'Phone number is required.';
    if (!email) errors.email = 'Email is required.';
    else if (!emailPattern.test(email)) errors.email = 'Invalid email address.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 5) errors.password = 'Password must be at least 5 characters long.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        // Making POST request to the auth endpoint
        const response = await fetch('http://localhost:3002/auth/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            phone,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Store JWT token in cookies
          setCookie('authToken', data.authToken, { path: '/' });
          // Redirect to /form page
          router.push('/form');
        } else {
          alert('Sign-up failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during sign-up:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Sign Up
        </h2>

        {/* Name Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Name</label>
        <Input
          clearable
          placeholder="Enter your Name"
          fullWidth
          className="mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

        {/* Phone Number Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Phone Number</label>
        <Input
          clearable
          placeholder="Enter your Phone Number"
          fullWidth
          className="mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <p className="text-red-500 text-sm mb-4">{errors.phone}</p>}

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
        {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}

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
        {errors.password && <p className="text-red-500 text-sm mb-4">{errors.password}</p>}

        {/* Confirm Password Input */}
        <label className="block mb-2 text-gray-700 font-semibold">Confirm Password</label>
        <Input
          clearable
          placeholder="Confirm your password"
          type="password"
          fullWidth
          className="mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mb-4">{errors.confirmPassword}</p>}

        {/* Sign Up Button */}
        <Button color="primary" size="lg" fullWidth onClick={handleSignUp}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
