import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAIL_CONFIG = {
  serviceId: 'service_o54pr3o',
  templateId: 'template_0sm2msu',
  publicKey: 'gyLnXYilVhMI9SRjT',
};

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function initEmailForm(): void {
  const form = document.querySelector('#contact-form') as HTMLFormElement;
  if (!form) return;

  emailjs.init(EMAIL_CONFIG.publicKey);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleFormSubmit(form);
  });
}

async function handleFormSubmit(form: HTMLFormElement): Promise<void> {
  const formData = extractFormData(form);
  

  if (!validateForm(formData)) {
    showMessage('Please fill in all fields correctly', 'error');
    return;
  }

  setFormLoading(form, true);

  try {
    await sendEmail(formData);
    showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    form.reset();
  } catch (error) {
    console.error('Email send error:', error);
    showMessage('Failed to send message. Please try again later.', 'error');
  } finally {
    setFormLoading(form, false);
  }
}

function extractFormData(form: HTMLFormElement): FormData {
  const formData = new FormData(form);
  
  return {
    name: formData.get('name') as string || '',
    email: formData.get('email') as string || '',
    subject: formData.get('subject') as string || '',
    message: formData.get('message') as string || '',
  };
}

function validateForm(data: FormData): boolean {
  if (!data.name || !data.email || !data.message) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return false;
  }

  if (data.name.length < 2) {
    return false;
  }


  if (data.message.length < 10) {
    return false;
  }

  return true;
}

async function sendEmail(formData: FormData): Promise<void> {
  try {
    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };
    
    console.log('Sending email with params:', templateParams);
    
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams
    );
    
    console.log('EmailJS response:', response);
    
    if (response.status !== 200) {
      throw new Error('Email send failed');
    }
  } catch (error) {
    console.error('EmailJS error details:', error);
    throw error;
  }
}

function setFormLoading(form: HTMLFormElement, loading: boolean): void {
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const inputs = form.querySelectorAll('input, textarea, button');
  
  if (loading) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    inputs.forEach(input => (input as HTMLInputElement).disabled = true);
    form.classList.add('loading');
  } else {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
    inputs.forEach(input => (input as HTMLInputElement).disabled = false);
    form.classList.remove('loading');
  }
}

function showMessage(message: string, type: 'success' | 'error'): void {
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message--${type}`;
  messageEl.textContent = message;
  messageEl.setAttribute('role', 'alert');


  const form = document.querySelector('#contact-form');
  if (form && form.parentNode) {
    form.parentNode.insertBefore(messageEl, form.nextSibling);
  }

  setTimeout(() => {
    messageEl.style.opacity = '0';
    setTimeout(() => messageEl.remove(), 300);
  }, 5000);
}
