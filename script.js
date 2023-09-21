'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-08-18T21:31:17.178Z',
    '2023-08-23T07:42:02.383Z',
    '2023-08-28T09:15:04.904Z',
    '2023-08-29T10:17:24.185Z',
    '2023-09-11T14:11:59.604Z',
    '2023-09-15T17:01:17.194Z',
    '2023-09-16T20:36:17.929Z',
    '2023-09-17T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-09-01T13:15:33.035Z',
    '2023-09-30T09:48:16.867Z',
    '2023-09-25T06:04:23.907Z',
    '2023-09-25T14:18:46.235Z',
    '2023-09-05T16:33:06.386Z',
    '2023-09-10T14:43:26.374Z',
    '2023-09-16T18:49:59.371Z',
    '2023-09-17T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const dateFunc = date => {
  const calcDate = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const displayDate = calcDate(new Date(), date);

  if (displayDate === 0) return `Today`;
  if (displayDate === 1) return `Yesterday`;
  if (displayDate < 7) return `${displayDate} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = `${date.getFullYear()}`.padStart(2, 0);
    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const dateParsed = dateFunc(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${dateParsed}</div>
      <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth()}`.padStart(2, 0);
    const year = `${now.getFullYear()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);

    const displayDate = `${day}/${month}/${year}, ${hour}:${min}`;

    labelDate.textContent = displayDate;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //creating date
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //creating date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// const date = new Date(2023, 8, 17);
// console.log(date);

// console.log(calcDate(date, new Date()));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// // Convrting and Checking Numbers
// // numbers are represented as floating point numbers

// //Numbers are represented in binary and bases:
// //Base 10 -> numbners from 0 - 9
// //Binary base 2 -> numbers 0 and 1

// console.log(23 === 23.0); /* This result will return true */

// console.log(+'23'); /* Convert string to number */

// // Parcing
// console.log(Number.parseInt('30xr'));
// console.log(Number.parseInt('rx30'));

// console.log(parseFloat(`2.5rem`));

// //Check if value is not a Number
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(Number.parseInt('rx30')));

// //Check if value is a number
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20'));
// console.log(Number.isFinite('25em'));
// console.log(Number.isFinite(parseFloat('35rem')));

// //Check if value is an integer
// console.log(Number.isInteger(parseFloat('35rem')));

// //MATH AND ROUND.

// //squreroots.
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// //Maximum number from an option/ array.

// const arr = [1, 2, 3, 4, '100', 45, 20, 60];
// const arr2 = [-1, -2, -3, -4, parseInt('-90px'), -45, -20, -60];

// console.log(Math.max(...arr));
// console.log(Math.max(...arr2));

// console.log(Math.min(...arr));
// console.log(Math.min(...arr2));

// console.log(Math.PI * parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6 + 1));

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + min + 1);
// // 0...1 -> 0...(min, max) -> 0 + min ....(min, max) + min -> min...max

// // console.log(randomInt(30, 35));

// // Rounding integers

// // Math.trunc will always return the number without rounding-up with both positive and negative numbers
// console.log(Math.trunc(23.3));
// console.log(Math.trunc(23.9));

// // Math.ceil will always round up on all positive nunmbers and will return the intiger on negative values
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// //floor will always round up on negative numbers and return the Intiger on positive values
// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.ceil(23.3) === Math.floor(-23.9));

// //Rounding decimals.
// //Rounding the numbers with toFixed will always return a string

// console.log((23).toFixed(2));
// console.log((23.01).toFixed(1));
// console.log((23.2368).toFixed(2));

// // Remainder
// console.log(5 % 2);
// console.log(5 / 2);

// console.log(8 % 5);

// const even = n => n % 2;

// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'red';
//     }
//   });
// });

// // Big Int
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(1372378261863287392981767882731986123871n);
// console.log(
//   BigInt(
//     1372378261863287392981767882731986123871 *
//       100038923909 *
//       3947293729382932983 -
//       3293729382983298
//   )
// );

// // Date and time
// const now = new Date();
// console.log(now);

// console.log(new Date('Sep 16 2023 23:48:39'));
// console.log(new Date('december 27 1986'));
// console.log(new Date(account1.movementsDates[2]));

// console.log(`Date`);
// console.log(new Date(1993, 4, 17, 23, 56, 30));

// console.log(new Date(93, 4, 17));

// // time stamp
// console.log(0);
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(new Date(86400000));

// // CREATING DATE
// const futher = new Date(1993, 4, 17, 23, 56);
// console.log(futher);
// console.log(futher.getFullYear());
// console.log(futher.getMonth());
// console.log(futher.getDate());
// console.log(futher.getHours());
// console.log(futher.getMinutes());
// console.log(futher.getSeconds());
// console.log(futher.getMilliseconds());

const time = date => {
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth()}`.padStart(2, 0);
  const year = `${date.getFullYear()}`.padStart(2, 0);
  const hour = `${date.getHours()}`.padStart(2, 0);
  const min = `${date.getMinutes()}`.padStart(2, 0);
  const displayDate = `${day}/${month}/${year}, ${hour}:${min}`;
  return displayDate;
};

document.addEventListener('keydown', e => {
  const interval = calcDay(e.timeStamp);
  const type = interval > 60 ? 'min' : 'sec';
  console.log(
    `After ${Math.round(interval)}${type}, The ${
      e.code
    } key was pressed on: ${time(new Date(e.timeStamp))}`
  );
});

const calcDay = timeStamp => timeStamp / 1000;

let activePlayer = 0;

document.addEventListener('keypress', e => {
  console.log(e);
  activePlayer = activePlayer === 0 ? 1 : 0;
  console.log(activePlayer);
  labelWelcome.classList.toggle();
});
