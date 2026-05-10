export {};
const form = document.getElementById('login-form') as HTMLFormElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const identifier = (document.getElementById('identifier') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: identifier, password }),
  });

  if (response.ok) {
    const userId = await response.text();
    document.cookie = `userId=${userId}; path=/`;
    localStorage.setItem('ranq_username', identifier);
    window.location.href = '/';
  } else {
    const msg = await response.text();
    alert(msg);
  }
});
