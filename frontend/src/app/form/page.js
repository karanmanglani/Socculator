'use client'; // Ensure the component is client-side

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation' for client-side routing
import { Button } from "@nextui-org/button";
import Droplist from "../components/Droplist"; // Assuming Droplist is a valid component from your project

export default function Page() {
    const [team, setTeam] = useState("");
    const [player, setPlayer] = useState("");
    const [status, setStatus] = useState("");
    
    const router = useRouter(); // Initialize router from 'next/navigation'

    // Check if authToken exists in cookies and redirect if not found
    useEffect(() => {
        if (typeof window !== 'undefined') { // Check if we're on the client-side
            const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
                const [name, value] = cookie.split("=");
                acc[name] = value;
                return acc;
            }, {});

            // If authToken is not found, redirect to the home page
            if (!cookies.authToken) {
                router.push("/"); // Use `router.push()` from 'next/navigation'
            }
        }
    }, [router]);

    // Function to print the selected values
    function printData() {
        console.log("Team:", team);
        console.log("Player:", player);
        console.log("Status:", status);
    }

    const statusArray = ['winner', 'looser']; // Using consistent variable naming

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction Form</h2>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select the Team Name</label>
                    <Droplist list={statusArray} getvalue={setTeam} />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select the Player Name</label>
                    <Droplist list={statusArray} getvalue={setPlayer} />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select the Status</label>
                    <Droplist list={statusArray} getvalue={setStatus} />
                </div>
                
                <div className="text-center">
                    <Button onClick={printData} color="primary" size="lg" auto>
                        Predict the Output
                    </Button>
                </div>
            </div>
        </div>
    );
}
