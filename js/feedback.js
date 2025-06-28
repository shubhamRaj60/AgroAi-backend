const form = document.getElementById('contact-form');
const responseMessage = document.getElementById('response-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    message: form.message.value.trim(),
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.success) {
      responseMessage.style.color = 'green';
      responseMessage.innerText = '✅ Feedback sent successfully!';
      form.reset();
    } else {
      throw new Error('Failed to send feedback');
    }
  } catch (err) {
    responseMessage.style.color = 'red';
    responseMessage.innerText = '❌ Error sending feedback.';
    console.error(err);
  }
});
