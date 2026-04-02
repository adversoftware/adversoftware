/* SCROLL REVEAL */
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  reveals.forEach(el=>obs.observe(el));
  document.querySelectorAll('.hero .reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('visible'),150+i*130));

  /* HERO VIDEO AUTOPLAY (SAFARI SAFE) */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.volume = 0;
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    
    const play = () => {
      const promise = heroVideo.play();
      if (promise !== undefined) {
        promise.catch(() => {}).then(() => {});
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', play);
    } else {
      play();
    }
    
    heroVideo.addEventListener('loadedmetadata', play);
    document.addEventListener('click', play, { once: true });
    document.addEventListener('touchstart', play, { once: true });
  }

  /* FAQ */
  function toggleFaq(btn){
    const item=btn.closest('.faq-item'),isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!isOpen)item.classList.add('open');
  }

  /* HERO PIXEL EQ BARS */
  const heroEq=document.getElementById('heroEq');
  for(let i=0;i<130;i++){
    const b=document.createElement('div');b.className='eq-bar';
    b.style.cssText=`--min:${4+Math.random()*10}px;--max:${20+Math.random()*65}px;--dur:${0.6+Math.random()*1.4}s;animation-delay:${Math.random()*-2}s;`;
    heroEq.appendChild(b);
  }

  /* NAV */
  const nav=document.getElementById('mainNav');
  window.addEventListener('scroll',()=>{nav.style.background=window.scrollY>50?'rgba(6,9,8,.98)':'rgba(6,9,8,.88)';});

  /* PARALLAX */
  const heroH1=document.querySelector('.hero h1');
  window.addEventListener('scroll',()=>{if(heroH1)heroH1.style.transform=`translateY(${window.scrollY*.09}px)`;});

  /* TYPEWRITER ANIMATION */
  const typewriter=document.getElementById('typewriter');
  if(typewriter){
    const words=typewriter.getAttribute('data-words').split(',')
    let wordIndex=0,charIndex=0,isDeleting=false;
    const typingSpeed=100,deletingSpeed=50,delayBetweenWords=1500;
    
    function type(){
      const currentWord=words[wordIndex];
      const emoji=typewriter.textContent.split(' ')[0];
      
      if(isDeleting){
        charIndex--;
      }else{
        charIndex++;
      }
      
      const displayText=currentWord.substring(0,charIndex);
      typewriter.innerHTML=`${emoji} ${displayText}`;
      
      let nextSpeed=isDeleting?deletingSpeed:typingSpeed;
      
      if(!isDeleting&&charIndex===currentWord.length){
        nextSpeed=delayBetweenWords;
        isDeleting=true;
      }else if(isDeleting&&charIndex===0){
        isDeleting=false;
        wordIndex=(wordIndex+1)%words.length;
        nextSpeed=typingSpeed;
      }
      
      setTimeout(type,nextSpeed);
    }
    
    setTimeout(type,500);
  }

  /* MOBILE HAMBURGER MENU */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  /* PRICING CARD TOGGLE */
  function togglePricingFeatures(btn) {
    const card = btn.closest('.pc');
    const preview = card.querySelector('.pc-features-preview');
    const full = card.querySelector('.pc-features-full');
    const isExpanded = btn.classList.contains('expanded');
    
    if (isExpanded) {
      preview.style.display = 'flex';
      full.style.display = 'none';
      btn.textContent = 'View More →';
      btn.classList.remove('expanded');
    } else {
      preview.style.display = 'none';
      full.style.display = 'block';
      btn.textContent = 'View Less ↑';
      btn.classList.add('expanded');
    }
  }

  /* HORIZONTAL SCROLL ON PRICING CARDS */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    const pricingGrid = document.querySelector('.pricing-grid');
    
    if (pricingGrid) {
      const maxScroll = pricingGrid.scrollWidth - pricingGrid.clientWidth;
      
      gsap.to(pricingGrid, {
        scrollLeft: maxScroll,
        scrollTrigger: {
          trigger: pricingGrid,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          markers: false
        }
      });
    }
  }
