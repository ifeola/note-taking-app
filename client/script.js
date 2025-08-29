import getData from "./modules/getData.js";
import appendNoteToDOM from "./modules/appendNoteToDOM.js";
import appendIsLoadingState from "./modules/appendIsLoadingState.js";

const noteTabs = document.querySelector(".note-tabs");
const notesListContainer = document.querySelector(".notes");
const loader = document.querySelector(".loading");
const notesTabContainer = document.querySelector(".note-tabs");
const totalNotes = document.querySelector(".total-notes");
const subNotes = document.querySelector(".sub-notes");
const createNoteBtn = document.querySelector(".create-new-note-btn");
const formContainer = document.querySelector(".form-container");
const closeModalBtn = document.querySelector("#close-modal-btn");
let notes = [];

async function initializeApp() {
	// Show loader and hide content container
	notesListContainer.style.display = "none";
	loader.style.display = "grid";
	appendIsLoadingState(loader);

	// Data fetching logic
	notes = await getData("/api/v1/notes");

	// Hide loader, show content
	loader.style.display = "none";
	notesListContainer.style.display = "grid";

	totalNotes.textContent = notes.length;
	appendNoteToDOM(notes, notesListContainer);
	getTags(notes);
	countNotes(notes);
}

function countNotes(notes) {
	const notesCount = notes.length;
	subNotes.textContent = notesCount;
}

function getTags(notes) {
	const tags = notes.reduce((prev, next) => {
		if (!prev.includes(next.tag)) {
			prev.push(next.tag);
		}
		return prev;
	}, []);

	tags.forEach((tag) => {
		const button = document.createElement("button");
		button.setAttribute("data-target", tag);
		button.className = `note-tab ${tag}-tag flex items-center`;
		const buttonChildren = `
      <span class="dot"></span>
      <span class="note-tab-title">${tag}</span>
    `;
		button.innerHTML = buttonChildren;
		noteTabs.append(button);
	});
}

initializeApp();

notesTabContainer.addEventListener("click", async (e) => {
	const button = e.target;
	if (!button.classList.contains("note-tab")) return;
	const query = button.dataset.target;
	const noteTabs = Array.from(notesTabContainer.querySelectorAll(".note-tab"));

	noteTabs.forEach((noteTab) => {
		noteTab.classList.remove("active");
		if (noteTab.dataset.target === query) {
			noteTab.classList.add("active");
		}
	});

	const filteredNotes = await getData(`/api/v1/notes/${query}`);
	appendNoteToDOM(filteredNotes, notesListContainer);
	countNotes(filteredNotes);
});

createNoteBtn.addEventListener("click", () => {
	formContainer.classList.add("active-modal");
});

closeModalBtn.addEventListener("click", () => {
	formContainer.classList.remove("active-modal");
});
