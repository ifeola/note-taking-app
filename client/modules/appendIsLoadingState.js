export default function appendIsLoadingState(loadingListContainer) {
	loadingListContainer.innerHTML = "";

	[...Array(8)].forEach((_, id) => {
		const loading = document.createElement("li");
		loading.classList.add("loading-note-state");
		const loadingInner = `
      <div class="loading-top">
				<div class="loading-tag"></div>
				<div class="loading-top-bottom">
					<div class="loading-title">
						<div class="loading-title-1"></div>
						<div class="loading-title-2"></div>
					</div>
					<div class="loading-edit-btn"></div>
				</div>
			</div>
			<div class="loading-bottom">
				<div class="loading-paragraph">
					<div class="loading-paragraph-1"></div>
					<div class="loading-paragraph-2"></div>
					<div class="loading-paragraph-3"></div>
					<div class="loading-paragraph-4"></div>
				</div>
				<div class="loading-bottom-bottom">
					<div class="loading-date"></div>
					<div class="loading-delete-btn"></div>
				</div>
			</div>
    `;
		loading.innerHTML = loadingInner;
		loadingListContainer.append(loading);
	});
}
