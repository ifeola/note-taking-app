let currentNoteId = null; // null = create mode, id = edit mode

// Open create modal
createBtn.addEventListener("click", () => {
	currentNoteId = null; // reset to create mode

	// Clear form fields
	title.value = "";
	content.value = "";
	tag.value = "";

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

// Handle form submit (only one listener)
formContainer.addEventListener("submit", async (e) => {
	e.preventDefault();

	const inputTitle = formContainer.querySelector("#input-title");
	const inputContent = formContainer.querySelector("#input-content");
	const inputTag = formContainer.querySelector("#form-tags");

	if (
		!inputTitle.value.trim() &&
		!inputContent.value.trim() &&
		!inputTag.value.trim()
	)
		return;

	const noteData = {
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
		// CREATE mode
		const newNote = await sendPostRequest(noteData); // you’ll need a POST helper

		// Add to UI
		addNoteToUI(newNote);
	}

	currentNoteId = null;
});
