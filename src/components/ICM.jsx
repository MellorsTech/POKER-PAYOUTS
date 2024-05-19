import React, { useState } from 'react';
import { bruteForceICM, createPlayer } from '../scripts/icm';
import { GiTakeMyMoney } from "react-icons/gi";
import _ from 'lodash';
import '../Styles/ICM.css';

const ICMCalculator = () => {
    const [players, setPlayers] = useState([]);
    const [results, setResults] = useState([]);
    const [numOfPlayers, setNumOfPlayers] = useState('');
    const [showFields, setShowFields] = useState(false);
    const [errMessage, setErrMessage] = useState(false);
    const [chipTotal, setChipTotal] = useState(0);
    const [prizePool, setPrizePool] = useState(0);
    const [showTotals, setShowTotals] = useState(false);

    const formatChips = (value) => {
        return value ? `T - ${new Intl.NumberFormat().format(value)}` : '';
    };

    const formatMoney = (value) => {
        return value ? new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD', 
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value) : '';
    };

    const handlePlayerChange = (index, key, value) => {
        const newPlayers = [...players];
        newPlayers[index][key] = value;
        setPlayers(newPlayers);
        updateTotals(newPlayers);
    };

    const handleNumberOfPlayers = (value) => {
        setNumOfPlayers(value);
        if (value > 0 && value <= 15) {
            const newPlayers = Array.from({ length: value }, () => ({ stack: '', prize: '' }));
            setPlayers(newPlayers);
            setShowFields(true);
            setErrMessage(false);
        } else if (value >= 16) {
            setErrMessage(true);
            setShowFields(false);
        }
    };

    const updateTotals = (newPlayers) => {
        const totalChips = _.sumBy(newPlayers, (player) => parseFloat(player.stack) || 0);
        const totalPrizes = _.sumBy(newPlayers, (player) => parseFloat(player.prize) || 0);
        setChipTotal(totalChips);
        setPrizePool(totalPrizes);
    };

    const calculateICM = () => {
        const totalChips = _.sumBy(players, (player) => parseFloat(player.stack) || 0);
        const prizeAmounts = players.map((player) => parseFloat(player.prize) || 0);
        const playerRefs = players.map((player) => createPlayer(parseFloat(player.stack)));

        if (totalChips === 0 || prizeAmounts.length === 0) {
            setResults([]);
            return;
        }

        const timer = performance.now();
        console.log('Timer Started');

        bruteForceICM(playerRefs, totalChips, prizeAmounts);

        const endTimer = performance.now();
        console.log(`ICM Calculation Time: ${(endTimer - timer).toFixed(2)} milliseconds`);

        const totalPrizePool = _.sum(prizeAmounts);
        const totalEV = _.sumBy(playerRefs, (player) => player.ev);

        const normalizedResults = playerRefs.map((player) => ({
            ev: (player.ev / totalEV) * totalPrizePool,
            percentage: (player.ev / totalPrizePool) * 100,
        }));

        setResults(normalizedResults);
        setShowTotals(true);
    };

    return (
        <section className='icmContainer'>
            <h2 className='icmHeading'>ICM Calculator</h2>
            <p className='icmDetails'>ICM Calculator supports upto 15 Players. </p>
            <div className='getPlayers'>
                <label htmlFor='numofPlayers'>Number of Players</label>
                <input
                    type='number'
                    name='numofPlayers'
                    id='numofPlayers'
                    value={numOfPlayers}
                    min={2}
                    max={15}
                    onChange={(e) => setNumOfPlayers(parseInt(e.target.value) || 0)}
                />
                <button className='getPlayerBtn' onClick={() => handleNumberOfPlayers(numOfPlayers)}>Get Players</button>
                {errMessage && <p className='errMessage'>Sorry, the maximum number of players is 15.</p>}
            </div>
            {showFields && (
                <div className='icmInput'>
                    {players.map((player, index) => (
                        <div key={index} className='icmInputSingle'>
                            <label className='icmPlayerIndex'>Player {index + 1}:</label>
                            <input
                                type="text"
                                placeholder="Stack"
                                value={formatChips(player.stack)}
                                onChange={(e) => handlePlayerChange(index, 'stack', e.target.value.replace('T-', '').replace(/,/g, ''))}
                                min={1}
                            />
                            <input className='icmPrizeInput'
                                type="text"
                                placeholder="Prize"
                                value={formatMoney(player.prize)}
                                onChange={(e) => handlePlayerChange(index, 'prize', e.target.value.replace(/[$,]/g, ''))}
                                min={0}
                            />
                        </div>
                    ))}
                </div>
            )}
            {showFields && (
                <button className='icmCalcBtn' onClick={calculateICM}>Calculate ICM</button>
            )}
            {showTotals && (
                <div className='icmPayouts'>
                  <div className='icmTotals'>
                    <p className='totalsNumber '>{formatChips(chipTotal)}<span className='totals icmTotalsSingle'>Total Chips</span></p>
                    <p className='totalsNumber '>{formatMoney(prizePool)}<span className='totals icmTotalsSingle'>Prize Pool</span></p>
                    <GiTakeMyMoney className='moneyIcon'/>
                </div>
                    {results.length > 0 && results.map((result, index) => (
                        <div key={index} className='payoutsSingle icmPayoutsSingle'>
                            Player {index + 1}: <span className='placePayout'> {formatMoney(result.ev.toFixed(2))}</span> <span className='payoutPercentageText'> ({result.percentage.toFixed(2)}%)</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ICMCalculator;
