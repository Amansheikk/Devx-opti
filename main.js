// ==========================================
// NAVBAR AUTH STATE LOGIC
// ==========================================
function updateNavState() {
  const loginBtn = document.getElementById('nav-auth-btn');
  const currentUser = localStorage.getItem('devx_user');
  
  if (loginBtn) {
    if (currentUser) {
      loginBtn.innerText = "Log Out";
      loginBtn.onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('devx_user');
        alert("You have been successfully logged out.");
        updateNavState();
      };
    } else {
      loginBtn.innerText = "Log In";
      loginBtn.onclick = function(e) {
        openAuthModal('login', e);
      };
    }
  }
}

// ==========================================
// AUTH MODAL LOGIC
// ==========================================
function openAuthModal(view = 'login', event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
    toggleAuthView(view);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
  }
}

function toggleAuthView(view, event) {
  if (event) event.preventDefault();
  const loginForm = document.getElementById('login-form-container');
  const signupForm = document.getElementById('signup-form-container');
  
  if (view === 'signup') {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
  } else {
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
  }
  
  // Re-attach hover/magnetic events for newly visible inputs (functions in animations.js)
  if (typeof attachHoverEvents === 'function') attachHoverEvents();
  if (typeof attachMagneticEvents === 'function') attachMagneticEvents();
}

// ==========================================
// SUPABASE DATABASE LOGIC (Optimized)
// ==========================================
const SUPABASE_URL = 'https://lzqztwhcjsnuprwyxblk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_k0PQycjenVQOGZDslXldBg_3CZ8PJ-x';

let supabaseClient = null;

// Initialize Supabase only when the window has fully loaded all scripts
window.addEventListener('load', () => {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase connected successfully.");
    } else {
        console.error("Supabase library failed to load. Check your network or CDN connection.");
        // Optional: You could show a subtle UI warning here if needed.
    }
});

async function handleSignUp(event) {
  event.preventDefault();
  if (!supabaseClient) {
    alert("Database connection failed. Please refresh the page and try again.");
    return;
  }
  
  const nameInput = document.getElementById('signup-name');
  const usnInput = document.getElementById('signup-usn');
  const passwordInput = document.getElementById('signup-password');

  if (!nameInput || !usnInput || !passwordInput) return;

  const name = nameInput.value.trim();
  const usn = usnInput.value.trim();
  const password = passwordInput.value;

  if (!name || !usn || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // --- USN Validation Logic ---
  const usnUpper = usn.toUpperCase();
  if (!usnUpper.startsWith('1IC23') && !usnUpper.startsWith('1IC24') && !usnUpper.startsWith('1IC25') && !usnUpper.startsWith('1IC26')) {
    alert("Your USN must start with 1IC23, 1IC24, 1IC25, or 1IC26.");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('devx_users')
      .insert([
        { name: name, usn: usnUpper, password: password }
      ]);

    if (error) {
      if (error.code === '23505') { 
        alert("This USN is already registered! Please log in.");
      } else {
        alert("Sign up failed: " + error.message);
      }
      return;
    }

    alert("Account created successfully! You can now log in.");
    toggleAuthView('login');
  } catch (err) {
    console.error("Signup error:", err);
    alert("An unexpected error occurred during signup.");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  if (!supabaseClient) {
    alert("Database connection failed. Please refresh the page and try again.");
    return;
  }
  
  const nameInput = document.getElementById('login-name');
  const passwordInput = document.getElementById('login-password');

  if (!nameInput || !passwordInput) return;

  const name = nameInput.value.trim();
  const password = passwordInput.value;

  if (!name || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('devx_users')
      .select('*')
      .eq('name', name)
      .eq('password', password)
      .single();

    if (error || !data) {
      alert("Invalid Name or Password. Please try again.");
      return;
    }

    localStorage.setItem('devx_user', data.name);
    
    alert(`Welcome back, ${data.name}! You are logged in.`);
    closeAuthModal();
    updateNavState();
  } catch (err) {
    console.error("Login error:", err);
    alert("An unexpected error occurred during login.");
  }
}

// ==========================================
// PROTECTED ROUTE LOGIC
// ==========================================
function checkLogin() {
  if(!localStorage.getItem('devx_user')) {
    alert("You must be logged in to view team details.");
    openAuthModal('login');
    return false;
  }
  return true;
}

// ==========================================
// TEAM MODAL LOGIC 
// ==========================================
function openTechModal() {
  if (!checkLogin()) return;
  const modal = document.getElementById('tech-modal');
  if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  }
}
function closeTechModal() {
  const modal = document.getElementById('tech-modal');
  if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; 
  }
}

function openProdModal() {
  if (!checkLogin()) return;
  const modal = document.getElementById('prod-modal');
  if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  }
}
function closeProdModal() {
  const modal = document.getElementById('prod-modal');
  if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; 
  }
}

function openMgmtModal() {
  if (!checkLogin()) return;
  const modal = document.getElementById('mgmt-modal');
  if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  }
}
function closeMgmtModal() {
  const modal = document.getElementById('mgmt-modal');
  if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; 
  }
}

function openMktgModal() {
  if (!checkLogin()) return;
  const modal = document.getElementById('mktg-modal');
  if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  }
}
function closeMktgModal() {
  const modal = document.getElementById('mktg-modal');
  if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; 
  }
}

function openSocialModal() {
  if (!checkLogin()) return;
  const modal = document.getElementById('social-modal');
  if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  }
}
function closeSocialModal() {
  const modal = document.getElementById('social-modal');
  if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto'; 
  }
}

// ==========================================
// COMING SOON SUB-MODAL LOGIC
// ==========================================
function openComingSoonModal(title) {
  const titleEl = document.getElementById('coming-soon-title');
  const modal = document.getElementById('coming-soon-modal');
  
  if (titleEl && modal) {
      titleEl.innerText = title;
      modal.classList.add('active');
      if (typeof attachHoverEvents === 'function') attachHoverEvents(); 
  }
}

function closeComingSoonModal() {
  const modal = document.getElementById('coming-soon-modal');
  if (modal) {
      modal.classList.remove('active');
  }
}
