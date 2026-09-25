document.addEventListener("DOMContentLoaded", () => {
  // Configuração do WhatsApp
  const WHATSAPP_PHONE = "5587999999999"; // Substitua pelo seu número de WhatsApp com DDD

  // Elementos do DOM
  const waxSeal = document.getElementById("waxSeal");
  const envelopeFlap = document.getElementById("envelopeFlap");
  const envelopeScreen = document.getElementById("envelopeScreen");
  const invitationContainer = document.getElementById("invitationContainer");
  const topControls = document.getElementById("topControls");
  const lightBurst = document.getElementById("lightBurst");

  const bgMusic = document.getElementById("bgMusic");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const shareBtn = document.getElementById("shareBtn");
  const saveCalendarBtn = document.getElementById("saveCalendarBtn");

  // Modais
  const openRsvpBtn = document.getElementById("openRsvpBtn");
  const closeRsvpModal = document.getElementById("closeRsvpModal");
  const rsvpModal = document.getElementById("rsvpModal");
  const rsvpForm = document.getElementById("rsvpForm");

  const openDressBtn = document.getElementById("openDressBtn");
  const closeDressModal = document.getElementById("closeDressModal");
  const dressModal = document.getElementById("dressModal");

  // ==========================================
  // 1. ANIMAÇÃO DE ABERTURA DO ENVELOPE (GSAP)
  // ==========================================
  let isOpened = false;

  waxSeal.addEventListener("click", () => {
    if (isOpened) return;
    isOpened = true;

    // Reproduzir áudio se possível
    bgMusic.play().then(() => {
      musicToggleBtn.classList.add("playing");
    }).catch(() => console.log("Autoplay bloqueado pelo navegador."));

    const tl = gsap.timeline();

    tl.to(lightBurst, { opacity: 1, scale: 20, duration: 0.6, ease: "power2.out" })
      .to(waxSeal, { scale: 0, opacity: 0, duration: 0.4 }, "-=0.4")
      .to(envelopeFlap, { rotateX: 180, duration: 0.6, ease: "power1.inOut" }, "-=0.2")
      .to(envelopeScreen, { opacity: 0, duration: 0.8, onComplete: () => {
          envelopeScreen.style.display = "none";
          invitationContainer.style.display = "block";
      }})
      .to(invitationContainer, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .to(topControls, { opacity: 1, duration: 0.5 }, "-=0.5");
  });

  // ==========================================
  // 2. CONTAGEM REGRESSIVA (06/11/2026 20:00)
  // ==========================================
  const targetDate = new Date("2026-11-06T20:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("d-days").innerText = "00";
      document.getElementById("d-hours").innerText = "00";
      document.getElementById("d-mins").innerText = "00";
      document.getElementById("d-secs").innerText = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("d-days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("d-hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("d-mins").innerText = mins < 10 ? "0" + mins : mins;
    document.getElementById("d-secs").innerText = secs < 10 ? "0" + secs : secs;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 3. CONTROLE DE MÚSICA & COMPARTILHAMENTO
  // ==========================================
  musicToggleBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggleBtn.classList.add("playing");
    } else {
      bgMusic.pause();
      musicToggleBtn.classList.remove("playing");
    }
  });

  shareBtn.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: "15 Anos - Daniele Coelho",
        text: "Você está convidado para a noite encantada de 15 Anos de Daniele Coelho! ✨",
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link do convite copiado para a área de transferência!");
    }
  });

  // Agendar no Google Calendar
  saveCalendarBtn.addEventListener("click", () => {
    const gCalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("15 Anos - Daniele Coelho") +
      "&dates=20261106T200000/20261107T030000" +
      "&details=" + encodeURIComponent("Celebração de 15 Anos de Daniele Coelho no Espaço Aconchego.") +
      "&location=" + encodeURIComponent("Espaço Aconchego, Canacuí, Ouricuri - PE");
    window.open(gCalUrl, "_blank");
  });

  // ==========================================
  // 4. MODAIS & FORMULÁRIO RSVP (WHATSAPP)
  // ==========================================
  openRsvpBtn.addEventListener("click", () => rsvpModal.classList.add("active"));
  closeRsvpModal.addEventListener("click", () => rsvpModal.classList.remove("active"));

  openDressBtn.addEventListener("click", () => dressModal.classList.add("active"));
  closeDressModal.addEventListener("click", () => dressModal.classList.remove("active"));

  // Fechar ao clicar fora do modal
  window.addEventListener("click", (e) => {
    if (e.target === rsvpModal) rsvpModal.classList.remove("active");
    if (e.target === dressModal) dressModal.classList.remove("active");
  });

  // Enviar confirmação para o WhatsApp
  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("guestName").value.trim();
    const guests = document.getElementById("guestCount").value;

    const message = `Olá! Confirmando presença no aniversário de 15 Anos da Daniele Coelho! ✨\n\n` +
                    `👤 *Nome:* ${name}\n` +
                    `👥 *Acompanhantes:* ${guests}`;

    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    rsvpModal.classList.remove("active");
  });

  // ==========================================
  // 5. CANVAS: LANTERNAS FLUTUANTES DOURADAS
  // ==========================================
  const canvas = document.getElementById("lanterns-canvas");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Lantern {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = Math.random() * 4 + 2;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.4;
      this.opacity = Math.random() * 0.7 + 0.3;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 197, 49, ${this.opacity})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#f5c531";
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const lanterns = Array.from({ length: 35 }, () => new Lantern());

  function animateLanterns() {
    ctx.clearRect(0, 0, width, height);
    lanterns.forEach(l => {
      l.update();
      l.draw();
    });
    requestAnimationFrame(animateLanterns);
  }

  animateLanterns();
});