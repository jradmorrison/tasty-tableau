// Handles logging a user out
const logout = async () => {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  localStorage.removeItem('location');

  if (response.ok) {
    document.location.replace('/');
  } else {
    console.log('Error loggin out');;
  }
};

document.querySelector('#logout').addEventListener('click', logout);