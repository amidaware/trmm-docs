document.addEventListener("DOMContentLoaded", function () {
    const inlineCodeItems = document.querySelectorAll("p code, li code, span code");

    inlineCodeItems.forEach((codeItem) => {
        // Add copy functionality directly to the code element (no visible icon)
        codeItem.style.cursor = "pointer";
        codeItem.title = "Click to copy";

        // Set up the copy action on the code element itself
        codeItem.addEventListener("click", (event) => {
            event.stopPropagation();
            const codeText = codeItem.innerText.trim(); // Trim any whitespace
            navigator.clipboard.writeText(codeText).then(
                () => {
                    // Briefly change background to indicate successful copy
                    const originalBg = codeItem.style.backgroundColor;
                    codeItem.style.backgroundColor = "#4CAF50";
                    setTimeout(() => {
                        codeItem.style.backgroundColor = originalBg;
                    }, 200);
                },
                () => {
                    // Briefly change background to indicate failed copy
                    const originalBg = codeItem.style.backgroundColor;
                    codeItem.style.backgroundColor = "#f44336";
                    setTimeout(() => {
                        codeItem.style.backgroundColor = originalBg;
                    }, 200);
                }
            );
        });
    });
});