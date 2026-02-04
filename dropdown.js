document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.querySelector(".custom-dropdown");
    const toggleBtn = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    const hiddenInput = dropdown.querySelector("#song-pack-filter");

    // 點擊按鈕，切換選單
    toggleBtn.addEventListener("click", function () {
        dropdown.classList.toggle("active");
    });

    // 選擇選項
    menu.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            toggleBtn.textContent = event.target.textContent;
            hiddenInput.value = event.target.dataset.value;
            dropdown.classList.remove("active");
        }
    });

    // 點擊外部關閉選單
    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("active");
        }
    });
});
