let limit=2;
let selectedDays=[];
let saved=0;
let friendsChoice=null;
let ateChoice=null;
let timerSeconds=600;
let timerID=null;

const limitInput=document.getElementById("limit");
const dayButtons=[...document.querySelectorAll(".days button")];
const left=document.getElementById("left");
const limitTop=document.getElementById("limitTop");
const total=document.getElementById("total");
const dayMessage=document.getElementById("dayMessage");
const amountArea=document.getElementById("amountArea");
const amountText=document.getElementById("amountText");
const amount=document.getElementById("amount");
const feedback=document.getElementById("feedback");

function updateDays(){
  dayButtons.forEach(btn=>{
    const on=selectedDays.includes(btn.dataset.day);
    btn.classList.toggle("selected",on);
    btn.classList.toggle("blocked",!on && selectedDays.length>=limit);
  });
  limitTop.textContent=limit;
  left.textContent=Math.max(limit-selectedDays.length,0);
  dayMessage.textContent=`choose up to ${limit} day${limit===1?"":"s"}.`;
}

dayButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    const day=btn.dataset.day;
    if(selectedDays.includes(day)){
      selectedDays=selectedDays.filter(d=>d!==day);
    }else if(selectedDays.length<limit){
      selectedDays.push(day);
    }else{
      dayMessage.textContent=`you already chose ${limit} day${limit===1?"":"s"}.`;
      return;
    }
    updateDays();
  });
});

limitInput.addEventListener("input",()=>{
  limit=Math.max(0,Math.min(7,Math.round(Number(limitInput.value)||0)));
  limitInput.value=limit;
  if(selectedDays.length>limit) selectedDays=selectedDays.slice(0,limit);
  updateDays();
});

document.getElementById("friends").addEventListener("click",e=>{
  if(!e.target.matches("button"))return;
  friendsChoice=e.target.dataset.choice;
  [...e.currentTarget.children].forEach(b=>b.classList.toggle("selected",b===e.target));
});

document.getElementById("ate").addEventListener("click",e=>{
  if(!e.target.matches("button"))return;
  ateChoice=e.target.dataset.choice;
  [...e.currentTarget.children].forEach(b=>b.classList.toggle("selected",b===e.target));
  amountArea.classList.remove("hidden");
  amountText.textContent=ateChoice==="no"?"how much money did you save?":"how much money did you spend?";
  amount.value="";
  amount.focus();
});

document.getElementById("add").addEventListener("click",()=>{
  const value=Number(amount.value);
  if(!value || value<=0 || !ateChoice){
    feedback.textContent="enter an amount first.";
    return;
  }

  if(ateChoice==="no"){
    saved+=value;
    feedback.textContent=`$${value.toFixed(2)} added to your savings.`;
  }else{
    saved-=value;
    feedback.textContent=`$${value.toFixed(2)} taken away from your savings.`;
  }

  total.textContent=saved<0?`-$${Math.abs(saved).toFixed(2)}`:`$${saved.toFixed(2)}`;
  amount.value="";
});

const timer=document.getElementById("timer");
const circle=document.getElementById("timerCircle");
const start=document.getElementById("start");
const cancel=document.getElementById("cancel");

function drawTimer(){
  const m=Math.floor(timerSeconds/60);
  const s=timerSeconds%60;
  timer.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  circle.style.setProperty("--p",`${((600-timerSeconds)/600)*360}deg`);
}

start.addEventListener("click",()=>{
  if(timerID)return;
  start.classList.add("hidden");
  cancel.classList.remove("hidden");
  timerID=setInterval(()=>{
    timerSeconds--;
    drawTimer();
    if(timerSeconds<=0){
      clearInterval(timerID);
      timerID=null;
      start.classList.remove("hidden");
      cancel.classList.add("hidden");
      start.textContent="start again";
      alert("10 minutes are up. do you still really want to eat out?");
    }
  },1000);
});

cancel.addEventListener("click",resetTimer);

function resetTimer(){
  clearInterval(timerID);
  timerID=null;
  timerSeconds=600;
  drawTimer();
  start.classList.remove("hidden");
  cancel.classList.add("hidden");
  start.textContent="start";
}

document.getElementById("resetWeek").addEventListener("click",()=>{
  limit=2;
  selectedDays=[];
  saved=0;
  friendsChoice=null;
  ateChoice=null;
  limitInput.value=2;
  total.textContent="$0.00";
  feedback.textContent="";
  amountArea.classList.add("hidden");
  document.querySelectorAll(".choice button").forEach(b=>b.classList.remove("selected"));
  resetTimer();
  updateDays();
});

updateDays();
drawTimer();
