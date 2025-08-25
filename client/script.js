import getData from "./modules/getData.js";
import appendNoteToDOM from "./modules/appendNoteToDOM.js";

const noteTabs = document.querySelector(".note-tabs");
const notesListContainer = document.querySelector(".notes");
const notesTabContainer = document.querySelector(".note-tabs");
const totalNotes = document.querySelector(".total-notes");
const subNotes = document.querySelector(".sub-notes");
let notes = [];

async function initializeApp() {
	notes = await getData(); // Wait for the data here
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

	const filteredNotes = await getData(query);
	appendNoteToDOM(filteredNotes, notesListContainer);
	countNotes(filteredNotes);
});
