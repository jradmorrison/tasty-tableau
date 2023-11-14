/**
 * Handles the submission of the signup form by sending a POST request to the server with the provided user details.
 * Redirects to the homepage on successful signup; displays an alert on signup failure.
 * @param {Event} event - The event object triggering the function (usually a form submission event).
 * @returns {Promise<void>} - Redirects to the homepage on successful signup; displays an alert on signup failure.
 */
const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (username && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }
};

///////////////////////////////////////////////////////////////////
//                      Event Listenters
///////////////////////////////////////////////////////////////////
document.querySelector('#submit').addEventListener('click', signupFormHandler);
