const rooms = [
  {
    title: "The Inbox",
    scene:
      "A message marked “URGENT” says your account will be locked in ten minutes. It links to a sign-in page and claims to come from the help desk.",
    clue:
      "The sender address does not match the organization, and the real help desk never asks for your password or one-time sign-in code.",
    choices: [
      {
        text: "Open the link and sign in quickly so your account stays active.",
        trap: true,
        feedback:
          "Trap 1 of 5: urgency plus an unexpected sign-in link is a common warning sign. Don't enter credentials through a message link."
      },
      {
        text: "Reply with the one-time code so the help desk can verify you.",
        trap: true,
        feedback:
          "Trap 2 of 5: never share a one-time sign-in code. A legitimate support person does not need it."
      },
      {
        text: "Ignore the link and contact the help desk using its known directory or phone number.",
        trap: false,
        feedback:
          "Safe exit found. You verified the request through a separate, trusted channel instead of using the message's contact details."
      }
    ]
  },
  {
    title: "The Secure Door",
    scene:
      "At the archive entrance, someone carrying boxes says they're a new contractor. They ask you to hold the locked door and then borrow your badge.",
    clue:
      "Visitors must check in at reception. Your badge is personal, and a friendly request does not replace the access procedure.",
    choices: [
      {
        text: "Let them follow you through; they look like they belong here.",
        trap: true,
        feedback:
          "Trap 3 of 5: this is tailgating. Don't let an unverified person follow you through a controlled door; direct them to reception."
      },
      {
        text: "Hand them your badge while you go find reception.",
        trap: true,
        feedback:
          "Trap 4 of 5: badges should never be loaned. Keep yours with you and let authorized staff handle visitor access."
      },
      {
        text: "Keep your badge and ask them to check in at reception.",
        trap: false,
        feedback:
          "Safe exit found. You protected your badge and followed the visitor process without making assumptions."
      }
    ]
  },
  {
    title: "The Archive Terminal",
    scene:
      "A QR card on the terminal promises a “secure archive login.” A note says access expires soon unless you scan it now.",
    clue:
      "The card is unattended, the destination is hidden by the QR code, and the deadline is designed to rush you.",
    choices: [
      {
        text: "Scan the QR code and sign in to restore access.",
        trap: true,
        feedback:
          "Trap 5 of 5: unexpected QR codes can hide untrusted destinations. Use a saved bookmark or verified address, and report the card."
      },
      {
        text: "Skip the QR code, open the archive using its saved bookmark, and report the suspicious card.",
        trap: false,
        feedback:
          "Safe exit found. You avoided an unknown destination, used a trusted route, and reported the suspicious prompt."
      }
    ]
  }
];

let roomIndex = 0;
let alerts = 0;

const roomCount = document.querySelector("#room-count");
const strikesDisplay = document.querySelector("#strikes");
const progressFill = document.querySelector("#progress-fill");
const roomTitle = document.querySelector("#room-title");
const scene = document.querySelector("#scene");
const clue = document.querySelector("#clue");
const clueBox = document.querySelector(".clue");
const question = document.querySelector("#game-content h3");
const choices = document.querySelector("#choices");
const feedback = document.querySelector("#feedback");
const restartButton = document.querySelector("#restart-button");

function renderRoom() {
  const room = rooms[roomIndex];

  roomCount.textContent = `ROOM ${roomIndex + 1} OF ${rooms.length}`;
  strikesDisplay.textContent = `Alerts: ${alerts} / 3`;
  progressFill.style.width = `${(roomIndex / rooms.length) * 100}%`;
  roomTitle.textContent = room.title;
  scene.textContent = room.scene;
  clue.textContent = room.clue;
  feedback.textContent = "";
  feedback.classList.remove("success");
  clueBox.hidden = false;
  question.hidden = false;
  choices.hidden = false;
  restartButton.hidden = true;
  choices.replaceChildren();

  for (const choice of room.choices) {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", () => chooseAction(choice, button));
    choices.append(button);
  }
}

function chooseAction(choice, button) {
  feedback.textContent = choice.feedback;

  if (choice.trap) {
    alerts += 1;
    strikesDisplay.textContent = `Alerts: ${alerts} / 3`;
    button.disabled = true;

    if (alerts === 3) {
      finishGame(false);
    }
    return;
  }

  feedback.classList.add("success");
  for (const choiceButton of choices.querySelectorAll("button")) {
    choiceButton.disabled = true;
  }

  roomIndex += 1;
  progressFill.style.width = `${(roomIndex / rooms.length) * 100}%`;
  if (roomIndex === rooms.length) {
    finishGame(true);
    return;
  }

  window.setTimeout(renderRoom, 1100);
}

function finishGame(escaped) {
  roomCount.textContent = escaped ? "ESCAPE COMPLETE" : "ACCESS LOCKED";
  progressFill.style.width = escaped
    ? "100%"
    : `${(roomIndex / rooms.length) * 100}%`;
  roomTitle.textContent = escaped ? "You made it out." : "The system locked down.";
  scene.textContent = escaped
    ? "You cleared all three rooms by verifying requests, protecting access, and choosing trusted routes."
    : "Three risky choices triggered a security lockout. Review the clues, then try again.";
  clueBox.hidden = true;
  question.hidden = true;
  choices.hidden = true;
  feedback.textContent = escaped
    ? `You escaped with ${alerts} alert${alerts === 1 ? "" : "s"}. Remember: pause, verify independently, and report suspicious requests.`
    : "In real life, stop and ask your security team when a request feels unusual.";
  feedback.classList.toggle("success", escaped);
  strikesDisplay.textContent = `Alerts: ${alerts} / 3`;
  restartButton.hidden = false;
}

restartButton.addEventListener("click", () => {
  roomIndex = 0;
  alerts = 0;
  renderRoom();
});

renderRoom();
