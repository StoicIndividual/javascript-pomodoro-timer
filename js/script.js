// Basic element variables
const start = document.querySelector('#container #buttons #start');
const startBeep = new Audio('./audio/start.ogg');
const reset = document.querySelector('#container #buttons #reset');
const resetBeep = new Audio('./audio/reset.ogg');
const resume = document.querySelector('#container #buttons #resume');
const pauseBeep = new Audio('./audio/pause.ogg');
const ledIndicator = document.querySelector('#container #led-indicator');
const tTimeHours = document.querySelector('#container #info-bar #total-time #t-time-hours');
const tTimeMinutes = document.querySelector('#container #info-bar #total-time #t-time-minutes');
const tTimeSeconds = document.querySelector('#container #info-bar #total-time #t-time-seconds');
const cTimeMinutes = document.querySelector('#container #timer-container #c-time-minutes')
const cTimeSeconds = document.querySelector('#container #timer-container #c-time-seconds')
const quarterCounter = document.querySelector('#container #info-bar #counter-digit');

// switcher indicates whether function should run or not
let switcher = true;
// a function that calculates the total time spent from seconds (divides everything by zero)
const calculateTotalSeconds= (n) => {
    // adds the 0 infront of 1 digit numbers but also is responsible for placing the time in the html element
    const totalTimeSpent= ()=>{
	let minutes = Math.floor(n/60);
	let hours = Math.floor(minutes/60);
	const calculateMinutes = () => {
	    const calculateHours = () => {
		if (hours>0) {
		    if (hours >= 24) {
			// should reset total time spent
			n=0;
			tTimeSeconds.innerHTML = '00';
			tTimeMinutes.innerHTML = '00';
			tTimeHours.innerHTML = '00';
		    } else {
			if (hours < 10) {
			    tTimeHours.innerHTML = `0${hours}`
			} else {
			    tTimeHours.innerHTML = hours++;
			}
		    }
		} else {
		    tTimeHours.innerHTML = `0${hours};`
		}
	    };
	    // make sure minutes is over 0 in order to increment
	    if (minutes>0) {
		if (minutes >= 60) {
		    let correctedMinutes= minutes%60;
		    if (correctedMinutes < 10) {
			tTimeMinutes.innerHTML = `0${correctedMinutes}`;
		    } else {
			tTimeMinutes.innerHTML = correctedMinutes;
		    }
		    calculateHours();
		} else {
		    if (minutes < 10) {
			tTimeMinutes.innerHTML = `0${minutes++}`;
		    } else {
			tTimeMinutes.innerHTML = minutes++;
		    }
		}
	    } else {
		// obviously going to be only the first minute
		tTimeMinutes.innerHTML = `0${minutes}`;
	    } 
	};
	if (n >= 60) {
	    // display "fake" time while n (the total seconds) runs in the background
	    let correctedSeconds = n%60;
	    if (correctedSeconds<10) {
		tTimeSeconds.innerHTML = `0${correctedSeconds}`;
	    } else {
		tTimeSeconds.innerHTML = correctedSeconds;
	    }
	    calculateMinutes();
	} else {
	    if (n<10) {
		tTimeSeconds.innerHTML = `0${n}`;
	    } else {
		tTimeSeconds.innerHTML = n;
	    }
	}
    };
    // every 1 second increment digit, creating the timer for total time spent
    setTimeout(()=>{
	if (switcher) {
	    // console.log(n);
	    totalTimeSpent();
	    calculateTotalSeconds(n);
	} else {
	    return false;
	}
    }, 1000);
    n++;
};
// a function that calculates the countdown of the pomodoro clock, it also keeps track of the break time too, and increments the counter every 25 minutes
const calculateCountdown = () => {
    let counter = 0;
    const startLongBreak = (n) => {
	let seconds = n%60;
	let minutes = Math.floor(n/60);
	    if (n > 0) {
		// decide whether to loop or stop
		setTimeout(()=>{
		    if (switcher) {
			console.log(n);
			startLongBreak(n);
		    } else {
			return false;
		    }
		}, 1000);
		// decrease and display
		n--;
		const calculateSeconds = () => {
		    if (seconds < 10) {
			cTimeSeconds.innerHTML = `0${seconds}`;
		    } else {
			cTimeSeconds.innerHTML = seconds;
		    }
		};
		const calculateMinutes = () => {
		    if (minutes < 10) {
			cTimeMinutes.innerHTML = `0${minutes}`;
		    } else {
			cTimeMinutes.innerHTML = minutes;
		    }
		};
		calculateSeconds();
		calculateMinutes();
	    } else {
		// reset counter after long break, and start the pomodoro timer again and play a beep
		cTimeSeconds.innerHTML = '00';
		counter = 0;
		quarterCounter.innerHTML = counter;

		startBeep.play();
		startPomodoro(1500);
	    }
    };
    const startShortBreak = (n) => {
	ledIndicator.style.backgroundColor = '#FFFF00';
	let seconds = n%60;
	let minutes = Math.floor(n/60);
	if (counter < 4) {
	    if (n > 0) {
		// decide whether to loop or stop
		setTimeout(()=>{
		    if (switcher) {
			console.log(n);
			startShortBreak(n);
		    } else {
			return false;
		    }
		}, 1000);
		// decrease and display
		n--;
		const calculateSeconds = () => {
		    if (seconds < 10) {
			cTimeSeconds.innerHTML = `0${seconds}`;
		    } else {
			cTimeSeconds.innerHTML = seconds;
		    }
		};
		const calculateMinutes = () => {
		    if (minutes < 10) {
			cTimeMinutes.innerHTML = `0${minutes}`;
		    } else {
			cTimeMinutes.innerHTML = minutes;
		    }
		};
		calculateSeconds();
		calculateMinutes();
	    } else {
		cTimeSeconds.innerHTML = '00';

		startBeep.play();
		startPomodoro(1500);
	    }
	} else {
	    // start long break and play pause beep
	    pauseBeep.play();
	    startLongBreak(1800);
	}
    };
    const startPomodoro = (n) => {
	ledIndicator.style.backgroundColor = '#00CC00';
	/* the idea of placing the decrement outside of the setTimeout is
	 * so that it runs befor the delay, instead of waiting 1 second
	 * for 3500 to become 3500, you wait 1 second for 3500 to become
	 * 3499 */
	let seconds = n%60;
	let minutes = Math.floor(n/60);
	if (n>0) {
	    // decide whether to loop or stop
	    setTimeout(()=>{
		if (switcher) {
		    console.log(n);
		    startPomodoro(n);
		} else {
		    return false;
		}
	    }, 1000);
	    // decrease and display
	    n--;
	    const calculateSeconds = () => {
		if (seconds < 10) {
		    cTimeSeconds.innerHTML = `0${seconds}`;
		} else {
		    cTimeSeconds.innerHTML = seconds;
		}
	    };
	    const calculateMinutes = () => {
		if (minutes < 10) {
		    cTimeMinutes.innerHTML = `0${minutes}`;
		} else {
		    cTimeMinutes.innerHTML = minutes;
		}
	    };
	    calculateSeconds();
	    calculateMinutes();
	} else {
	    // increment counter
	    cTimeSeconds.innerHTML = '00';
	    counter++;
	    quarterCounter.innerHTML=counter;

	    // start break and play pause beep
	    pauseBeep.play();
	    startShortBreak(300);
	}
    }
    // call the function to start the pomodoro timer
   startPomodoro(1500);
};

