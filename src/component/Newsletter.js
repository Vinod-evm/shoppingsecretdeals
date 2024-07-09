import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
    const [formData, setFormData] = useState({
        yourName: '',
        yourEmail: '',
        yourMessage: '',
      });
      const [responseMessage, setResponseMessage] = useState('');
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formId = '81aa042'; // Replace with your form ID
        const url = `https://shoppingsecretdeals.com/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;
    
        const formPayload = {
          'your-name': formData.yourName,
          'your-email': formData.yourEmail,
          'your-message': formData.yourMessage,
        };
    
        try {
          const response = await axios.post(url, formPayload);
          if (response.data.status === 'mail_sent') {
            setResponseMessage('Message sent successfully!');
          } else {
            setResponseMessage('Failed to send message.');
          }
        } catch (error) {
          setResponseMessage('An error occurred. Please try again.');
        }
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="yourName"
            value={formData.yourName}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="yourEmail"
            value={formData.yourEmail}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <textarea
            name="yourMessage"
            value={formData.yourMessage}
            onChange={handleChange}
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit">Send</button>
          {responseMessage && <p>{responseMessage}</p>}
        </form>
      );
    };

export default Newsletter