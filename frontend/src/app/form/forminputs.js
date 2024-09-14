'use client';
import React, { useState } from 'react';
import Droplist from '../components/Droplist';
import { Button } from '@nextui-org/button';
import findCountryCode from './flag'; // Ensure this function is correctly imported

export default function FromInputs({
  players,
  availableTeamsForPlayerTeam,
  availableTeamsForOpponentTeam,
  statusArray,
  modelArray,
  setPlayerName,
  setPlayerTeam,
  setOpponentTeam,
  setStatus,
  setModel,
  handleSubmit,
  opponentTeam,
  playerTeam
}) {
  // State for country codes and image load status
  const [playerTeamCode, setPlayerTeamCode] = useState("");
  const [opponentTeamCode, setOpponentTeamCode] = useState("");
  const [playerTeamImageLoaded, setPlayerTeamImageLoaded] = useState(false);
  const [opponentTeamImageLoaded, setOpponentTeamImageLoaded] = useState(false);

  // Handle team selection and update the country codes
  const handlePlayerTeamChange = (team) => {
    setPlayerTeam(team);
    const code = findCountryCode(team).toUpperCase();
    setPlayerTeamCode(code);
    setPlayerTeamImageLoaded(false); // Reset image load status
    if (team === opponentTeam) {
      setOpponentTeam("");
      setOpponentTeamCode(""); // Clear opponent team code
    }
  };

  const handleOpponentTeamChange = (team) => {
    setOpponentTeam(team);
    const code = findCountryCode(team).toUpperCase();
    setOpponentTeamCode(code);
    setOpponentTeamImageLoaded(false); // Reset image load status
    if (team === playerTeam) {
      setPlayerTeam("");
      setPlayerTeamCode(""); // Clear player team code
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-8 bg-white rounded-lg shadow-lg bg-opacity-80 backdrop-blur-md border border-gray-300" style={{ width: '800px' }}>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction Form</h2>

        {/* Player Name */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Select Player Name</label>
          <Droplist list={players} getvalue={setPlayerName} />
        </div>

        {/* Teams */}
        <div className="flex items-center mb-6">
          <div className="flex-1 mr-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2"> My Team</label>
            <Droplist list={availableTeamsForPlayerTeam} getvalue={handlePlayerTeamChange} />
            <div className="flex justify-center mt-2">
              {playerTeamCode ? (
                <img
                  src={`https://flagsapi.com/${playerTeamCode}/shiny/64.png`}
                  alt="My Team Flag"
                  className={`w-16 h-16 object-cover ${playerTeamImageLoaded ? '' : 'hidden'}`}
                  onLoad={() => setPlayerTeamImageLoaded(true)}
                  onError={() => setPlayerTeamImageLoaded(false)}
                />
              ) : (
                <div className="w-16 h-16 flex justify-center items-center text-gray-400">No Flag</div>
              )}
            </div>
          </div>

          <div className="mx-4 text-center text-gray-700 text-lg font-semibold">VS</div>

          <div className="flex-1 ml-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Select Opponent Team</label>
            <Droplist list={availableTeamsForOpponentTeam} getvalue={handleOpponentTeamChange} />
            <div className="flex justify-center mt-2">
              {opponentTeamCode ? (
                <img
                  src={`https://flagsapi.com/${opponentTeamCode}/flat/64.png`}
                  alt="Opponent Team Flag"
                  className={`w-16 h-16 object-cover ${opponentTeamImageLoaded ? '' : 'hidden'}`}
                  onLoad={() => setOpponentTeamImageLoaded(true)}
                  onError={() => setOpponentTeamImageLoaded(false)}
                />
              ) : (
                <div className="w-16 h-16 flex justify-center items-center text-gray-400">No Flag</div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Select Status</label>
          <Droplist list={statusArray} getvalue={setStatus} />
        </div>

        {/* Model */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Select Model</label>
          <Droplist list={modelArray} getvalue={setModel} />
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
