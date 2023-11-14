/**
 * Logs the user out by sending a POST request to the server and redirects to the homepage on successful logout.
 * Logs an error message to the console on logout failure.
 * @returns {Promise<void>} - Redirects to the homepage on successful logout; logs an error message on logout failure.
 */
const logout = async () => {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    console.log('Error loggin out');
  }
};

///////////////////////////////////////////////////////////////////
//                      Event Listenters
///////////////////////////////////////////////////////////////////

document.querySelector('#logout').addEventListener('click', logout);
