'use client'
import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import Droplist from "../components/Droplist"; // Assuming Droplist is a valid component from your project

// `page` component should start with uppercase as React components are PascalCased
export default function Page() {
    const [team, setTeam] = useState("");
    const [player, setPlayer] = useState("");
    const [status, setStatus] = useState("");

    // Function to print the selected values
    function printData() {
        console.log("Team:", team);
        console.log("Player:", player);
        console.log("Status:", status);
    }

    const statusArray = ['winner', 'looser']; // Using consistent variable naming

    return (
        <div>
            <div style={{height:"700px",display:'flex',justifyContent:'center'}}>
                <div className="form_container" style={{height:'500px',marginTop:'100px'}}>
                <div>Select the Team Name</div>
                <div>
                    {/* Passing the appropriate array and setter function */}
                    <Droplist list={statusArray} getvalue={setTeam} />
                </div>
                <div>Select the Player Name</div>
                <div>
                    <Droplist list={statusArray} getvalue={setPlayer} />
                </div>
                <div>Select the Status</div>
                <div>
                    <Droplist list={statusArray} getvalue={setStatus} />
                </div>
                <div style={{marginTop:'50px'}}>
                <Button onClick={printData}>Predict the output</Button>
                </div>
            </div>
            </div>
        </div>
    );
}
