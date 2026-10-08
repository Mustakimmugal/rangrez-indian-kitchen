import { useEffect, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown,
  Clock3, Instagram, MapPin, Menu as MenuIcon, Minus, Plus, Sparkles,
  X,
} from 'lucide-react';
import { menuCategories, menuItems as sampleMenu } from './data/menu';

const API_URL = import.meta.env.VITE_API_URL || '';
const times = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];
const indiaDateParts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
const indiaPart = (type) => indiaDateParts.find((part) => part.type === type)?.value;
const today = `${indiaPart('year')}-${indiaPart('month')}-${indiaPart('day')}`;
const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90', alt: 'A warmly lit Indian restaurant dining room', label: 'NAMASTE, DILLI', detail: 'A TABLE IS WAITING FOR YOU' },
  { image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1800&q=90', alt: 'Aromatic Indian biryani made for sharing', label: 'DUM PUKHT', detail: 'SLOW COOKED, BIG HEARTED' },
  { image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1800&q=90', alt: 'A rich Indian curry finished with herbs', label: 'DILLI KA ZAIKA', detail: 'OLD RECIPES, NEW MEMORIES' },
];
const marqueeMoments = [
  { name: 'Paneer tikka', detail: 'TANDOOR KISSED', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
  { name: 'Biryani, dum style', detail: 'SLOW COOKED', image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=400&q=80' },
  { name: 'A little chaat', detail: 'SWEET · TANGY · CRISP', image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Gulab jamun', detail: 'SAVE SOME ROOM', image: 'https://images.unsplash.com/photo-1604495772376-9657f0035eb5?auto=format&fit=crop&w=400&q=80' },
];
const galleryPhotos = [
  { image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85', alt: 'Rangrez dining room glowing at dinner time', label: 'THE DINING ROOM' },
  { image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=85', alt: 'An intimate restaurant table ready for guests', label: 'YOUR TABLE, TONIGHT' },
  { image: 'https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1000&q=85', alt: 'Indian dishes served to share', label: 'MADE FOR SHARING' },
  { image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85', alt: 'A private dining celebration with warm lights', label: 'LITTLE CELEBRATIONS' },
  { image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85', alt: 'A freshly prepared Indian curry', label: 'FROM OUR KITCHEN' },
  { image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=1000&q=85', alt: 'Fragrant biryani served hot', label: 'DUM, THEN DONE' },
  { image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85', alt: 'Tandoor grilled Indian starters', label: 'FRESH FROM THE TANDOOR' },
];

function App() {
  const [menu, setMenu] = useState(sampleMenu);
  const [category, setCategory] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [guests, setGuests] = useState(2);
  const [reservation, setReservation] = useState({ name: '', email: '', phone: '', date: today, time: '7:00 PM', occasion: '', offerCode: '', notes: '' });
  const [reservationState, setReservationState] = useState({ loading: false, message: '', error: false });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/menu`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => { if (Array.isArray(data) && data.length) setMenu(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [category, menu]);

  const visibleMenu = category === 'All' ? menu : menu.filter((item) => item.category === category);
  const updateReservation = (event) => setReservation((current) => ({ ...current, [event.target.name]: event.target.value }));
  const claimOffer = () => {
    setReservation((current) => ({ ...current, offerCode: 'RANGREZ15' }));
    document.querySelector('#reserve')?.scrollIntoView({ behavior: 'smooth' });
  };

  async function submitReservation(event) {
    event.preventDefault();
    setReservationState({ loading: true, message: '', error: false });
    const payload = { ...reservation, guests: Number(guests) };
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'We could not save that request. Please try again.');
      setReservationState({ loading: false, message: payload.offerCode ? `Your table request is in. We’ve attached ${payload.offerCode}; our team will confirm your booking shortly.` : 'Your table request is in. We’ll be in touch shortly to confirm.', error: false });
    } catch (error) {
      if (error instanceof TypeError) {
        setReservationState({ loading: false, message: 'Thanks! Your reservation demo is ready. Connect the API to save requests.', error: false });
      } else {
        setReservationState({ loading: false, message: error.message, error: true });
      }
    }
  }

  async function submitNewsletter(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newsletterEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Please try that email again.');
      setNewsletterMessage('You’re on the list. See you around the table.');
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterMessage(error instanceof TypeError ? 'Thanks for joining us. Connect the API to save your signup.' : error.message);
    }
  }

  return (
    <>
      <div className="announcement"><span>Indian soul, Dilli swagger, and a table full of stories.</span><a href="#specials">See this week’s special <ArrowUpRight size={12} /></a></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Rangrez home"><span className="brand-mark">रं</span><span>RANGREZ<small>INDIAN KITCHEN · EST. 2016</small></span></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a><a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a><a href="#specials" onClick={() => setMenuOpen(false)}>Offers</a><a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a><a href="#visit" onClick={() => setMenuOpen(false)}>Visit us</a>
        </nav>
        <a className="nav-cta" href="#reserve">Book your table <ArrowUpRight size={15} /></a>
        <button className="mobile-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <MenuIcon />}</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy reveal" data-reveal>
            <div className="eyebrow"><span className="eyebrow-line" /> CONNAUGHT PLACE · NEW DELHI</div>
            <h1>India in<br /><em>every bite.</em></h1>
            <p className="hero-description">Old Delhi comfort, a little royal flair, and recipes that have travelled generations. Pull up a chair; we have made extra.</p>
            <div className="hero-actions"><a className="button button-dark" href="#reserve">Reserve your table <ArrowUpRight size={18} /></a><a className="text-link" href="#menu">See what’s cooking <ArrowDown size={16} /></a></div>
            <div className="hero-note"><span className="note-stars">★★★★★</span><span>Delhi’s table for good stories since 2016</span></div>
            <span className="hero-index">01 — 03</span>
          </div>
          <div className="hero-image-wrap reveal" data-reveal>
            <img key={heroSlides[heroSlide].image} className="hero-image hero-image-enter" src={heroSlides[heroSlide].image} alt={heroSlides[heroSlide].alt} />
            <div className="hero-image-caption"><span>{heroSlides[heroSlide].label}</span><span>{heroSlides[heroSlide].detail}</span><div className="hero-dots" aria-label="Choose a featured image">{heroSlides.map((slide, index) => <button key={slide.label} type="button" aria-label={`Show ${slide.label.toLowerCase()}`} aria-pressed={heroSlide === index} className={heroSlide === index ? 'hero-dot active' : 'hero-dot'} onClick={() => setHeroSlide(index)} />)}</div></div>
            <div className="hero-image-index">37°48' N&nbsp; 122°24' W</div>
            <div className="hero-auto-label"><span /> A LITTLE MOMENT, ON REPEAT</div>
          </div>
          <div className="hero-side-note">INDIAN HEART · DELHI SOUL <span /></div>
        </section>

        <section className="offer-banner" id="specials" data-reveal>
          <div className="offer-sun">✳</div>
          <div className="offer-copy"><span className="offer-kicker">A LITTLE SOMETHING FROM US</span><h2>Masala mood? <em>15% off.</em></h2><p>Book a Monday–Thursday table and enjoy 15% off your food bill. A warm welcome, on the house.</p></div>
          <div className="offer-code-box"><span>USE CODE</span><strong>RANGREZ15</strong><small>MON–THU · DINE-IN</small></div>
          <button className="button offer-button" type="button" onClick={claimOffer}>Claim this offer <ArrowUpRight size={18} /></button>
        </section>

        <section className="intro-strip" aria-label="Our philosophy"><p>Good food is a love language.<br /><em>We speak it with masala.</em></p><div className="intro-rule" /><div className="intro-facts"><span><strong>01</strong> LOCAL PRODUCE</span><span><strong>02</strong> SPICES, SLOW ROASTED</span><span><strong>03</strong> ALWAYS MADE FRESH</span></div><div className="intro-stamp"><span>DIL SE</span><strong>♡</strong><span>DELHI TAK</span></div></section>

        <section className="marquee-section" aria-label="A moving taste of Rangrez">
          <div className="marquee-heading"><span>FROM OUR KITCHEN, WITH LOVE</span><span>INDIAN FLAVOURS IN MOTION <Sparkles size={15} /></span></div>
          <div className="marquee-row marquee-left" aria-hidden="true"><div className="marquee-track">{[0, 1].map((loop) => <div className="marquee-group" key={loop}>{marqueeMoments.map((moment) => <div className="marquee-card" key={`${loop}-${moment.name}`}><img src={moment.image} alt="" /><span><small>{moment.detail}</small><strong>{moment.name}</strong></span><Sparkles size={14} /></div>)}</div>)}</div></div>
          <div className="marquee-row marquee-right" aria-hidden="true"><div className="marquee-track">{[0, 1].map((loop) => <div className="marquee-group" key={loop}>{marqueeMoments.map((moment) => <div className="marquee-card" key={`${loop}-${moment.name}`}><img src={moment.image} alt="" /><span><small>{moment.detail}</small><strong>{moment.name}</strong></span><Sparkles size={14} /></div>)}</div>)}</div></div>
        </section>

        <section className="story-section section-pad" id="story">
          <div className="story-image-frame reveal" data-reveal><img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1100&q=85" alt="A warmly lit restaurant table ready for guests" /><div className="image-note">THE ART OF<br /><em>TAKING YOUR TIME</em></div></div>
          <div className="story-copy reveal" data-reveal><div className="eyebrow"><span className="eyebrow-line" /> ROOTED IN INDIA, RIGHT HERE IN DELHI</div><h2>Old recipes.<br />New stories.<br /><em>One table.</em></h2><p>Rangrez is our love letter to India’s endless food stories — from the tandoors of Punjab to the fragrant lanes of Lucknow. Familiar flavours, made with care and served with a little celebration.</p><a className="text-link text-link-dark" href="#gallery">Step inside Rangrez <ArrowRight size={16} /></a><div className="signature">Dil se, <span>the Rangrez family</span></div></div>
        </section>

        <section className="menu-section section-pad" id="menu">
          <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> NORTH INDIAN · AWADHI · STREET FOOD</div><h2>Big Indian flavours.<br /><em>Made to share.</em></h2></div><a className="text-link text-link-dark menu-download" href="#reserve">Come hungry <ArrowUpRight size={16} /></a></div>
          <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Filter menu by category">{menuCategories.map((name) => <button key={name} role="tab" aria-selected={category === name} className={category === name ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(name)}>{name}</button>)}</div><span className="menu-season">OUR MENU, THIS SEASON <span>✳</span></span></div>
          <div className="menu-grid">{visibleMenu.map((item, index) => <article className="menu-card reveal" data-reveal key={item._id || item.name}><div className="menu-card-image"><img src={item.image} alt={item.name} loading="lazy" /><span className="dish-number">{String(index + 1).padStart(2, '0')}</span>{item.tag && <span className="dish-tag">{item.tag}</span>}</div><div className="menu-card-body"><div className="dish-title-line"><h3>{item.name}</h3><span>₹{Number(item.price).toLocaleString('en-IN')}</span></div><p>{item.description}</p><div className="dish-meta">{(item.dietary || []).map((diet) => <span key={diet}>{diet}</span>)}</div></div></article>)}</div>
          <div className="menu-footnote"><span>✳</span> Seasonal specials change with the market. Tell our team about allergies or dietary preferences.</div>
        </section>

        <section className="quote-section"><div className="quote-overlay" /><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85" alt="A festive restaurant dining room glowing at dinner" loading="lazy" /><div className="quote-content reveal" data-reveal><div className="quote-stars">✦ ✦ ✦ ✦ ✦</div><blockquote>“Come for the butter chicken.<br />Stay for one more story.”</blockquote><div className="quote-credit"><span>THE RANGREZ WAY</span><span className="quote-divider" /><span>GOOD FOOD · GOOD COMPANY</span></div></div><span className="quote-vertical">DILLI KA SWAAD · DILLI KA PYAAR</span></section>

        <section className="reservation-section section-pad" id="reserve"><div className="reservation-aside reveal" data-reveal><div className="eyebrow"><span className="eyebrow-line" /> DILLI WALI MEHFIL, BAS AAPKE NAAM</div><h2>Save a seat.<br /><em>Bring a story.</em></h2><p>Pick your day, bring your favourite people, and we’ll take care of the rest. For a same-day table, give our team a call.</p><a className="phone-link" href="tel:+919876543210">+91 98765 43210 <ArrowUpRight size={15} /></a><div className="reservation-detail"><Clock3 size={17} /><span><strong>OPEN FOR LUNCH & DINNER</strong><br />Daily, 12:00–3:30 pm<br />7:00–11:00 pm</span></div><div className="reservation-detail"><MapPin size={17} /><span><strong>COME FIND US</strong><br />Connaught Place<br />New Delhi, India</span></div></div>
          <form className="reservation-card reveal" data-reveal onSubmit={submitReservation}><div className="form-card-heading"><span>RESERVE YOUR TABLE</span><CalendarDays size={18} /></div><div className="form-grid"><label className="field field-wide">Your name<input name="name" value={reservation.name} onChange={updateReservation} placeholder="Name for the table" autoComplete="name" required /></label><label className="field">Email address<input type="email" name="email" value={reservation.email} onChange={updateReservation} placeholder="you@example.com" autoComplete="email" required /></label><label className="field">Mobile number<input type="tel" name="phone" value={reservation.phone} onChange={updateReservation} placeholder="+91 98765 43210" autoComplete="tel" required /></label><label className="field">Date<input type="date" name="date" value={reservation.date} min={today} onChange={updateReservation} required /></label><label className="field">Time<span className="select-wrap"><select name="time" value={reservation.time} onChange={updateReservation}>{times.map((time) => <option key={time}>{time}</option>)}</select><ChevronDown size={14} /></span></label><div className="field"><span className="field-label">Guests</span><div className="guest-stepper"><button type="button" aria-label="Remove one guest" onClick={() => setGuests((value) => Math.max(1, value - 1))}><Minus size={14} /></button><span>{guests} {guests === 1 ? 'guest' : 'guests'}</span><button type="button" aria-label="Add one guest" onClick={() => setGuests((value) => Math.min(12, value + 1))}><Plus size={14} /></button></div></div><label className="field">Celebrating anything? <span className="select-wrap"><select name="occasion" value={reservation.occasion} onChange={updateReservation}><option value="">Just because</option><option>Birthday</option><option>Anniversary</option><option>Special occasion</option></select><ChevronDown size={14} /></span></label><label className="field">Offer code<input name="offerCode" value={reservation.offerCode} onChange={updateReservation} placeholder="RANGREZ15" /></label><label className="field field-wide">A note for our team <textarea name="notes" value={reservation.notes} onChange={updateReservation} placeholder="Dietary needs or a little surprise…" rows="2" /></label></div><button className="button button-dark reservation-submit" disabled={reservationState.loading}>{reservationState.loading ? 'Sending request…' : 'Confirm reservation'} <ArrowUpRight size={18} /></button>{reservationState.message && <p className={reservationState.error ? 'form-message error' : 'form-message'} role="status">{!reservationState.error && <Check size={16} />}{reservationState.message}</p>}<p className="reservation-terms">We’ll contact you to confirm your table. Offer code RANGREZ15: Monday–Thursday reservations. Parties of 7+? <a href="mailto:hello@rangrez.in">Write to us.</a></p></form>
        </section>

        <section className="private-section" id="private-dining"><div className="private-image reveal" data-reveal><img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85" alt="A private dining celebration with warm lights" loading="lazy" /><span className="private-image-caption">A ROOM OF YOUR OWN</span></div><div className="private-copy reveal" data-reveal><div className="eyebrow"><span className="eyebrow-line" /> FOR THE MOMENTS THAT MATTER</div><h2>Apni mehfil.<br /><em>Your people.</em></h2><p>Birthdays, family dinners, little weddings. Our private dining room hosts up to 22 guests, with a menu made for your celebration.</p><a className="button button-outline" href="mailto:hello@rangrez.in?subject=Private%20dining%20at%20Rangrez">Plan a gathering <ArrowUpRight size={17} /></a><span className="private-capacity">PRIVATE DINING · UP TO 22 GUESTS</span></div></section>

        <section className="gallery-section" id="gallery"><div className="gallery-heading reveal" data-reveal><div><div className="eyebrow"><span className="eyebrow-line" /> A GLIMPSE INTO RANGREZ</div><h2>Come for a meal.<br /><em>Stay for the feeling.</em></h2></div><a className="text-link text-link-dark" href="#reserve">Be part of the story <ArrowUpRight size={16} /></a></div><div className="gallery-grid">{galleryPhotos.map((photo, index) => <figure className={`gallery-photo gallery-photo-${index + 1} reveal`} data-reveal key={photo.label}><img src={photo.image} alt={photo.alt} loading="lazy" /><figcaption><span>0{index + 1}</span>{photo.label}</figcaption></figure>)}</div></section>

        <section className="newsletter-section"><div className="newsletter-flower">✳</div><div className="newsletter-copy reveal" data-reveal><div className="eyebrow"><span className="eyebrow-line" /> A NOTE FROM OUR TABLE</div><h2>Good news.<br /><em>Extra chutney.</em></h2><p>Seasonal specials, a seat at our table, and a story or two from the kitchen. Never more than a note or two a month.</p></div><form className="newsletter-form reveal" data-reveal onSubmit={submitNewsletter}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Your email address" required /><button type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={19} /></button>{newsletterMessage && <span className="newsletter-message" role="status">{newsletterMessage}</span>}</form></section>
      </main>

      <footer className="site-footer" id="visit"><div className="footer-top"><a className="brand footer-brand" href="#home"><span className="brand-mark">रं</span><span>RANGREZ<small>INDIAN KITCHEN · EST. 2016</small></span></a><p>Har mehfil mein<br /><em>thoda aur swaad.</em></p><a className="footer-reserve" href="#reserve">Come on in <ArrowUpRight size={17} /></a></div><div className="footer-main"><div className="footer-address"><span className="footer-label">COME FIND US</span><p>Connaught Place<br />New Delhi, India</p><a href="https://maps.google.com/?q=Connaught+Place+New+Delhi" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={14} /></a></div><div className="footer-hours"><span className="footer-label">WHEN THE TANDOOR IS ON</span><p>Every day <span>12:00–3:30 PM</span><br />Dinner <span>7:00–11:00 PM</span></p><a href="tel:+919876543210">+91 98765 43210</a></div><div className="footer-social"><span className="footer-label">FOLLOW THE GOOD STUFF</span><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram <ArrowUpRight size={13} /></a><div className="footer-made">Dil se <span>♥</span> in New Delhi</div></div></div><div className="footer-bottom"><span>© 2026 RANGREZ INDIAN KITCHEN</span><span>DILLI KA SWAAD · DILLI KA PYAAR</span><a href="mailto:hello@rangrez.in">SAY NAMASTE <ArrowUpRight size={12} /></a></div></footer>
    </>
  );
}

export default App;
