const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close-btn');

closeButtons.forEach(btn => {
    btn.onclick = function(event) {
        ['FR', 'EN', 'DE', 'LU'].forEach(lang => {
            document.getElementById(`template-content-modal-${lang.toLowerCase()}`).style.display = 'none';
        });
        event.stopPropagation();
    }
});


window.onclick = function(event) {
    ['FR', 'EN', 'DE', 'LU'].forEach(lang => {
        const modal = document.getElementById(`template-content-modal-${lang.toLowerCase()}`);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
