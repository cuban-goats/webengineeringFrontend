export {};
const form = document.getElementById('signup-form') as HTMLFormElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = (document.getElementById('email') as HTMLInputElement).value;
  const username = (document.getElementById('username') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  const response = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });

  if (response.ok) {
    window.location.href = '/login';
  } else {
    const msg = await response.text();
    alert(msg);
  }
});
