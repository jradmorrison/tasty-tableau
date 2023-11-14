/**
 * Handles the submission of the login form by sending a POST request to the server with the provided username and password.
 * Redirects the user to the previously stored location or the homepage on successful login; displays an alert on login failure.
 * @param {Event} event - The event object triggering the function (usually a form submission event).
 * @returns {Promise<void>} - Redirects the user upon successful login; displays an alert on login failure.
 */
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

///////////////////////////////////////////////////////////////////
//                      Event Listenters
///////////////////////////////////////////////////////////////////

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
