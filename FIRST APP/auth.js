// Auth state management
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const errorMsg = document.getElementById('auth-error');

function toggleAuth() {
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
    errorMsg.classList.add('hidden');
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        showError('Invalid email or password');
    }
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.email === email)) {
        showError('Email already registered');
        return;
    }

    const newUser = { name, email, password, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Automatically log in
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'index.html';
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}

// Session check
if (localStorage.getItem('currentUser') && window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
}
