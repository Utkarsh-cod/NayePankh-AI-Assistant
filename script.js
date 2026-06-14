const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

const promptButtons =
document.querySelectorAll(".prompt-btn");

function addUserMessage(message){

    const div =
    document.createElement("div");

    div.className =
    "user-message";

    div.textContent =
    message;

    chatBox.appendChild(div);

    chatBox.scrollTop =
    chatBox.scrollHeight;

}

function addBotMessage(message){

    const div =
    document.createElement("div");

    div.className =
    "bot-message";

    div.textContent =
    message;

    chatBox.appendChild(div);

    chatBox.scrollTop =
    chatBox.scrollHeight;

}

function getUserMemory(){

    const memory =
    JSON.parse(
        localStorage.getItem("nayePankhMemory")
    );

    if(!memory){

        return "";

    }

    return `
User Information:

Name: ${memory.name || ""}

Interest: ${memory.interest || ""}

Goal: ${memory.goal || ""}
`;

}

async function askGemini(prompt){

    const memoryContext =
    getUserMemory();

    const response =
    await fetch(
        "http://localhost:3000/chat",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:
                `
${memoryContext}

${prompt}
                `

            })

        }
    );

    const data =
    await response.json();

    return (
        data.reply ||
        "Unable to generate response."
    );

}

async function sendMessage(){

    const message =
    userInput.value.trim();

    if(!message){

        return;

    }

    addUserMessage(message);

    userInput.value = "";

    typingIndicator.style.display =
    "block";

    try{

        const reply =
        await askGemini(message);

        addBotMessage(reply);

    }

    catch(error){

        addBotMessage(
            "Something went wrong while connecting to Gemini."
        );

    }

    typingIndicator.style.display =
    "none";

}

sendBtn.addEventListener(
    "click",
    sendMessage
);

userInput.addEventListener(
    "keypress",
    function(event){

        if(event.key === "Enter"){

            sendMessage();

        }

    }
);

promptButtons.forEach(button=>{

    button.addEventListener(
        "click",
        ()=>{

            userInput.value =
            button.textContent;

            sendMessage();

        }
    );

});
const saveMemoryBtn =
document.getElementById("save-memory");

const loadMemoryBtn =
document.getElementById("load-memory");

const memoryOutput =
document.getElementById("memory-output");

saveMemoryBtn.addEventListener(
    "click",
    ()=>{

        const name =
        document
        .getElementById("memory-name")
        .value
        .trim();

        const interest =
        document
        .getElementById("memory-interest")
        .value
        .trim();

        const goal =
        document
        .getElementById("memory-goal")
        .value
        .trim();

        if(
            !name &&
            !interest &&
            !goal
        ){
            return;
        }

        const memory = {

            name,

            interest,

            goal

        };

        localStorage.setItem(
            "nayePankhMemory",
            JSON.stringify(memory)
        );

        memoryOutput.style.display =
        "block";

        memoryOutput.innerHTML =
        `
        <strong>Profile Saved Successfully</strong>

        <br><br>

        Name: ${name}

        <br>

        Interest: ${interest}

        <br>

        Goal: ${goal}
        `;

    }
);

loadMemoryBtn.addEventListener(
    "click",
    ()=>{

        const memory =
        JSON.parse(
            localStorage.getItem(
                "nayePankhMemory"
            )
        );

        if(!memory){

            memoryOutput.style.display =
            "block";

            memoryOutput.innerHTML =
            "No saved profile found.";

            return;

        }

        memoryOutput.style.display =
        "block";

        memoryOutput.innerHTML =
        `
        <strong>Your Saved Profile</strong>

        <br><br>

        Name: ${memory.name}

        <br>

        Interest: ${memory.interest}

        <br>

        Goal: ${memory.goal}
        `;

    }
);

const volunteerBtn =
document.getElementById(
    "volunteer-btn"
);

const volunteerResult =
document.getElementById(
    "volunteer-result"
);

