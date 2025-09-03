import getData from "./modules/getData.js";
import appendNoteToDOM from "./modules/appendNoteToDOM.js";
import appendIsLoadingState from "./modules/appendIsLoadingState.js";
import deleteData from "./modules/deleteData.js";

const noteTabs = document.querySelector(".note-tabs");
const notesListContainer = document.querySelector(".notes");
const notesLists = Array.from(notesListContainer.querySelectorAll(".note"));
const loader = document.querySelector(".loading");
const notesTabContainer = document.querySelector(".note-tabs");
const totalNotes = document.querySelector(".total-notes");
const subNotes = document.querySelector(".sub-notes");
const createNoteBtn = document.querySelector(".create-new-note-btn");
const formContainer = document.querySelector(".form-container");
const form = document.querySelector("#add-note-form");
const closeModalBtn = document.querySelector("#close-modal-btn");
const confirmDeleteEl = document.querySelector(".confirm");
const notifications = document.querySelector(".notifications");

// Form Elements
const title = document.querySelector("#input-title");
const content = document.querySelector("#input-content");
const tag = document.querySelector("#form-tags");

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

		notesListContainer.innerHTML = "";
		notesListContainer.append(noNotes);
	} else {
		notesListContainer.innerHTML = "";
		notes.forEach((note) => {
			appendNoteToDOM(note, notesListContainer);
		});
	}

	getTags(notes);
	notesListContainer.style.display = "grid";
	totalNotes.textContent = notes.length;
	countNotes(notes);
}

initializeApp();

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
	notesListContainer.innerHTML = "";
	filteredNotes.forEach((note) => {
		appendNoteToDOM(note, notesListContainer);
	});
	countNotes(filteredNotes);
});

let currentNoteId = null;

// Open create modal
createNoteBtn.addEventListener("click", () => {
	currentNoteId = null; // reset to create mode

	// Clear form fields
	title.value = "";
	content.value = "";

	formContainer.classList.add("active-modal");
});

// Open edit modal
notesListContainer.addEventListener("click", (e) => {
	if (!e.target.classList.contains("edit-btn")) return;

	const parentEl = e.target.closest(".note");
	currentNoteId = parentEl.id; // now we’re in edit mode

	// Populate form
	title.value = parentEl.querySelector(".note-title h2").textContent.trim();
	content.value = parentEl.querySelector(".note-content").textContent.trim();
	tag.value = parentEl.querySelector(".note-tag").textContent.trim();

	formContainer.classList.add("active-modal");
});

// Create or edit note
form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const inputTitle = form.querySelector("#input-title");
	const inputContent = form.querySelector("#input-content");
	const inputTag = form.querySelector("#form-tags");

	if (
		!inputTitle.value.trim() &&
		!inputContent.value.trim() &&
		!inputTag.value.trim()
	)
		return;

	let noteData = {
		title: inputTitle.value.trim(),
		content: inputContent.value.trim(),
		tag: inputTag.value.trim(),
	};

	if (currentNoteId) {
		// EDIT mode
		await sendPatchRequest(currentNoteId, noteData);

		// Update UI
		const parentEl = document.getElementById(currentNoteId);
		parentEl.querySelector(".note-title h2").textContent = noteData.title;
		parentEl.querySelector(".note-content").textContent = noteData.content;
		parentEl.querySelector(".note-tag").textContent = noteData.tag;
	} else {
		noteData = { ...noteData, is_archived: false };
		const newNote = await sendPostRequest(noteData); // you’ll need a POST helper

		// Add to UI
		appendNoteToDOM(newNote, notesListContainer);
		subNotes.textContent = Array.from(
			notesListContainer.querySelectorAll(".note")
		).length;
		totalNotes.textContent = Array.from(
			notesListContainer.querySelectorAll(".note")
		).length;
		console.log(notesLists.length);

		getNotified("Note added successfully");
	}

	formContainer.classList.remove("active-modal");
	currentNoteId = null;
});

// Send patch request to server
async function sendPatchRequest(id, note) {
	try {
		const response = await fetch(`/api/v1/notes/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(note),
		});

		if (!response.ok) {
			throw new Error(
				`An error occurred: ${response.status} ${response.statusText}`
			);
		}

		const editedNote = await response.json();
		console.log("Updated note:", editedNote);
		return editedNote;
	} catch (error) {
		console.error(error.message);
	}
}

closeModalBtn.addEventListener("click", () => {
	formContainer.classList.remove("active-modal");
});

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

async function sendPostRequest(noteData) {
	const response = await fetch("/api/v1/notes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(noteData),
	});

	if (!response.ok) {
		// Handle HTTP errors (e.g., 404, 500)
		throw new Error(`HTTP error! status`);
	}
	const note = await response.json(); // Parse the JSON response body
	return note;
}

// Notifications
function getNotified(content) {
	const notification = document.createElement("div");
	notification.classList.add("notification");
	notification.textContent = content;
	notifications.append(notification);

	setTimeout(() => {
		notification.remove();
	}, 3000);
}
