//back to top 
const backToTopBtn= document.getElementById("backToTop");
window.onscroll = function (){
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100){
        backToTopBtn.style.display = "block";
    }else{
        backToTopBtn.style.display= "none"
    }
}
backToTopBtn.addEventListener ("click", function (){
    window.scrollTo ({top:0, behavior: "smooth"})
})

///DARK MODE TOGGLE WITH LOCALSTORAGE 
let darkBtn = document.getElementById("darkModeBtn");

// Function to apply theme
function applyDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");

        document.querySelectorAll(".homepage-section, .why-use, .about-section, .faq-section, .meet-team, .how-it-works, .features").forEach(section => {
            section.classList.add("dark-mode");
        });

        document.querySelectorAll(".card, .list-group-item, .faq-item, .planner-day, .meal-card").forEach(el => {
            el.classList.add("dark-mode");
        });

        document.querySelectorAll("input, textarea, select, button").forEach(el => {
            el.classList.add("dark-mode");
        });

    } else {
        document.body.classList.remove("dark-mode");

        document.querySelectorAll(".homepage-section, .why-use, .about-section, .faq-section, .meet-team, .how-it-works, .features").forEach(section => {
            section.classList.remove("dark-mode");
        });

        document.querySelectorAll(".card, .list-group-item, .faq-item, .planner-day, .meal-card").forEach(el => {
            el.classList.remove("dark-mode");
        });

        document.querySelectorAll("input, textarea, select, button").forEach(el => {
            el.classList.remove("dark-mode");
        });
    }
}

// On page load, check localStorage
const savedTheme = localStorage.getItem("darkMode");
if (savedTheme === "true") {
    applyDarkMode(true);
}

// On button click toggle
darkBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    applyDarkMode(!isDark);
    localStorage.setItem("darkMode", !isDark); // save current state
});
// login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById("loginUsername").value.trim();
        const passwordInput = document.getElementById("loginPassword").value;

        // For demo: simple validation
        if (usernameInput.length < 3 || passwordInput.length < 6) {
            alert("Invalid credentials. Please try again.");
            return;
        }

        // Save username to localStorage
        localStorage.setItem("username", usernameInput);

        alert(`Welcome back, ${usernameInput}! 🎉`);

        // Redirect to dashboard
        window.location.href = "dashboard.html";
    });
}





// signup
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Simple validation
        if (username.length < 3) { alert("Username must be at least 3 characters."); return; }
        if (!email.includes("@") || !email.includes(".")) { alert("Invalid email."); return; }
        if (password.length < 6) { alert("Password must be at least 6 characters."); return; }
        if (password !== confirmPassword) { alert("Passwords do not match."); return; }

        // Save username (or email) to localStorage
        localStorage.setItem("username", username);

        alert("Signup successful! You are now logged in. 🎉");

        // Redirect to homepage
        window.location.href = "index.html";
    });
}




// DASHBOARD Js

//Shopping List 
const addItemBtn = document.getElementById("addItemBtn");
const itemInput = document.getElementById("itemInput");
const shoppingList = document.getElementById("shoppingList");

if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
        const value = itemInput.value.trim();
        if (value === "") return;

        const exists = Array.from(shoppingList.children).some(
            li => li.firstChild.textContent === value
        );
        if (exists) {
            alert("Item already exists!");
            return;
        }

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center bg-white mb-2";
        li.textContent = value;

        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-sm btn-danger ms-2";
        removeBtn.textContent = "Remove";
        removeBtn.onmouseover = () => removeBtn.style.backgroundColor = "#fd7e14";
        removeBtn.onmouseout = () => removeBtn.style.backgroundColor = "red";
        removeBtn.onclick = () => li.remove();

        li.appendChild(removeBtn);
        shoppingList.appendChild(li);
        itemInput.value = "";
    });


    itemInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addItemBtn.click();
    });
}

//Highlight Meals 
document.querySelectorAll(".meal-card").forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("highlighted");
    });
});

//Weekly Planner (click to select day)
document.querySelectorAll(".planner-day").forEach(day => {
    day.addEventListener("click", () => {
        // toggle selected state
        day.classList.toggle("selected-day");
    });
});

//Load Recipes from JSON File 
fetch('recipes.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector("#savedRecipe") || document.querySelector(".row.row-cols-1");
    container.innerHTML = ''; // clear current cards

    data.forEach(recipe => {
      container.innerHTML += `
        <div class="col">
          <div class="card recipe-card h-100" data-id="${recipe.id}">
            <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
            <div class="card-body">
              <h5 class="card-title">${recipe.title}</h5>
              <a href="#" class="btn view-recipe-btn">View Recipe</a>
            </div>
          </div>
        </div>
      `;
    });

    document.querySelectorAll(".view-recipe-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const recipeId = btn.closest(".recipe-card").dataset.id;
        const recipe = data.find(r => r.id == recipeId);
        showRecipeModal(recipe);
      });
    });
  });

//Show Recipe Modal
function showRecipeModal(recipe) {
  const modal = document.createElement('div');
  modal.className = 'recipe-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>${recipe.title}</h2>
      <p>${recipe.details}</p>
      <button class="close-modal">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.querySelector('.close-modal').addEventListener('click', () => modal.remove());
}




//Back to Top Button 
const backToTop = document.getElementById("backToTop");
window.onscroll = () => {
    backToTop.style.display = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100 ? "block" : "none";
};
backToTop.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

//about page faq
const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

// Save and load shopping list 
function saveList() {
  const items = Array.from(shoppingList.children).map(li => li.firstChild.textContent.trim());
  localStorage.setItem('shoppingList', JSON.stringify(items));
}

function loadList() {
  shoppingList.innerHTML = ""; // Clear before adding saved
  const saved = JSON.parse(localStorage.getItem("shoppingList") || "[]");
  saved.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-white mb-2";
    li.textContent = item;

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-sm btn-danger ms-2";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => { li.remove(); saveList(); };

    li.appendChild(removeBtn);
    shoppingList.appendChild(li);
  });
}
loadList();
// Update save when item added
addItemBtn.addEventListener('click', () => saveList());

//Meal assignment to planner
const mealCards = document.querySelectorAll('.meal-card');
const plannerDays = document.querySelectorAll('.planner-day');

mealCards.forEach(meal => {
  meal.addEventListener('click', () => {
    const mealName = meal.textContent.trim();
    const dayNames = Array.from(plannerDays).map(day => day.dataset.day.toUpperCase());
    const selectedDay = prompt(`Assign "${mealName}" to which day? (${dayNames.join(', ')})`);

    if (selectedDay) {
      const targetDay = Array.from(plannerDays).find(day => 
        day.dataset.day.toUpperCase() === selectedDay.toUpperCase()
      );
      if (targetDay) {
        const mealsText = targetDay.querySelector('.meals');
        mealsText.textContent = mealName;
        alert(`${mealName} added to ${selectedDay}!`);
      } else {
        alert("Invalid day. Please type one of: " + dayNames.join(', '));
      }
    }
  });
});



// Check if user is logged in
const username = localStorage.getItem("username");
if (!username) {
    // Not logged in → redirect to login page
    window.location.href = "login.html";
} else {
    // Show welcome message
    document.getElementById("welcomeMessage").textContent = `Welcome back, ${username}! 🌸`;
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("username");
        alert("You have logged out!");
        window.location.href = "login.html";
    });
}




