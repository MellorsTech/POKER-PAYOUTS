import { useState } from 'react'
import { GiTakeMyMoney } from "react-icons/gi";
 import '../Styles/Deal.css'

function Deal() {

    const [prizePool, setPrizePool] = useState('');
    const [numOfPlayers, setNumOfPlayers] = useState('');
    const [playersChips, setPlayersChips] = useState([]);
    const [payoutsButton, setPayoutsButton] = useState(false);
    const [prizeDistributions, setPrizeDistributions] = useState([]);
    const [showIcon, setShowIcon] = useState(false);
    const [sumCalculation, setSumCalcukation] = useState(false);

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
      }).format(value);
    };
    

  const formatPrizePool = (event) => {
    let value = event.target.value.replace(/[^0-9]/g, "");
    let number = value ? parseFloat(value) : 0;
    setPrizePool(number.toLocaleString('en-AU', { 
      style: 'currency', 
      currency: 'AUD', 
      maximumFractionDigits: 0, 
      minimumFractionDigits: 0 
    }).replace(/\.00$/, ''));
  };

  const formatChips = (value) => {
    let cleanValue = value.replace(/[^0-9]/g, '');
    let number = cleanValue ? parseInt(cleanValue) : 0;
    return `T - ${number.toLocaleString('en-AU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }

  const createPlayers = () => {
    const numberOfPlayers = parseInt(numOfPlayers, 10);
    if (isNaN(numberOfPlayers) || numberOfPlayers <= 0) {
      alert('Enter Number of Players');
      return;
    }
    setPlayersChips(Array(numberOfPlayers).fill(''));
    setPayoutsButton(false);
  };

  const handlePlayersChips = (index, event) => {
    const updatedChips = [...playersChips];
    const formattedChips = formatChips(event.target.value);
    updatedChips[index] = formattedChips;
    setPlayersChips(updatedChips);
    setPayoutsButton(true);
  };

  const payoutButtonClick = () => {
    const chipValues = playersChips.map(chips => parseInt(chips.replace(/T - /, '').replace(/,/g, ''), 10) || 0);
    const totalChips = chipValues.reduce((acc, val) => acc + val, 0);
    const percentage = calculatePercentage(chipValues, totalChips);
    const distribution = calculateDistribution(percentage);
    setPrizeDistributions(distribution);
    setShowIcon(true);
    setSumCalcukation(true);
  };

  const calculatePercentage = (chipValues, chipsInPlay) => {
    return chipValues.map(value => ((value / chipsInPlay) * 100).toFixed(2));
  };

  
  const calculateDistribution = (percentage) => {
    const prizePoolValue = parseInt(prizePool.replace(/[^0-9]/g, ''), 10);
    return percentage.map(percentage => ((percentage / 100) * prizePoolValue).toFixed(2));
  }
  
 const sumDistribution = (distribution) => {
  const prizePoolValue = parseInt(prizePool.replace(/[^0-9]/g, ''), 10);
  let totalPayouts = distribution.reduce((acc, val) => acc + parseFloat(val), 0);
  let roundingError = prizePoolValue - totalPayouts;

  if (Math.abs(roundingError) > 0.01) {
    distribution[distribution.length - 1] = parseFloat(distribution[distribution.length - 1] + roundingError).toFixed(2);

  }
    return distribution;

 };
  
    return (
      <section className='dealContainer'>
        <div className='dealHeader'>
          <h2 className='dealHeading'>Deal Calculator</h2>
          <p className='dealDetails'>Calculation is (Percentage of chips = Percentage of prize pool) e.g If a player as 20% of chips in play. The Player will receive 20% of prize pool.</p>
        </div>
        <div className='dealInputsContainer'>
          <label htmlFor='prizePool'>Total Prize Pool</label>
          <input 
            type='text'
            name='prizePool'
            id='prizePool'
            value={ prizePool }
            onChange={ formatPrizePool }

          />
          <label htmlFor='numofPlayers'>Number Of Players</label>
          <input 
            type='number'
            name='numofPlayers'
            id='numofPlayers'
            value={ numOfPlayers }
            onChange={(e) => setNumOfPlayers(e.target.value)}

          />
          <button className='showPlayersBtn' onClick={ createPlayers }>Show Players</button>
        </div>
        <div className='playersContainer'>
          { playersChips.map((chips, index) => (
            <div key={index} className='chipInputs'>
              <label htmlFor={ `playerChips${index}`}>Player {index + 1} </label>
              <input
                type='text'
                id={`playersChips${index}`}
                placeholder='Chips'
                value={chips}
                onChange={(e) => handlePlayersChips(index, e)}
              />
            </div>
          ))}
          { playersChips.length > 0 && (
          <button 
            className='payoutsBtn' onClick={payoutButtonClick}>Payouts</button>)}
        </div>
        {payoutsButton && (
          <div className='payoutReport'>
             {showIcon && <GiTakeMyMoney  className='dealMoneyIcon'/>}
            {prizeDistributions.map((distribution, index) => (
              <p 
                className='payoutSingle dealPayoutSingle'
                key={index}>
                  Player {index + 1}: <span className='placePayout'> {formatCurrency(distribution)} </span>
              </p>
            ))}
                          {sumCalculation && (
                <p className='totalText'>Total: {formatCurrency(prizeDistributions.reduce((acc, val) => acc + parseFloat(val), 0))}</p>
              )}
          </div>
        )}
      </section>
    
    );
  }


export default Deal;