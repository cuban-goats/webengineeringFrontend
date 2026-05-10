export {};
const container = document.getElementById('answers-container') as HTMLDivElement;
const addBtn = document.getElementById('add-answer') as HTMLButtonElement;
const form = document.getElementById('create-form') as HTMLFormElement;
let answerCount = 2;

addBtn.addEventListener('click', () => {
  if (answerCount >= 6) return;
  answerCount++;
  const row = document.createElement('div');
  row.className = 'answer-row';
  row.innerHTML = `<input type="text" class="answer-input" placeholder="Option ${answerCount}" required />`;
  container.appendChild(row);
  if (answerCount === 6) addBtn.style.display = 'none';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const question = (document.getElementById('question') as HTMLTextAreaElement).value.trim();
  const answerInputs = document.querySelectorAll<HTMLInputElement>('.answer-input');
  const answers = Array.from(answerInputs)
    .map((input) => ({ text: input.value.trim(), votes: 0 }))
    .filter((a) => a.text !== '');

  if (answers.length < 2) {
    alert('Bitte mindestens 2 Optionen angeben.');
    return;
  }

  const username = localStorage.getItem('ranq_username') ?? 'anonymous';
  const post = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    username,
    question,
    answers,
    timestamp: 'just now',
  };

  const stored: object[] = JSON.parse(localStorage.getItem('ranq_posts') ?? '[]');
  stored.unshift(post);
  localStorage.setItem('ranq_posts', JSON.stringify(stored));
  window.location.href = '/start';
});
