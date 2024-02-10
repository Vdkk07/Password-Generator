const passwordDisplay = document.querySelector("[data-PassowordDisplay]");
const lengthDisplay = document.querySelector("[data-LengthNumber]");
const inputSlider = document.querySelector("[data-LengthSlider]");
const copyBtn = document.querySelector("[data-Copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const Indicator = document.querySelector("[data-Indicator]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const generatePassBtn = document.querySelector(".generatePass");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+=-`~{}:"<>?[];,./';

//* initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleSlider();

//* set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerHTML = passwordLength;
//! formula for slider color
   const min = inputSlider.min;
   const max = inputSlider.max;
   inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
function setIndicator(color) {
    Indicator.style.backgroundColor = color;
    Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
  return getRandomInteger(0, 9);
}
function getRandomLowercase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}
function getRandomUppercase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}
function getRandomSymbols() {
  const randSym = getRandomInteger(0, symbols.length);
  return symbols.charAt(randSym);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbols = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbols = true;

  if (
    hasUpper &&
    hasLower &&
    (hasNumber || hasSymbols) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbols) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText = "copied";
  }
  catch(e) {
      copyMsg.innerText = "Failed";
  }
  //*to make copy wala span visible
  copyMsg.classList.add("active");

  setTimeout( () => {
      copyMsg.classList.remove("active");
  },2000);

}
function shufflePassword(array) {
  //!Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //? Random J find out using random function

    const j = Math.floor(Math.random() * (i + 1));

    //? swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  //? Make empty string for store the suffle values one by one
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}
allCheckBox;
function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }

    //* special condition
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (password.length > 0) {
    copyContent();
  }
});

generatePassBtn.addEventListener("click", () => {
  //* none of the checkbox is selected
  if (checkCount == 0) return;

  //* special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //* let's starts find new password

  //* remove old password
  password = "";

  //*  let's put the stuff mentioned in checkbox

  let funArr = [];

  if (uppercaseCheck.checked) {
    funArr.push(getRandomUppercase);
  }
  if (lowercaseCheck.checked) {
    funArr.push(getRandomLowercase);
  }
  if (numbersCheck.checked) {
    funArr.push(getRandomNumber);
  }
  if (symbolsCheck.checked) {
    funArr.push(getRandomSymbols);
  }

  //*   compulsory addition
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  //* remaining addition
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randomIndex = getRandomInteger(0, funArr.length);

    password += funArr[randomIndex]();
  }

  //*   shuffle the password
  password = shufflePassword(Array.from(password));

  //* show in UI
  passwordDisplay.value = password;

  //* calculate strength
  calcStrength();
});
