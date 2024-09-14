'use client'; // Ensure the component is client-side
import { teams } from "./teams";
import { players } from "./players";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation' for client-side routing
import { Button } from "@nextui-org/button";
import Droplist from "../components/Droplist"; // Assuming Droplist is a valid component from your project

export default function Page() {
    const [playerName, setPlayerName] = useState(""); // State for player name
    const [playerTeam, setPlayerTeam] = useState(""); // State for player team
    const [opponentTeam, setOpponentTeam] = useState(""); // State for opponent team
    const [status, setStatus] = useState(""); // State for status
    const [submitted, setSubmitted] = useState(false); // State to toggle between form and result
    const [resultLines, setResultLines] = useState([]);

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
    async function handleSubmit() {
        console.log("Player Name:", playerName);
        console.log("Player Team:", playerTeam);
        console.log("Opponent Team:", opponentTeam);
        console.log("Status:", status);
    
        // Define the payload
        const payload = {
            player: playerName,
            team: playerTeam,
            opponent: opponentTeam,
            status: status=="Winner"?1:0
        };
    
        try {
            // Make the POST request
            const response = await fetch("http://localhost:3002/auth/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            // Check if the response is okay
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
    
            // Parse the JSON response
            const result = await response.json();
    
            // Transform result into an array
            const resultLines = result.result.split('\r\n').map(line => line.trim()).filter(line => line);
    
            // Set state with transformed result
            setResultLines(resultLines);
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }
    
    

    // Example options for teams, players, and statuses
    const teamArray = ['Team A', 'Team B', 'Team C', 'Team D'];
    const playerArray = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    const statusArray = ['Winner', 'Loser'];

    if (submitted) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction Result</h2>
                    <p className="text-center text-gray-700 mb-4">Here are the details you submitted:</p>
                    <div className="mb-4">
                        <p className="text-gray-700"><strong>Player Name:</strong> {playerName}</p>
                        <p className="text-gray-700"><strong>Player Team:</strong> {playerTeam}</p>
                        <p className="text-gray-700"><strong>Opponent Team:</strong> {opponentTeam}</p>
                        <p className="text-gray-700"><strong>Status:</strong> {status}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Prediction Result:</h3>
                        {resultLines.map((line, index) => (
                            <p key={index} className="text-gray-700">{line}</p>
                        ))}
                    </div>
                    <div className="text-center">
                        <Button onClick={() => setSubmitted(false)} color="primary" size="lg" auto>
                            Back to Form
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    

    // Render form page
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-white bg-opacity-50 backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction Form</h2>
                
                {/* Player Name */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select Player Name</label>
                    <Droplist list={players} getvalue={setPlayerName} />
                </div>

                {/* Player Team */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select Player Team</label>
                    <Droplist list={teams} getvalue={setPlayerTeam} />
                </div>

                {/* Opponent Team */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select Opponent Team</label>
                    <Droplist list={teams} getvalue={setOpponentTeam} />
                </div>

                {/* Status */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Select Status</label>
                    <Droplist list={statusArray} getvalue={setStatus} />
                </div>
                
                {/* Submit Button */}
                <div className="text-center">
                    <Button onClick={handleSubmit} color="primary" size="lg" auto>
                        Predict the Output
                    </Button>
                </div>
            </div>
        </div>
    );
}