volunteerBtn.addEventListener(
    "click",
    async ()=>{

        const skill =
        document
        .getElementById("vol-skill")
        .value;

        const interest =
        document
        .getElementById("vol-interest")
        .value;

        const availability =
        document
        .getElementById("vol-availability")
        .value;

        if(
            !skill ||
            !interest ||
            !availability
        ){

            volunteerResult.style.display =
            "block";

            volunteerResult.innerHTML =
            "Please complete all fields.";

            return;

        }

        volunteerResult.style.display =
        "block";

        volunteerResult.innerHTML =
        "Generating recommendation...";

        try{

            const prompt =
            `
Suggest suitable NGO volunteering opportunities.

Skill: ${skill}

Interest: ${interest}

Availability: ${availability}

Provide:

1. Best volunteer role

2. Why it matches

3. Expected contribution

4. Skills gained
`;

            const response =
            await askGemini(prompt);

            volunteerResult.innerHTML =
            response;

        }

        catch(error){

            volunteerResult.innerHTML =
            "Unable to generate recommendation.";

        }

    }
);

const careerBtn =
document.getElementById(
    "career-btn"
);

const careerResult =
document.getElementById(
    "career-result"
);

careerBtn.addEventListener(
    "click",
    async ()=>{

        const year =
        document
        .getElementById("career-year")
        .value;

        const branch =
        document
        .getElementById("career-branch")
        .value;

        const interest =
        document
        .getElementById("career-interest")
        .value;

        if(
            !year ||
            !branch ||
            !interest
        ){

            careerResult.style.display =
            "block";

            careerResult.innerHTML =
            "Please complete all fields.";

            return;

        }

        careerResult.style.display =
        "block";

        careerResult.innerHTML =
        "Generating roadmap...";

        try{

            const prompt =
            `
Create a personalized student roadmap.

Year: ${year}

Branch: ${branch}

Interest: ${interest}

Provide:

1. Skills to learn

2. Projects to build

3. Internship preparation

4. Learning roadmap

5. Career opportunities
`;

            const response =
            await askGemini(prompt);

            careerResult.innerHTML =
            response;

        }

        catch(error){

            careerResult.innerHTML =
            "Unable to generate roadmap.";

        }

    }
);
window.addEventListener(
    "load",
    ()=>{

        const memory =
        JSON.parse(
            localStorage.getItem(
                "nayePankhMemory"
            )
        );

        if(memory){

            document.getElementById(
                "memory-name"
            ).value =
            memory.name || "";

            document.getElementById(
                "memory-interest"
            ).value =
            memory.interest || "";

            document.getElementById(
                "memory-goal"
            ).value =
            memory.goal || "";

            setTimeout(()=>{

                addBotMessage(
`Welcome back ${memory.name || "Friend"}!

I remember that your interest is "${memory.interest || "Not specified"}" and your goal is "${memory.goal || "Not specified"}".

How can I help you today?`
                );

            },1000);

        }

    }
);

window.addEventListener(
    "error",
    (event)=>{

        console.error(
            "Application Error:",
            event.error
        );

    }
);

async function testConnection(){

    try{

        const response =
        await fetch(
            "http://localhost:3000"
        );

        if(response.ok){

            console.log(
                "Backend Connected Successfully"
            );

        }
        else{

            console.log(
                "Backend Connection Failed"
            );

        }

    }

    catch(error){

        console.log(
            "Backend Error"
        );

    }

}

testConnection();

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor=>{

    anchor.addEventListener(
        "click",
        function(e){

            e.preventDefault();

            document
            .querySelector(
                this.getAttribute("href")
            )
            .scrollIntoView({

                behavior:"smooth"

            });

        }
    );

});

const allInputs =
document.querySelectorAll(
    "input, select"
);

allInputs.forEach(input=>{

    input.addEventListener(
        "focus",
        ()=>{

            input.style.transition =
            "0.3s";

        }
    );

});

function clearChat(){

    chatBox.innerHTML =
    `
    <div class="bot-message">
    Hello 👋

    I am the NayePankh AI Assistant.

    I can help you with volunteering,
    internships, donations and career guidance.
    </div>
    `;

}

console.log(
    "NayePankh AI Assistant Loaded Successfully"
);