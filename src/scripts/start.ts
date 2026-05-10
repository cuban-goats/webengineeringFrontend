export {};

interface Answer {
  text: string;
  votes: number;
}

interface Post {
  id: string;
  username: string;
  question: string;
  answers: Answer[];
  timestamp: string;
}

function showResults(card: HTMLElement, post: Post, selectedIndex: number) {
  card.classList.add('answered');
  card.dataset.voted = String(selectedIndex);

  const grid = card.querySelector<HTMLDivElement>('.answers-grid')!;
  grid.classList.add('fading');

  setTimeout(() => {
    grid.innerHTML = '';
    const total = post.answers.reduce((sum, a) => sum + a.votes, 0);
    post.answers.forEach((a, i) => {
      const pct = total > 0 ? Math.round((a.votes / total) * 100) : 0;
      const btn = document.createElement('button');
      btn.className = 'answer-btn' + (i === selectedIndex ? ' selected-vote' : '');
      btn.dataset.index = String(i);
      btn.style.setProperty('--vote-pct', '0%');
      btn.innerHTML = `<span class="answer-text">${a.text}</span><span class="vote-count">${pct}%</span>`;
      grid.appendChild(btn);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          btn.style.setProperty('--vote-pct', `${pct}%`);
        });
      });
    });
    grid.classList.remove('fading');
  }, 150);
}

function handleVote(card: HTMLElement, post: Post, idx: number) {
  const prevIdx = card.dataset.voted !== undefined ? parseInt(card.dataset.voted) : -1;
  if (prevIdx === idx) return;

  const posts: Post[] = JSON.parse(localStorage.getItem('ranq_posts') ?? '[]');
  const postIdx = posts.findIndex((p) => p.id === post.id);
  if (postIdx !== -1) {
    if (prevIdx >= 0) {
      posts[postIdx].answers[prevIdx].votes = Math.max(0, posts[postIdx].answers[prevIdx].votes - 1);
      post.answers[prevIdx].votes = Math.max(0, post.answers[prevIdx].votes - 1);
    }
    posts[postIdx].answers[idx].votes++;
    post.answers[idx].votes++;
    localStorage.setItem('ranq_posts', JSON.stringify(posts));
  }

  showResults(card, post, idx);
}

function renderCard(post: Post): HTMLElement {
  const card = document.createElement('article');
  card.className = 'post-card';

  const answersHtml = post.answers
    .map((a, i) => `<button class="answer-btn" data-index="${i}">${a.text}</button>`)
    .join('');

  card.innerHTML = `
    <div class="post-meta">
      <span class="username">${post.username}</span>
      <span>·</span>
      <span class="timestamp">${post.timestamp}</span>
    </div>
    <p class="post-content">${post.question}</p>
    <div class="answers-grid">${answersHtml}</div>
  `;

  card.querySelector('.answers-grid')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.answer-btn');
    if (!btn?.dataset.index) return;
    handleVote(card, post, parseInt(btn.dataset.index));
  });

  return card;
}

const feed = document.getElementById('feed')!;
const emptyMsg = document.getElementById('empty-msg')!;
const posts: Post[] = JSON.parse(localStorage.getItem('ranq_posts') ?? '[]');

if (posts.length === 0) {
  emptyMsg.classList.remove('hidden');
} else {
  posts.forEach((post, i) => {
    const card = renderCard(post);
    card.style.animationDelay = `${i * 0.06}s`;
    feed.appendChild(card);
  });
}
