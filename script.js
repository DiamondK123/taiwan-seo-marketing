// Native HTML validation and POST remain available without JavaScript.
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    const textFields = contactForm.querySelectorAll('input[required]:not([type="checkbox"]),textarea[required]');
    for (const field of textFields) {
      field.setCustomValidity(field.value.trim() ? '' : '請填寫此欄位。');
      if (!field.checkValidity()) { event.preventDefault(); field.reportValidity(); return; }
    }
  });
  contactForm.addEventListener('input', (event) => event.target.setCustomValidity?.(''));
}
