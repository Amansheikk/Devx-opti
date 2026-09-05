// ==========================================
// NAVBAR AUTH STATE LOGIC
// ==========================================
function updateNavState() {
  const loginBtn = document.getElementById('nav-auth-btn');
  const currentUser = localStorage.getItem('devx_user');
  
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

// ==========================================
// AUTH MODAL LOGIC
// ==========================================
function openAuthModal(view = 'login', event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('auth-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; 
  toggleAuthView(view);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; 
}

function toggleAuthView(view, event) {
  if (event) event.preventDefault();
  const loginForm = document.getElementById('login-form-container');
  const signupForm = document.getElementById('signup-form-container');
  
  if (view === 'signup') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  } else {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  }
  
  // Re-attach hover/magnetic events for newly visible inputs (functions in animations.js)
  if (typeof attachHoverEvents === 'function') attachHoverEvents();
  if (typeof attachMagneticEvents === 'function') attachMagneticEvents();
}

// ==========================================
// SUPABASE DATABASE LOGIC
// ==========================================
const SUPABASE_URL = 'https://lzqztwhcjsnuprwyxblk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_k0PQycjenVQOGZDslXldBg_3CZ8PJ-x';

// Check if script loaded, else wait
let supabaseClient = null;
function initSupabase() {
    if(window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        setTimeout(initSupabase, 500);
    }
}
initSupabase();

async function handleSignUp(event) {
  event.preventDefault();
  if(!supabaseClient) return alert("Database initializing, please wait...");
  
  const name = document.getElementById('signup-name').value.trim();
  const usn = document.getElementById('signup-usn').value.trim();
  const password = document.getElementById('signup-password').value;

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
    console.error(err);
    alert("An unexpected error occurred during signup.");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  if(!supabaseClient) return alert("Database initializing, please wait...");
  
  const name = document.getElementById('login-name').value.trim();
  const password = document.getElementById('login-password').value;

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
    console.error(err);
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
  document.getElementById('tech-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; 
}
function closeTechModal() {
  document.getElementById('tech-modal').classList.remove('active');
  document.body.style.overflow = 'auto'; 
}

function openProdModal() {
  if (!checkLogin()) return;
  document.getElementById('prod-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; 
}
function closeProdModal() {
  document.getElementById('prod-modal').classList.remove('active');
  document.body.style.overflow = 'auto'; 
}

function openMgmtModal() {
  if (!checkLogin()) return;
  document.getElementById('mgmt-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; 
}
function closeMgmtModal() {
  document.getElementById('mgmt-modal').classList.remove('active');
  document.body.style.overflow = 'auto'; 
}

function openMktgModal() {
  if (!checkLogin()) return;
  document.getElementById('mktg-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; 
}
function closeMktgModal() {
  document.getElementById('mktg-modal').classList.remove('active');
  document.body.style.overflow = 'auto'; 
}

function openSocialModal() {
  if (!checkLogin()) return;
  document.getElementById('social-modal').classList.add('active');
  document.body.style.overflow = 'hidden'; 
}
function closeSocialModal() {
  document.getElementById('social-modal').classList.remove('active');
  document.body.style.overflow = 'auto'; 
}

// ==========================================
// COMING SOON SUB-MODAL LOGIC
// ==========================================
function openComingSoonModal(title) {
  document.getElementById('coming-soon-title').innerText = title;
  const modal = document.getElementById('coming-soon-modal');
  modal.classList.add('active');
  if (typeof attachHoverEvents === 'function') attachHoverEvents(); 
}

function closeComingSoonModal() {
  const modal = document.getElementById('coming-soon-modal');
  modal.classList.remove('active');
}