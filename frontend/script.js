const API_URL = 'http://localhost:3000/api';

// DOM elements
const authContainer = document.getElementById('auth-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const notificationForm = document.getElementById('notification-form');

// Event listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);
notificationForm.addEventListener('submit', handleNotificationSettings);

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      showDashboard();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful. Please log in.');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
}

async function handleLogout() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      showAuthContainer(); // Call this first to clear sensitive data
      localStorage.removeItem('token');
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

async function showDashboard() {
  const token = localStorage.getItem('token');
  if (!token || !(await verifyToken(token))) {
    localStorage.removeItem('token');
    showAuthContainer();
    return;
  }
  authContainer.style.display = 'none';
  dashboard.style.display = 'block';
  await fetchUpcomingBirthdays();
}

async function fetchUpcomingBirthdays() {
  try {
    const response = await fetch(`${API_URL}/students/upcoming-birthdays`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    displayUpcomingBirthdays(data);
  } catch (error) {
    console.error('Error fetching upcoming birthdays:', error);
  }
}

function displayUpcomingBirthdays(birthdays) {
  const upcomingBirthdaysContainer = document.getElementById('upcoming-birthdays');
  upcomingBirthdaysContainer.innerHTML = '<h3>Upcoming Birthdays</h3>';
  
  if (birthdays.length === 0) {
    upcomingBirthdaysContainer.innerHTML += '<p>No upcoming birthdays in the next 5 days.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Group</th>
      <th>Birthday</th>
      <th>Age</th>
      <th>Days Until Birthday</th>
    </tr>
  `;

  birthdays.forEach(student => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${student.first_name} ${student.last_name}</td>
      <td>${student.group_identifier}</td>
      <td>${new Date(student.birthdate).toLocaleDateString()}</td>
      <td>${student.age}</td>
      <td>${student.days_until_birthday}</td>
    `;
  });

  upcomingBirthdaysContainer.appendChild(table);
}

function showAuthContainer() {
  authContainer.style.display = 'block';
  dashboard.style.display = 'none';
  
  // Clear sensitive data from the dashboard
  const upcomingBirthdaysContainer = document.getElementById('upcoming-birthdays');
  upcomingBirthdaysContainer.innerHTML = '';

}

async function handleNotificationSettings(e) {
  e.preventDefault();
  // Implement saving notification settings
}

// Add this function to verify the token
async function verifyToken(token) {
  try {
    const response = await fetch(`${API_URL}/users/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

// Modify the initial check on page load
window.addEventListener('load', async () => {
  const token = localStorage.getItem('token');
  if (token && await verifyToken(token)) {
    showDashboard();
  } else {
    localStorage.removeItem('token');
    showAuthContainer();
  }
});
