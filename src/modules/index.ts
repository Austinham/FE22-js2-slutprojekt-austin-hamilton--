export const url: string = `https://login-2c7ee-default-rtdb.europe-west1.firebasedatabase.app/`;
const baseurl: string = `${url}users.json`;
console.log(baseurl);

//login with email and password selection
const existingName = document.querySelector('#loginUserName') as HTMLInputElement ;
const existingPassword = document.querySelector('#loginUserPassword') as HTMLInputElement ;
const loginButton = document.querySelector('#loginBtn') as HTMLElement;
const signedInLink = document.querySelector('#loginLink') as HTMLAnchorElement;

//create account button
const makeAccount = document.querySelector('#createAccount') as HTMLElement;
//register selections for password/username
const registerName = document.querySelector('#signup-Name') as HTMLInputElement;
const registerPassword = document.querySelector('#signup-Password') as HTMLInputElement ;
const registerAccount = document.querySelector('#createAccountLink') as HTMLInputElement;

const avatarChoices = document.querySelectorAll('.avatar') as NodeListOf<HTMLInputElement>;
// styles selection

const registerForm = document.querySelector('#createAccountForm') as HTMLElement;
const loginForm = document.querySelector('#login') as HTMLElement;

registerForm.style.display = 'none';

// Register the user
const pickAvatar: string [] = [];

avatarChoices.forEach((avatar) =>{
  avatar.addEventListener('click',() => {
    pickAvatar.shift();
    pickAvatar.push(avatar.value)
  })
})

signedInLink.addEventListener('click',(e) => {
  e.preventDefault();
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';

})

registerAccount.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});


//make account 

makeAccount?.addEventListener('click', maketheAccount)

async function maketheAccount(e: Event): Promise<void> {
  e.preventDefault();

  const registerName = document.querySelector('#signup-Name') as HTMLInputElement;
  const registerPassword = document.querySelector('#signup-Password') as HTMLInputElement;
  const registerImage = document.querySelector('#image-section') as HTMLInputElement;

  const userNameInput: string = registerName.value;
  const passwordInput: string = registerPassword.value;



  const newAccount = {
    username: userNameInput,
    password: passwordInput,
    image: pickAvatar[0]
  };

  const init = {
    method: 'POST',
    body: JSON.stringify(newAccount),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  };

  const response = await fetch(baseurl, init);
  if (response.status === 200 || response.status === 201) {
    // Account created successfully
    console.log('Account created successfully');
    // Show a success message to the user
    const successMessage = document.createElement('div');
    successMessage.innerText = 'Your account has been created successfully!';
    successMessage.style.color = 'green';
    const registerForm = document.querySelector('#createAccountForm') as HTMLElement;
    registerForm.parentElement?.insertBefore(successMessage, registerForm.nextSibling);
  } else {
    // Account creation failed
    console.log('Account creation failed');
    // Show an error message to the user
    const errorMessage = document.createElement('div');
    errorMessage.innerText = 'There was an error creating your account. Please try again later.';
    errorMessage.style.color = 'red';
    const registerForm = document.querySelector('#createAccountForm') as HTMLElement;
    registerForm.parentElement?.insertBefore(errorMessage, registerForm.nextSibling);
  }
}


//check if user exists and is authenticated
loginButton.addEventListener('click', loginVerification);

async function loginVerification(event: Event): Promise<void> {
  event.preventDefault();
  

  try {
      const response = await fetch(baseurl);
      const data = await response.json();
      verifyProcess(data);
  } catch (error) {
      console.log(error);
  }
}

//  function verifyProcess(data: { [key: string]: { username: string, password: string, image: string } }): void {
// const listFromData: { username: string, password: string, image: string }[] = Object.values(data);
// console.log(listFromData,'this is the list from data');
// const userNameInput: string = (document.querySelector('#loginUserName') as HTMLInputElement).value;
// const passwordInput: string = (document.querySelector('#loginUserPassword') as HTMLInputElement).value;
// console.log(data,'2321');
// for (let i = 0; i < listFromData.length; i++) {
//     if (userNameInput === listFromData[i].username && passwordInput === listFromData[i].password) {
//       localStorage.setItem('loggedInUser', JSON.stringify(listFromData[i]));
//         window.location.assign('../html/signin.html');
//         console.log('Welcome');
//         return;
//     }
// }
// alert('User not found.');
// }
function verifyProcess(data: { [key: string]: { username: string, password: string, image: string } }): void {
  const listFromData: { id: string, username: string, password: string, image: string }[] = Object.entries(data).map(([id, user]) => ({ id, ...user }));
  console.log(listFromData,'this is the list from data');
  const userNameInput: string = (document.querySelector('#loginUserName') as HTMLInputElement).value;
  const passwordInput: string = (document.querySelector('#loginUserPassword') as HTMLInputElement).value;
  console.log(data,'2321');
  for (let i = 0; i < listFromData.length; i++) {
      if (userNameInput === listFromData[i].username && passwordInput === listFromData[i].password) {
        localStorage.setItem('loggedInUser', JSON.stringify(listFromData[i]));
          window.location.assign('./signin.html');
          console.log(listFromData[i].id,'Welcome');
          return;
      }
  }
  alert('User not found.');
}


