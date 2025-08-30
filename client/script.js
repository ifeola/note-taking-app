import getData from "./modules/getData.js";
import appendNoteToDOM from "./modules/appendNoteToDOM.js";
import appendIsLoadingState from "./modules/appendIsLoadingState.js";
import deleteData from "./modules/deleteData.js";

const noteTabs = document.querySelector(".note-tabs");
const notesListContainer = document.querySelector(".notes");
const loader = document.querySelector(".loading");
const notesTabContainer = document.querySelector(".note-tabs");
const totalNotes = document.querySelector(".total-notes");
const subNotes = document.querySelector(".sub-notes");
const createNoteBtn = document.querySelector(".create-new-note-btn");
const formContainer = document.querySelector(".form-container");
const closeModalBtn = document.querySelector("#close-modal-btn");
const confirmDeleteEl = document.querySelector(".confirm");
const notifications = document.querySelector(".notifications");

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
	if (notes.length === 0) {
		const noNotes = document.createElement("div");
		const header = document.createElement("h4");
		const image = document.createElement("img");

		header.textContent = `No notes found for ${query}`;
		image.src = "./images/empty-notes.png";

		noNotes.append(header);
		noNotes.append(image);

		notesListContainer.append(noNotes);
	} else {
		appendNoteToDOM(notes, notesListContainer);
	}

	getTags(notes);
	notesListContainer.style.display = "grid";
	totalNotes.textContent = notes.length;
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

// Notes tab logic start
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

// Notes tab logic end

// Delete a Note from Notes
notesListContainer.addEventListener("click", (e) => {
	if (!e.target.classList.contains("delete-btn")) return;
	const deleteBtn = e.target;
	const parentElement = deleteBtn.closest(".note");

	// Ensure a parent note element was found
	if (!parentElement) {
		console.error(
			"Could not find parent '.note' element for the delete button."
		);
		return;
	}
	const id = parentElement.id;

	confirmDeleteEl.style.display = "grid";
	confirmDeleteEl.addEventListener(
		"click",
		async (e) => {
			if (e.target.classList.contains("delete-cinfirm-btn")) {
				await deleteData(`/api/v1/notes/${id}`);
				parentElement.remove();
				getNotified("Note deleted successfully.");
				confirmDeleteEl.style.display = "none";

				const noteTabsList = Array.from(document.querySelectorAll(".note-tab"));
				let tag = "";
				noteTabsList.forEach((tab) => {
					if (tab.classList.contains("active")) {
						tag = tab.dataset.target;
					}
				});

				const filteredNotes = await getData(`/api/v1/notes/${tag}`);
				const notes = await getData(`/api/v1/notes`);
				countNotes(filteredNotes);
				totalNotes.textContent = notes.length;
			} else {
				confirmDeleteEl.style.display = "none";
			}
		},
		{ once: true }
	);
});

function getNotified(content) {
	const notification = document.createElement("div");
	notification.classList.add("notification");
	notification.textContent = content;
	notifications.append(notification);

	setTimeout(() => {
		notification.remove();
	}, 3000);
}
