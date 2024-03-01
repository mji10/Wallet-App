'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Arjit Verma', //av to join
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Ravi Singh', //rs
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Mohammed Juzer', //mj
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30], // used to calculate balance
  interestRate: 1.5,
  pin: 3333,
};

const accounts = [account1, account2, account3];

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
  ['INR', 'Indian rupee'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//Create function to seperate initials from accounts

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });

  console.log(accs);
};

createUsername(accounts);

// Create a balance display
const calcBalanceDisplay = function (acc) {
  acc.balance = acc.movements.reduce((red, mov) => red + mov, 0);
  labelBalance.textContent = `${acc.balance}`;
};

// Display deposits and withdrawals
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}
    </div>
    <div class="movements__value">${mov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculating Money In and Money Out
// Money In

const displaySummary = function (acc) {
  const moneyIn = acc.movements
    .filter(mov => mov > 0) //This will see all number in +ve and return a new array with +ve numbers
    .reduce((acc, mov) => acc + mov, 0); //This will add all the +ve numbers
  labelSumIn.textContent = moneyIn;

  // Money Out
  const moneyOut = acc.movements
    .filter(mov => mov < 0) //This will see all number in -ve and return a new array with +ve numbers
    .reduce((acc, mov) => acc + mov, 0); //This will add all the -ve numbers
  labelSumOut.textContent = `${Math.abs(moneyOut)}`;
};

// Add form btn a event listener for log in

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const enteredUsername = inputLoginUsername.value;
  const enteredPassword = inputLoginPin.value;

  console.log(enteredUsername, enteredPassword);

  currentAccount = accounts.find(acc => acc.username === enteredUsername);

  if (currentAccount?.pin === Number(enteredPassword)) {
    showToast('Loan Successful', 'success');
    labelWelcome.textContent = `Welcome Back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    updateUI(currentAccount);
    containerApp.style.opacity = '100';
  } else {
    showToast('Login Error : Invalid Credentionals', 'error');
  }
});

// Create a function if update ui as these are repeated again and again
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcBalanceDisplay(acc);
  displaySummary(acc);
};

// Request Loan Amt Btn
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmt = Number(inputLoanAmount.value);
  if (loanAmt > 0 && loanAmt <= currentAccount.balance * 0.1) {
    currentAccount.movements.push(loanAmt);
    showToast('Loan Successfully Done!', 'success');
  } else {
    showToast(
      'Loan Amount Should be Lesser than 10% of Total Amount.',
      'error'
    );
  }
  updateUI(currentAccount);
  inputLoanAmount.value = ' ';
});

const showToast = function (text, type) {
  Toastify({
    text: text,
    duration: 3000,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: true,
    close: true,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: `${type === 'success' ? 'green' : 'red'}`,
      color: 'white',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};

// Transfer Amount to another account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amountValue = Number(inputTransferAmount.value);

  const recivingAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amountValue > 0 &&
    recivingAcc &&
    currentAccount.balance >= amountValue &&
    recivingAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amountValue);
    recivingAcc.movements.push(amountValue);
    updateUI(currentAccount);
    showToast('Transferred Successfully', 'success');
  } else {
    showToast('Transferred Error', 'error');
  }
});
