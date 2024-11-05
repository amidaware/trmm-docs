document.addEventListener("DOMContentLoaded", function () {
    const inlineCodeItems = document.querySelectorAll("p code, li code, span code");

    inlineCodeItems.forEach((codeItem) => {
        // Create the copy button icon (using SVG)
        const icon = document.createElement("span");
        icon.className = "copy-icon";
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H14C15.1 22 16 21.1 16 20V16H8C6.9 16 6 15.1 6 14V8Z" fill="currentColor"/>
                <path d="M20 2H10C8.9 2 8 2.9 8 4V14C8 15.1 8.9 16 10 16H20C21.1 16 22 15.1 22 14V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
            </svg>`;

        // Set up the copy action on the icon
        icon.addEventListener("click", (event) => {
            event.stopPropagation();
            const codeText = codeItem.innerText.trim(); // Trim any whitespace
            navigator.clipboard.writeText(codeText).then(
                () => (icon.classList.add("copied")),
                () => (icon.classList.add("copy-failed"))
            );
            setTimeout(() => icon.classList.remove("copied", "copy-failed"), 2000);
        });

        // Append the icon inside the code element
        codeItem.appendChild(icon);
    });
});