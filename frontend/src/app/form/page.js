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
        console.log("Player Name:", playerName);
        console.log("Player Team:", playerTeam);
        console.log("Opponent Team:", opponentTeam);
        console.log("Status:", status);
    }

    // Example options for teams, players, and statuses
    const teamArray = ['Team A', 'Team B', 'Team C', 'Team D'];
    const playerArray = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    const statusArray = ['Winner', 'Loser'];

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
                    <Button onClick={printData} color="primary" size="lg" auto>
                        Predict the Output
                    </Button>
                </div>
            </div>
        </div>
    );
}