start.addEventListener('click', ()=>{
    // set switcher to true
    switcher = true;
    // start total time spent, params are number of seconds (86400 seconds in 24 hours, it would reset the total time spent, in other words, -1 seconds is the same as 86400 seconds) 
    calculateTotalSeconds(0);
    // start the countdown
    calculateCountdown();
    // override previous audio with new audio
    resetBeep.pause();
    resetBeep.currentTime = 0;
    // play audio
    startBeep.play();
    // hide start button
    start.style.display='none';
    // change led status
    ledIndicator.style.backgroundColor = '#00CC00';
    // reveal reset button
    reset.style.display='block';
});

reset.addEventListener('click', ()=>{
    // set switcher to false
    switcher = false;
    // reset elements to default values
    tTimeSeconds.innerHTML = '00';
    tTimeMinutes.innerHTML = '00';
    tTimeHours.innerHTML = '00';
    cTimeMinutes.innerHTML = '25';
    cTimeSeconds.innerHTML = '00';
    quarterCounter.innerHTML = '0';
    // override previous audio with new audio
    startBeep.pause();
    startBeep.currentTime = 0;
    // play audio
    resetBeep.play();
    // hide reset button
    reset.style.display='none';
    // hide resume button in case
    resume.style.display='none';
    // change led status
    ledIndicator.style.backgroundColor= '#F00';
    // reveal start button
    start.style.display='block';
});
