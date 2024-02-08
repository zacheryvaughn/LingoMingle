// Function to apply styles for the current page
function applyCurrentPageStyle() {
  const currentPage = document.querySelector('meta[name="current-page"]').getAttribute('content');
  const headerLinks = document.querySelectorAll('.page-link');

  headerLinks.forEach(link => {
    const linkPage = link.getAttribute('data-page');

    if (linkPage === currentPage) {
      link.classList.remove('page-link');
      link.classList.add('current-page-link');
    }
  });
};

// Function to initialize dropdowns
function initializeDropdowns() {
  // Theme Toggle Switch
  const themeSwitch = document.getElementById("theme-switch");
  const entirePage = document.querySelector('body');

  // Function to toggle theme
  const themeSwitchToggled = () => {
    entirePage.classList.toggle("theme-switch-toggled");

    // Save theme preference in localStorage
    var isThemeToggled = entirePage.classList.contains("theme-switch-toggled");
    localStorage.setItem("theme", isThemeToggled ? "toggled" : "");
  };

  // Check if a theme preference is stored in localStorage
  var storedTheme = localStorage.getItem("theme");
  if (storedTheme === "toggled") {
    themeSwitchToggled();
  };

  // Add click event listener
  themeSwitch.addEventListener("click", () => {
    themeSwitchToggled();
  });

  // Hamburger
  const hamburger = document.getElementById("hamburger");
  const headerMiddle = document.getElementById("header-middle");

  hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      headerMiddle.classList.toggle("active");
  });

  // Event listener to close the menu if clicked outside
  document.addEventListener("click", function(event) {
      const isClickInsideHamburger = hamburger.contains(event.target);
      const isClickInsideHeaderMiddle = headerMiddle.contains(event.target);

      if (!isClickInsideHamburger && !isClickInsideHeaderMiddle && hamburger.classList.contains("active")) {
          hamburger.classList.remove("active");
          headerMiddle.classList.remove("active");
      }
  });

  // Header Search Bar Button
  const searchButton = document.getElementById("search-button");
  const searchBar = document.getElementById("search-bar");
  const searchContainer = document.getElementById("search-dropdown-container");

  const toggleSearchBar = () => {
    searchBar.classList.toggle("search-bar-is-active");
    searchContainer.classList.toggle("search-container-is-active");
  };

  searchButton.addEventListener("click", () => {
    toggleSearchBar();
    //document.getElementById('search-bar').focus();
  });

  document.addEventListener("click", (event) => {
    if (!searchButton.contains(event.target) && !searchBar.contains(event.target)) {
      searchBar.classList.remove("search-bar-is-active");
      searchContainer.classList.remove("search-container-is-active");
    }
  });

  // Header Messages Button
  const messagesButton = document.getElementById("messages-button");
  const messagesDropdown = document.getElementById("messages-dropdown");
  const messagesContainer = document.getElementById("messages-dropdown-container");

  const toggleMessagesDropdown = () => {
    messagesDropdown.classList.toggle("messages-dropdown-is-active");
    messagesContainer.classList.toggle("messages-container-is-active");
  };

  messagesButton.addEventListener("click", () => {
    toggleMessagesDropdown();
  });

  document.addEventListener("click", (event) => {
    if (!messagesButton.contains(event.target) && !messagesDropdown.contains(event.target)) {
      messagesDropdown.classList.remove("messages-dropdown-is-active");
      messagesContainer.classList.remove("messages-container-is-active");
    }
  });

  // Header Notifications Button
  const notificationsButton = document.getElementById("notifications-button");
  const notificationsDropdown = document.getElementById("notifications-dropdown");
  const notificationsContainer = document.getElementById("notifications-dropdown-container");

  const toggleNotificationsDropdown = () => {
    notificationsDropdown.classList.toggle("notifications-dropdown-is-active");
    notificationsContainer.classList.toggle("notifications-container-is-active");
  };

  notificationsButton.addEventListener("click", () => {
    toggleNotificationsDropdown();
  });

  document.addEventListener("click", (event) => {
    if (!notificationsButton.contains(event.target) && !notificationsDropdown.contains(event.target)) {
      notificationsDropdown.classList.remove("notifications-dropdown-is-active");
      notificationsContainer.classList.remove("notifications-container-is-active");
    }
  });

  // Header Avatar Dropdown
  const headerAvatar = document.getElementById("header-avatar");
  const headerLogin = document.getElementById("header-login");
  const avatarDropdown = document.getElementById("avatar-dropdown");
  const profileDropdown = document.getElementById("profile-dropdown");

  const toggleAvatarDropdown = () => {
    avatarDropdown.classList.toggle("avatar-dropdown-is-active");
    profileDropdown.classList.toggle("profile-dropdown-is-active");
  };
  
  const closeDropdown = () => {
    avatarDropdown.classList.remove("avatar-dropdown-is-active");
    profileDropdown.classList.remove("profile-dropdown-is-active");
  };
  
  headerAvatar.addEventListener("click", () => {
    toggleAvatarDropdown();
  });
  
  headerLogin.addEventListener("click", () => {
    toggleAvatarDropdown(); // Use the same function as headerAvatar
  });
  
  document.addEventListener("click", (event) => {
    if (!headerAvatar.contains(event.target) && !headerLogin.contains(event.target) && !avatarDropdown.contains(event.target)) {
      closeDropdown();
    }
  });

  // LOGIN AND LOGOUT
  const loginButton = document.getElementById("login-container");
  const logoutButton = document.getElementById("logout-container");

  // Check if the user is already logged in on page load
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Function to update UI based on login state
  function updateUI() {
    if (isLoggedIn) {
      profileDropdown.classList.add('not-logged-in');
    } else {
      profileDropdown.classList.remove('not-logged-in');
    }
  }

  // Function to handle login click
  function handleLoginClick() {
    // Set login state to true in localStorage
    localStorage.setItem("isLoggedIn", "true");
    isLoggedIn = true;
    updateUI();
  }

  // Function to handle logout click
  function handleLogoutClick() {
    // Set login state to false in localStorage
    localStorage.setItem("isLoggedIn", "false");
    isLoggedIn = false;
    updateUI();
  }

  // Attach click event listeners to login and logout elements
  logoutButton.addEventListener('click', handleLoginClick);
  loginButton.addEventListener('click', handleLogoutClick);

  // Update UI based on initial login state
  updateUI();


};

// Function to fetch and insert the header
function loadHeader() {
  fetch('../html/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      applyCurrentPageStyle(); // Call the function to apply styles for the current page
      initializeDropdowns(); // Call the function to initialize dropdowns
    });
}

loadHeader(); // Call the function to load the header
