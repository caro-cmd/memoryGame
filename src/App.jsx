import {useEffect, useState} from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from "react-use";
import './App.css'


function App() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [millisecond, setMillisecond] = useState(0);
  const [isTimeActive, setIsTimeActive] = useState(true);

  function handleShowPopUp(){
    setShowPopUp(true);
  }

  function handleHidePopup(){
    setShowPopUp(false);
  }

  return (
    <>
      
      <div className="header">
        <button id='change-category-btn'>
          <i className="fa-solid fa-list"></i>
          Kategorie ändern
        </button>

        <h1>Memory</h1>

         <StopWatch 
          millisecond={millisecond}
          setMillisecond={setMillisecond}
          isTimeActive={isTimeActive}
          setIsTimeActive={setIsTimeActive}
         />

      </div>
  
      
      <BoardGame 
        millisecond={millisecond}
        setMillisecond={setMillisecond}
        isTimeActive={isTimeActive}
        setIsTimeActive={setIsTimeActive}
      />

      <button id='heart-btn' onMouseEnter={handleShowPopUp} onMouseLeave={handleHidePopup}>
        <i className="fa-solid fa-heart"></i>
      </button>

      {showPopUp && (
        <>
          <div id="pop-up">
            <p>Für O & E</p>
            {/* <p>Illustrationen von: Meiner lieben Schwester</p> */}
          </div>
        </>
      ) }
      
    </>
  )

  
}

function StopWatch({millisecond, setMillisecond, isTimeActive, setIsTimeActive}){

  // increment time 
  useEffect(() =>{
    let interval = null;

    if(isTimeActive){
      interval = setInterval(() => {
        setMillisecond((prev) => prev+1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimeActive])

  

  // console.log(millisecond)

  // if 1000 ms => 1s, 60s => 1min, 60 min => 1h, 
  
  function convertTime(seconds){

    const hours = Math.floor(seconds / 3600); // 1h => 3600 s, 

    const minutes = Math.floor((seconds / 60) % 60); // how many minutes (seconds/60) => remainder bc of hours

    const secs = Math.floor(seconds % 60); // remainder of 1 minute

    
    return { hours: String(hours).padStart(2, "0"), 
             minutes: String(minutes).padStart(2, "0"), 
             seconds: String(secs).padStart(2, "0") };
  }
  
  const{hours, minutes, seconds} = convertTime(millisecond);
  
  return(
    
    <div className="stop-watch-container">
      <div className="time">{hours}</div>
      <div className="time">{minutes}</div>
      <div className="time">{seconds}</div>
    </div>
  
    )


}

let cards_text = ["Cat", "Dog" , "Cat", "Dog", "Tree", "Tree"]
let cards = ["5", "5", "4", "4", "3", "3"]
cards = cards.sort(() => Math.random() - 0.5);

function BoardGame({millisecond, setMillisecond, isTimeActive, setIsTimeActive}){
  const possibleMatches = new Set(cards).size;

  const [flippedCards, setFlippedCards] = useState([]);
  const { width, height } = useWindowSize();
  const [hasWon, setHasWon] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  function handleCardClick(index) {

    // if card is already flipped, do nothing
    if(flippedCards.includes(index) || isBusy) return;

    // add the newly flipped card to the already flipped cards
    let newFlipped = [...flippedCards, index];

    // update Flipped Cards
    setFlippedCards(newFlipped); 

    // if a pair is open => even number of flipped cards
    if(newFlipped.length % 2 === 0){

      // set variable for first and second card
      let first,second;

      
      if(newFlipped.length === 2){
        // length = 2 => first and second = newFlipped cards
        [first, second] = newFlipped;
      }else {
        // if length != 2 => get the last two cards that were flipped 
        [first, second] = newFlipped.slice(-2);
      }

      setIsBusy(true)
      // set timeout for next part do adapt to flip animation
      setTimeout(() => {
        // MATCH
        if (cards[first] === cards[second]) {
         
          // if flipped cards equals number of cards => win!
          if(newFlipped.length === cards.length){
            setHasWon(true);
            setIsTimeActive(false);
          }

          setIsBusy(false);
            

        } else {
          // NO MATCH
          // if no match, turn around the cards (default) which are not matching
          setTimeout(() => {
            setFlippedCards(prev => prev.filter(i => i !== first && i !== second))
            setIsBusy(false)}, 100);
        }
      }, 1000)
    }


    

  }

  function resetGame(){
    setFlippedCards([]); 
    setHasWon(false);
    setIsBusy(false);
    cards = cards.sort(() => Math.random() - 0.5);

    setMillisecond(0)
  }

  function closeWinningOverlay(){
    setHasWon(false)
  }


  return(
    <>
      <div className="game-container">
        <div className="board-game">
          <div className='board-row'>
            <MemoryCard value={cards[0]}  isFlipped={flippedCards.includes(0)} onCardClick={(event) => handleCardClick(0)}/>
            <MemoryCard value={cards[1]}  isFlipped={flippedCards.includes(1)} onCardClick={(event) => handleCardClick(1)}/>
            <MemoryCard value={cards[2]}  isFlipped={flippedCards.includes(2)} onCardClick={(event) => handleCardClick(2)}/>
          </div>
          <div className='board-row'>
            <MemoryCard value={cards[3]}  isFlipped={flippedCards.includes(3)} onCardClick={(event) => handleCardClick(3)}/>
            <MemoryCard value={cards[4]}  isFlipped={flippedCards.includes(4)} onCardClick={(event) => handleCardClick(4)}/>
            <MemoryCard value={cards[5]}  isFlipped={flippedCards.includes(5)} onCardClick={(event) => handleCardClick(5)}/>
          </div>
        
        </div>
        <button id='restart-game' onClick={resetGame}>
          <i className="fa-solid fa-arrow-rotate-left"></i>
          Neu beginnen
        </button>
      </div>
      {/* show Confetti if all matches found (hasWon = true) */}
      {hasWon  && ( 
        <>
          <div className='new-game-wrapper'>
            <div className="new-game-container">
              <div className="close-wrapper">
                <button id='close-winning-overlay-btn' onClick={closeWinningOverlay}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
          
              <h2>Du hast gewonnen!</h2>

              <button id="start-new-game" onClick={resetGame}>
                <i className="fa-solid fa-arrow-rotate-left"></i>
                Weitere Runde
              </button>

            </div>

          </div>
          <Confetti width={width} height={height} />
        </>)}
    </>
  )
}

function MemoryCard( {value, isFlipped, onCardClick}){


  return (
    <div
      className={`memory-card ${isFlipped ? "flipped" : ""}`}
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCardClick()
        }
      }}
    >
      <div className="memory-card-inner">
        <div className="memory-card-front">
          
        </div>
        <div className="memory-card-back">
          <img src={`/assets/dinosaurier/${value}.png`} alt={value} /></div>
      </div>
    </div>
  );

}

export default App
