
"use strict";

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    category: "Development",
    level: "Beginner",
    duration: "6 weeks",
    price: "Free",
    symbol: "💻",
    art: "art-development",
    description: "Learn HTML, CSS and JavaScript fundamentals and understand how modern websites are built."
  },
  {
    id: 2,
    title: "JavaScript for Beginners",
    category: "Development",
    level: "Beginner",
    duration: "4 weeks",
    price: "Free",
    symbol: "⚡",
    art: "art-development",
    description: "Explore variables, functions, events and interactive web experiences with JavaScript."
  },
  {
    id: 3,
    title: "UI/UX Design Essentials",
    category: "Design",
    level: "Beginner",
    duration: "5 weeks",
    price: "Free",
    symbol: "🎨",
    art: "art-design",
    description: "Discover design principles, wireframes, visual hierarchy and user-friendly interfaces."
  },
  {
    id: 4,
    title: "Graphic Design Basics",
    category: "Design",
    level: "Beginner",
    duration: "3 weeks",
    price: "Free",
    symbol: "✏️",
    art: "art-design",
    description: "Learn about typography, color theory, composition and creative visual communication."
  },
  {
    id: 5,
    title: "Digital Marketing Essentials",
    category: "Business",
    level: "Beginner",
    duration: "4 weeks",
    price: "Free",
    symbol: "📈",
    art: "art-business",
    description: "Understand SEO, content strategy, social media and the basics of online marketing."
  },
  {
    id: 6,
    title: "Business and Entrepreneurship",
    category: "Business",
    level: "Intermediate",
    duration: "6 weeks",
    price: "Free",
    symbol: "🚀",
    art: "art-business",
    description: "Explore business planning, customer research, value propositions and startup fundamentals."
  }
];

const courseGrid = document.getElementById("courseGrid");
const courseSearch = document.getElementById("courseSearch");
const categoryFilters = document.getElementById("categoryFilters");
const courseCount = document.getElementById("courseCount");
const emptyState = document.getElementById("emptyState");
const courseDialog = document.getElementById("courseDialog");
const dialogContent = document.getElementById("dialogContent");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

let selectedCategory = "All";
const favorites = new Set();

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  if (showToast.timer) {
    clearTimeout(showToast.timer);
  }

  showToast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2600);
}

function getFilteredCourses() {
  const query = courseSearch.value.trim().toLowerCase();

  return courses.filter(function (course) {
    const matchesCategory =
      selectedCategory === "All" ||
      course.category === selectedCategory;

    const searchableText = [
      course.title,
      course.category,
      course.level,
      course.description
    ].join(" ").toLowerCase();

    return matchesCategory && searchableText.includes(query);
  });
}

function renderCourses() {
  const filteredCourses = getFilteredCourses();

  courseGrid.innerHTML = filteredCourses.map(function (course) {
    const isFavorite = favorites.has(course.id);

    return `
      <article class="course-card">
        <div class="course-art ${course.art}">
          <span class="course-symbol" aria-hidden="true">
            ${course.symbol}
          </span>
          <span class="level-tag">${escapeHTML(course.level)}</span>
        </div>

        <div class="course-body">
          <span class="course-category">
            ${escapeHTML(course.category)}
          </span>

          <h3>${escapeHTML(course.title)}</h3>

          <p>${escapeHTML(course.description)}</p>

          <div class="course-meta">
            <span>◷ ${escapeHTML(course.duration)}</span>
            <strong>${escapeHTML(course.price)}</strong>
          </div>

          <div class="course-footer">
            <button type="button"
              data-action="favorite"
              data-id="${course.id}"
              aria-pressed="${isFavorite}"
              aria-label="${isFavorite ? "Remove" : "Add"} ${escapeHTML(course.title)} ${"to favorites"}">
              ${isFavorite ? "♥ Saved" : "♡ Save"}
            </button>

            <button type="button"
              class="details-button"
              data-action="details"
              data-id="${course.id}">
              View Details →
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  courseCount.textContent =
    `${filteredCourses.length} ${filteredCourses.length === 1 ? "course" : "courses"}`;

  emptyState.hidden = filteredCourses.length !== 0;
}

function openCourseDetails(courseId) {
  const course = courses.find(function (item) {
    return item.id === courseId;
  });

  if (!course) {
    showToast("Course could not be found.");
    return;
  }

  dialogContent.innerHTML = `
    <span class="eyebrow">${escapeHTML(course.category)}</span>
    <h2>${escapeHTML(course.title)}</h2>
    <p>${escapeHTML(course.description)}</p>
    <p><strong>Level:</strong> ${escapeHTML(course.level)}</p>
    <p><strong>Duration:</strong> ${escapeHTML(course.duration)}</p>
    <p><strong>Price:</strong> ${escapeHTML(course.price)}</p>
    <p>This is a sample course listing. Learning materials and enrollment are not yet connected.</p>
    <button type="button" class="button primary" id="enrollButton">
      Explore Learning Options
    </button>
  `;

  if (typeof courseDialog.showModal === "function") {
    courseDialog.showModal();
  } else {
    showToast("Your browser does not support the course popup.");
  }
}

courseGrid.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const courseId = Number(button.dataset.id);

  if (!Number.isInteger(courseId)) return;

  if (button.dataset.action === "favorite") {
    if (favorites.has(courseId)) {
      favorites.delete(courseId);
      showToast("Removed from your favorites.");
    } else {
      favorites.add(courseId);
      showToast("Added to your favorites.");
    }

    renderCourses();
  }

  if (button.dataset.action === "details") {
    openCourseDetails(courseId);
  }
});

categoryFilters.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-category]");

  if (!button) return;

  selectedCategory = button.dataset.category;

  categoryFilters.querySelectorAll("button[data-category]").forEach(
    function (filterButton) {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    }
  );

  renderCourses();
});

courseSearch.addEventListener("input", renderCourses);

document.getElementById("closeDialog").addEventListener("click", function () {
  courseDialog.close();
});

courseDialog.addEventListener("click", function (event) {
  if (event.target === courseDialog) {
    courseDialog.close();
  }
});

dialogContent.addEventListener("click", function (event) {
  if (event.target.closest("#enrollButton")) {
    showToast("Enrollment will be available when the learning system is connected.");
  }
});

menuToggle.addEventListener("click", function () {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navigation.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }
});

document.getElementById("newsletterForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const message = document.getElementById("newsletterMessage");

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }

  message.textContent =
    "Demo only: no email was saved or sent. Connect a newsletter service to enable subscriptions.";

  emailInput.value = "";
});

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

renderCourses();
