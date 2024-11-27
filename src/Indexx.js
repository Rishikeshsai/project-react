import React, { useState, useEffect } from 'react';
import './Indexx.css'; // Import the CSS file

const Index = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  
  useEffect(() => {
    // Slideshow functionality
    const slides = document.getElementsByClassName('mySlides');
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const showSection = (sectionId) => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
      section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update active link in navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
      link.classList.remove('active');
    });
    navLinks.forEach((link) => {
      if (link.textContent.toLowerCase() === sectionId) {
        link.classList.add('active');
      }
    });
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('http://localhost:5000/process-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const generatedImageURL = URL.createObjectURL(blob);
        setGeneratedImage(generatedImageURL);
      } else {
        alert('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the request.');
    }
  };

  return (
    <div>
      <header>
        <h1>JEWELRY DESIGN PATTERN GENERATION</h1>
      </header>

      <nav>
        <a href="javascript:void(0);" onClick={() => showSection('home')} className="active">
          HOME
        </a>
        <a href="javascript:void(0);" onClick={() => showSection('upload')}>
          UPLOAD FILE
        </a>
        <a href="javascript:void(0);" onClick={() => showSection('about')}>
          ABOUT
        </a>
        <a href="javascript:void(0);" onClick={() => showSection('contact')}>
          CONTACT US
        </a>
      </nav>

      <div className="container">
        {/* Slideshow Section in Home Page */}
        <section id="home" className="section">
          <div className="slideshow-container">
            {['11.png', '12.png', '13.png', '14.png', '16.png', '20.png', '15.png'].map((image, index) => (
              <div key={index} className={`mySlides ${index === slideIndex ? 'active' : ''}`}>
                <img src={image} alt={`Jewelry Design ${index + 1}`} />
              </div>
            ))}
          </div>
          <a className="prev" onClick={() => setSlideIndex((slideIndex - 1 + 7) % 7)}>
            &#10094;
          </a>
          <a className="next" onClick={() => setSlideIndex((slideIndex + 1) % 7)}>
            &#10095;
          </a>

          {/* Instructions in Boxes */}
          <div className="instructions">
            {['Step 1: Choose your design inspiration.', 'Step 2: Upload your favorite patterns.', 'Step 3: Generate custom designs.'].map((instruction, index) => (
              <div key={index} className="instruction-box">
                <h2>{instruction.split(':')[0]}</h2>
                <h3>{instruction.split(':')[1]}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* File Upload Section */}
        <section id="upload" className="section hidden">
          <h2>UPLOAD IMAGE</h2>
          <div className="upload-container">
            <div className="upload-box">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="file" id="imageInput" name="imageInput" accept="image/*" onChange={handleImagePreview} required />
                <br />
                <button type="submit">Submit</button>
              </form>
            </div>

            <div className="preview-container">
              <h3>Image Preview:</h3>
              {previewImage && <img src={previewImage} className="preview-image" alt="Preview" />}
            </div>
            <div className="preview-container">
              <h2>Generated Image:</h2>
              {generatedImage && <img src={generatedImage} className="preview-image" alt="Generated" />}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section hidden">
          <h2>ABOUT US</h2>
          <div className="zigzag-container">
            {[{ image: 'about1.jpg', title: 'Our Mission', description: 'To create stunning jewelry designs that inspire and empower.' }, { image: 'about2.jpg', title: 'Our Vision', description: 'To be a leader in innovative jewelry design.' }].map((item, index) => (
              <div key={index} className="zigzag-box">
                <img src={item.image} alt={`About Us ${index + 1}`} />
                <h3>{item.title}</h3>
                <h3>{item.description}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="section hidden">
          <h2>CONTACT US</h2>
          <p>Email us at <a href="mailto:info@jewelrystudio.com">info@jewelrystudio.com</a></p>
        </section>
      </div>
    </div>
  );
};

export default Index;
