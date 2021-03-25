import { Observable } from "rxjs";

let satrtStopToggle = false;
let subscription;
let savedCounterValue;
let timeFirstClick;
let timeSecondClick;
const secsShown = document.querySelector('.secs');
const minsShown = document.querySelector('.mins');
const hoursShown = document.querySelector('.hours');
secsShown.textContent = "00";
minsShown.textContent = "00";
hoursShown.textContent = "00";
const wait = document.querySelector(".wait");
const reset = document.querySelector(".reset");
const startStop = document.querySelector(".startStop");
wait.addEventListener("click", (e) => {console.log('ss'),
  handleWait(e);
});
reset.addEventListener("click", () => {
  handleReset();
});
startStop.addEventListener("click", () => {
  handlestartStop();
});

const timer = new Observable((observer) => {
  let counter = 1;
  const timerInterval = setInterval(() => {
    observer.next(counter++);
    console.log(counter)
    savedCounterValue ? savedCounterValue++ : (savedCounterValue = counter);
  }, 1000);
  return () => clearInterval(timerInterval);
});

const subscriptionFunction = (savedCounterValue) => {
  if (!savedCounterValue) {
    savedCounterValue = 0;
  }
  return (subscription = timer.subscribe({
    next: (value) => {
      value = value + savedCounterValue;
      const hours = Math.floor(value / (60 * 60));
      const mins = Math.floor(value / 60);
      Math.floor(value % 60) < 10
        ? (secsShown.textContent = "0" + Math.floor(value % 60))
        : (secsShown.textContent = Math.floor(value % 60));
      mins < 10
        ? (minsShown.textContent = "0" + mins)
        : (minsShown.textContent = mins);
      hours < 10
        ? (hoursShown.textContent = "0" + hours)
        : (hoursShown.textContent = hours);
    },
  }));
};

const handlestartStop = () => {
  satrtStopToggle = !satrtStopToggle;
  satrtStopToggle
    ? subscriptionFunction(savedCounterValue)
    : (subscription.unsubscribe(), (savedCounterValue = 0));
};

const handleWait = (e) => {
  let clearClick;
  if (timeFirstClick) {
    timeSecondClick = e.timeStamp;
    clearTimeout(clearClick);
  } else {
    timeFirstClick = e.timeStamp;
    clearClick = setTimeout(() => {
      timeFirstClick = null;
    }, 350);
  }
  Number(timeSecondClick) - Number(timeFirstClick) < 350 &&
    Number(timeSecondClick) - Number(timeFirstClick) > 0 &&
    satrtStopToggle &&
    (subscription.unsubscribe(),
    (satrtStopToggle = !satrtStopToggle),
    console.log("win"),
    (timeFirstClick = null),
    (timeSecondClick = null));
};

const handleReset = () => {
  subscription.unsubscribe();
  savedCounterValue = 0;
  secsShown.textContent = "00";
  minsShown.textContent = "00";
  hoursShown.textContent = "00";
  satrtStopToggle && (satrtStopToggle = !satrtStopToggle);
};
