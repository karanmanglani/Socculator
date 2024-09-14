'use client'
import React from 'react';
import Droplist from '../components/Droplist';
import { Button } from '@nextui-org/button';

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
  return (
    <div className="flex justify-center items-center ">
      <div className=" p-8 bg-white rounded-lg shadow-lg bg-opacity-80 backdrop-blur-md border border-gray-300" style={{width:'800px'}}>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction Form</h2>

        {/* Player Name */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Select Player Name</label>
          <Droplist list={players} getvalue={setPlayerName} />
        </div>

        {/* Teams */}
        <div className="flex items-center mb-6">
          <div className="flex-1 mr-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Select My Team</label>
            <Droplist list={availableTeamsForPlayerTeam} getvalue={team => {
              setPlayerTeam(team);
              if (team === opponentTeam) {
                setOpponentTeam("");
              }
            }} />
            <div className="flex justify-center mt-2">
              <img
                src={"https://flagsapi.com/BE/flat/64.png"}
                alt="My Team Flag"
                className="w-16 h-16 object-cover"
              />
            </div>
          </div>

          <div className="mx-4 text-center text-gray-700 text-lg font-semibold">VS</div>

          <div className="flex-1 ml-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Select Opponent Team</label>
            <Droplist list={availableTeamsForOpponentTeam} getvalue={team => {
              setOpponentTeam(team);
              if (team === playerTeam) {
                setPlayerTeam("");
              }
            }} />
            <div className="flex justify-center mt-2">
              <img
                src={"https://flagsapi.com/BE/flat/64.png"}
                alt="Opponent Team Flag"
                className="w-16 h-16 object-cover"
              />
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
