const cards = document.querySelectorAll(".feature-card");

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="scale(1.05)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="scale(1)";

});

});

function animateValue(id, start, end, duration){

    const obj = document.getElementById(id);

    if(!obj) return;

    let current = start;

    const increment = (end-start)/(duration/20);

    const timer = setInterval(()=>{

        current += increment;

        obj.innerText = Math.floor(current);

        if(current >= end){

            obj.innerText = end;

            clearInterval(timer);

        }

    },20);

}

animateValue("usersCount",0,250,2000);

animateValue("reportsCount",0,1800,2000);

animateValue("rewardCount",0,6500,2000);

const images=[

"images/1.jpg",

"images/2.jpg",

"images/3.jpg",

"images/4.jpg"

];

let current=0;

setInterval(()=>{

current++;

if(current>=images.length){

current=0;

}

document.getElementById("sliderImage").src=images[current];

},3000);

function toggleDarkMode(){

document.body.classList.toggle("dark");

}

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll(".feature-card,.stat-card").forEach(card=>{

observer.observe(card);

});

// Open Login Popup
document.getElementById("loginBtn").onclick = function () {

    document.getElementById("loginPopup").style.display = "flex";

};

// Open Signup Popup
document.getElementById("signupBtn").onclick = function () {

    document.getElementById("signupPopup").style.display = "flex";

};

// Join Now -> Signup Popup
document.getElementById("joinBtn").onclick = function () {

    document.getElementById("signupPopup").style.display = "flex";

};

// Login Button
document.getElementById("loginBtn").onclick = function () {

    document.getElementById("loginPopup").style.display = "flex";

};

// Signup Button
document.getElementById("signupBtn").onclick = function () {

    document.getElementById("signupPopup").style.display = "flex";

};

// Hero Get Started
document.getElementById("getStartedBtn").onclick = function () {

    document.getElementById("signupPopup").style.display = "flex";

};

// About Join Now
document.getElementById("joinBtn").onclick = function () {

    document.getElementById("signupPopup").style.display = "flex";

};

// Footer Login
document.getElementById("footerLogin").onclick = function (e) {

    e.preventDefault();

    document.getElementById("loginPopup").style.display = "flex";

};

// Footer Signup
document.getElementById("footerSignup").onclick = function (e) {

    e.preventDefault();

    document.getElementById("signupPopup").style.display = "flex";

};