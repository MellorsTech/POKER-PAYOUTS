import { useState, useEffect} from 'react';
import matrix10 from '../Json/matrix_10.json';
import matrix12 from '../Json/matrix_12.json';
import matrix15 from '../Json/matrix_15.json';
import { GiTakeMyMoney } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import '../Styles/payouts.css';

function Payouts() {

        const [entries, setEntries] = useState('');
        const [prizePool, setPrizePool] = useState('');
        const [percentage, setPercentage] = useState('10');
        const [extraPlacesPaid, setExtraPlacesPaid] = useState('');
        const [rounding, setRounding] = useState('');
        const [payouts, setPayouts] = useState([]);
        const [numOfPlayers, setNumOfPlayers] = useState('');
        const [totalPrize, setTotalPrize] = useState('');
        const [showIcon, setShowIcon] = useState(false);
        const [totalPayouts, setTotalPayouts] = useState(false);
        const [tick, setTick] = useState(false);
        const [cross, setCross] = useState(false);
        const [playerError, setPlayerError] = useState(false);

        useEffect(() => {
            percentageDetailText(percentage);
        }, [percentage]);

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        };

        const formatPrizePool = (event) => {
            let value = event.target.value.replace(/[^0-9]/g, "");
            let number = value ? parseFloat(value) : 0;
            setPrizePool(number.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0, minimumFractionDigits: 0 }).replace(/\.00$/, ''));
        };

        const formatRounding = (event) => {
            let value = event.target.value.replace(/[^0-9]/g, "");
            let number = value ? parseFloat(value) : 0;
            setRounding(number.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\.00$/, ''));
        };

        const processPayouts = () => {
            const numberOfPlayers = parseInt(entries, 10);


            if ((percentage === '10' && numberOfPlayers > 900) ||
                (percentage === '12' && numberOfPlayers > 754) ||
                (percentage === '15' && numberOfPlayers > 902)) {
                    setPlayerError(true);
                    setCross(false);
                    setTick(false);
                    setPayouts([]);
                    setShowIcon(false);
                    setNumOfPlayers('');
                    setTotalPrize('');
                    setTotalPayouts('');

                    return; 
                } else {
                    setPlayerError(false);
                }

            
            const prizePoolValue = parseFloat(prizePool.replace(/[^0-9]/g, ''));
            const formattedPrizePool = formatCurrency(prizePoolValue);

            setNumOfPlayers(<span><span className='totalsNumber'>{ numberOfPlayers }</span>Players</span>);
            setTotalPrize(<span><span className='totalsNumber'>{ formattedPrizePool }</span>Prize Pool</span>);
        

            const data = getPayoutMatrix(percentage);
                console.log('Loaded Payout Matrix for percentage: ', percentage);
            const payouts = calculatePayouts(numberOfPlayers, prizePoolValue, data);
                console.log('calculated Payouts: ', payouts);
            setPayouts(payouts);
            setShowIcon(true);
        };

        const getPayoutMatrix = (percentage) => {
            switch (percentage) {
                case '10':
                    return matrix10;
                case '12':
                    return matrix12;
                case '15':
                    return matrix15;
                default:
                    return matrix10;
            }
        };

        const calculatePayouts = (numberOfPlayers, prizePool, data) => {
            console.log('calculating Payouts');
            const percentIndex = data.findIndex(range => numberOfPlayers >= range.minPlayers && numberOfPlayers <= range.maxPlayers);

            if (percentIndex === -1) {
                console.log('Payout Structure Not Found');
                return [];
            }

        
            const extraPlaces = parseInt(extraPlacesPaid, 10);
            const adjustIndex = percentIndex + extraPlaces < data.length ? percentIndex + extraPlaces : percentIndex;
            const payoutPercentages = data[adjustIndex].payouts;
            const roundingPayouts = rounding.trim() === '' ? 0 : parseInt(rounding.replace(/[^0-9.]/g, ''));

            let payouts = payoutPercentages.map((percentage, index) => {
                let payout = prizePool * (percentage / 100);
                return {
                    place: index + 1, 
                    payout: round(payout, roundingPayouts)
                };
            });

            const total = payouts.reduce((acc, val) => acc + val.payout, 0);
            setTotalPayouts(total);

            
                if (total === prizePool) {
                     setTick(true);
                     setCross(false);
                    } else if (total !== prizePool) {
                        setTick(false);
                        setCross(true);
                    }

            let validPayouts = payouts.filter(payout => !isNaN(payout.payout));
            return validPayouts;

            
        };

        

        const round = (amount, rounded) => {
            if (rounded <= 0) {
                return Math.round(amount);
            }
            return Math.round(amount / rounded) * rounded;
        };

        const percentageDetailText = (percentage) => {
            document.getElementById('detail10').hidden = true;
            document.getElementById('detail12').hidden = true;
            document.getElementById('detail15').hidden = true;

            if (percentage === '10') {
                document.getElementById('detail10').hidden = false;
            } else if (percentage === '12') {
                document.getElementById('detail12').hidden = false;
            } else if (percentage === '15') {
                document.getElementById('detail15').hidden = false;
            }
        };


        const displayPayouts = () => {
            return payouts.map(payout => {
                const formattedPayout = formatCurrency(payout.payout);
                return <p className='payoutSingle' key={ payout.place }> Place { payout.place }: <span className='placePayout'> { formattedPayout } </span> </p>;
            });
        };

        

  return (
    <section className='container'>
    <div>
        <h2 className='payoutHeading'>Tournament Payout Calculator</h2>
        <p className='payoutDetails'>Calculation is (Number of players / Payout Percentage + Extra Places Paid)</p>
    </div>
    <div className='payoutsInputContainer'>
        <label htmlFor="entries">Total Number of Entries</label>
        <input 
            type="number" 
            name="entries" 
            id="entries"
            value={entries}
            onChange={(e) => setEntries(e.target.value)}
        />

        <label htmlFor="prizePool">Total Prize Pool</label>
        <input
            type="text" 
            name="prizePool" 
            id="prizePool"
            value={prizePool}
            onChange={formatPrizePool}
        />

        <hr className='payoutsBreakline'></hr>

        <label htmlFor='percentage'>Payout Percentage</label>
        <select 
            name='percentage' 
            id='percentage'
            value={percentage}
            onChange={(e) => {
                setPercentage(e.target.value);
                percentageDetailText(e.target.value);
            }}>
            <option value='10'>10%</option>
            <option value='12'>12%</option>
            <option value='15'>15%</option>
        </select>
        <p className="PercentageDetails" id="detail10" hidden>Supports upto 900 entries.</p>
        <p className="PercentageDetails" id="detail12" hidden>Supports upto 754 entries.</p>
        <p className="PercentageDetails" id="detail15" hidden>Supports upto 902 entries.</p>

        <label htmlFor="extraPlacesPaid">Extra Places Paid</label>
        <input 
            type="number" 
            name="extraPlacesPaid" 
            id="extraPlacesPaid"
            value={extraPlacesPaid}
            onChange={(e) => setExtraPlacesPaid(e.target.value)}
            />

        <label htmlFor="rounding">Round Payouts</label>
        <input 
            type="text" 
            name="rounding" 
            id="rounding"
            value={rounding}
            onChange={formatRounding}
            />

        <button className='payoutsBtn' onClick={ processPayouts }>Payouts</button>
    </div>
    <div className='payoutsReport'>
        {playerError && <div>
            <p className='playerErrorText'>Maximum number of players Reached.</p>
            <p className='playerErrorText'>Please Enter number of Players within percentage limit.</p>
            </div>}
        <p className='totals'> { numOfPlayers } </p>
        <p className='totals'> { totalPrize } </p>
        {showIcon && <GiTakeMyMoney  className='moneyIcon'/>}
        <div className='Payouts' id='payouts'> { displayPayouts() } </div>
        {totalPayouts && <p className='payoutsTotalText'>Total: {formatCurrency(totalPayouts) }
        {tick && <FaCheck  className='totalIconsTick' /> }
        {cross && <FaXmark className='totalIconsCross' /> }</p>}
        
    </div>
</section>
  )
}

export default Payouts
