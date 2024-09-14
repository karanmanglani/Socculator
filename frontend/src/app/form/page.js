'use client'; // Ensure the component is client-side
import { teams } from "./teams";
import Image from "next/image";
import { players } from "./players";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import from 'next/navigation' for client-side routing
import { Button } from "@nextui-org/button";
import Droplist from "../components/Droplist"; // Assuming Droplist is a valid component from your project
import FromInputs from "./forminputs";
import Predictedoutput from "./Predictedoutput";
import PlayerDetails from "./PlayerDetails";
export default function Page() {
    const [loading, setLoading] = useState(false);
    const [playerName, setPlayerName] = useState(""); // State for player name
    const [playerTeam, setPlayerTeam] = useState(""); // State for player team
    const [opponentTeam, setOpponentTeam] = useState(""); // State for opponent team
    const [status, setStatus] = useState(""); // State for status
    const [model, setModel] = useState(""); // State for model
    const [submitted, setSubmitted] = useState(false); // State to toggle between form and result
    const [resultLines, setResultLines] = useState([]);
    const[report,setReport]=useState([]);
    const router = useRouter(); // Initialize router from 'next/navigation'

    // Example options for teams, players, and statuses
    const allTeams = ['Team A', 'Team B', 'Team C', 'Team D'];
    const playerArray = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    const statusArray = ['Winner', 'Loser'];
    const modelArray = ['xgboost_model', 'svr_model', 'linear_regression_model', 'knn_model', 'random_forest_model'];

    // Calculate available options based on selections
    const getAvailableTeams = (selectedTeams) => {
        return teams.filter(team => !selectedTeams.includes(team));
    };

    // Available teams for dropdowns
    const availableTeamsForPlayerTeam = getAvailableTeams([opponentTeam]);
    const availableTeamsForOpponentTeam = getAvailableTeams([playerTeam]);

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

    // Function to handle form submission
    async function handleSubmit() {
        setLoading(true); // Set loading state to true before starting
        console.log("Player Name:", playerName);
        console.log("Player Team:", playerTeam);
        console.log("Opponent Team:", opponentTeam);
        console.log("Status:", status);
        console.log("Model:", model); // Print model to console
    
        // Define the payload for the first request
        const payload = {
            model_name: model, // Include model in the payload
            player: playerName,
            team: playerTeam,
            opponent: opponentTeam,
            status: status === "Winner" ? 1 : 0
        };
    
        try {
            // First POST request to submit data
            const submitResponse = await fetch("http://localhost:3002/auth/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            // Check if the response is okay
            if (!submitResponse.ok) {
                throw new Error("Error in submitting form: Network response was not ok");
            }
    
            // Parse the JSON response from the first POST request
            const submitResult = await submitResponse.json();
            console.log("First Request Response:", submitResult); // Log the response of the first request
    
            // Transform the result and update state if needed
            const resultLines = submitResult.result.split('\r\n').map(line => line.trim()).filter(line => line);
            setResultLines(resultLines); // Update state with transformed result
            setSubmitted(true); // Update the form submission state
    
            // Second POST request to fetch report data
            const reportResponse = await fetch("http://localhost:3002/auth/getreport", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ player: playerName }), // Pass player name as payload
            });
    
            // Check if the response is okay
            if (!reportResponse.ok) {
                throw new Error("Error in fetching report: Network response was not ok");
            }
    
            // Parse the JSON response from the second POST request
            const reportData = await reportResponse.json();
            console.log("Second Request Response (Report):", reportData.result); // Log the response of the second request
            // Optionally, store the report in the state if you want to display it later
            setReport(reportData.result);
            console.log(report.result.total_goal)
    
        } catch (error) {
            console.error("Error during form submission:", error);
        } finally {
            setLoading(false); // Ensure loading is set to false after everything
        }
    }
    

    if (submitted) {
        return (
            <div>
            <Predictedoutput
            playerName={playerName}
            playerTeam={playerTeam}
            opponentTeam={opponentTeam}
            status={status}
            model={model}
            resultLines={resultLines}
            setSubmitted={setSubmitted}
    />
             <PlayerDetails result={report} teamname={playerTeam} />
            </div>      
        );
    }

    // Render form page
    return (
        <div >
            {loading && (
                <div style={{ display: "flex", justifyContent: 'center', marginTop: '100px'}}>
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && (
                 <FromInputs
                 players={players}
                 playerName={playerName}
                 playerTeam={playerTeam}
                 opponentTeam={opponentTeam}
                 status={status}
                 model={model}
                 availableTeamsForPlayerTeam={availableTeamsForPlayerTeam}
                 availableTeamsForOpponentTeam={availableTeamsForOpponentTeam}
                 statusArray={statusArray}
                 modelArray={modelArray}
                 setPlayerName={setPlayerName}
                 setPlayerTeam={setPlayerTeam}
                 setOpponentTeam={setOpponentTeam}
                 setStatus={setStatus}
                 setModel={setModel}
                 handleSubmit={handleSubmit}
               />
            )}
        </div>
    );
}
