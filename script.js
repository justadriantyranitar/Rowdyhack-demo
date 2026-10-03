let count = 0;

const countDisplay = document.querySelector("#count");
const countButton = document.querySelector("#count-button");
const resetButton = document.querySelector("#reset-button");

countButton.addEventListener("click", () => {
  count += 1;
  countDisplay.textContent = count;
});

resetButton.addEventListener("click", () => {
  count = 0;
  countDisplay.textContent = count;
});
