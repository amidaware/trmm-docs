document.addEventListener("DOMContentLoaded", function () {
    // Create modal elements
    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img class="image-modal-img" src="" alt="">
            <div class="image-modal-caption"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector(".image-modal-img");
    const modalCaption = modal.querySelector(".image-modal-caption");
    const closeBtn = modal.querySelector(".image-modal-close");

    // Add click event to all images in the content area
    const images = document.querySelectorAll(".md-content img");
    
    images.forEach((img) => {
        // Add a cursor pointer to indicate clickable
        img.style.cursor = "pointer";
        
        img.addEventListener("click", function() {
            modal.style.display = "flex";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            modalCaption.textContent = this.alt || this.title || "";
            
            // Prevent body scrolling when modal is open
            document.body.style.overflow = "hidden";
        });
    });

    // Close modal when clicking the X
    closeBtn.addEventListener("click", function() {
        closeModal();
    });

    // Close modal when clicking anywhere in the modal (including on the image)
    modal.addEventListener("click", function(e) {
        // Close modal when clicking anywhere except the close button
        if (e.target !== closeBtn) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});
