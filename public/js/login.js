// Handle user login
const loginFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    let locFromStorage = localStorage.getItem('location');
    let location = JSON.parse(locFromStorage);
    // localStorage.removeItem('location');
    console.trace(location);

    // location = location.slice(56);

    // if (location == 'login') {
    //   location = '/';
    // };
    
    if (response.ok) {
      console.log(location);
      if (location == null || location == undefined || location == 'undefined') {
        window.location.replace('/');
      } else {
        window.location.href = location;
      }
      // document.location.replace(`/`);
    } else {
      await alert('Incorrect username or password');
      document.location.reload();
    }
  }
};

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
