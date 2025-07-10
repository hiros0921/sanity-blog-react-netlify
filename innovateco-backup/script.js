// ローディング画面
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);
});

// カスタムカーソル
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
    
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
    
    requestAnimationFrame(animateCursor);
};
animateCursor();

// ホバー効果
const hoverElements = document.querySelectorAll('a, button, .service-card, .tech-item');
hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
    });
});

// パーティクル生成
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
    particlesContainer.appendChild(particle);
}

// ナビゲーション
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-menu a');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// スクロール時のヘッダー
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ダークモード切り替え
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

// 保存されたテーマを適用
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// 統計カウントアニメーション
const statNumbers = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const updateCount = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
            if (element.getAttribute('data-target') === '98') {
                element.textContent = target + '%';
            } else if (element.getAttribute('data-target') === '24') {
                element.textContent = target + '/7';
            } else {
                element.textContent = target + '+';
            }
        }
    };
    
    updateCount();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            countUp(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(number => {
    statsObserver.observe(number);
});

// 要素のフェードインアニメーション
const fadeElements = document.querySelectorAll('.service-card, .process-step, .achievement-card, .value-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// パララックス効果
const parallaxElements = document.querySelectorAll('.hero-bg, .floating-card');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// フォーム送信処理
const contactForm = document.getElementById('contactForm');
const submitButton = contactForm.querySelector('.submit-button');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // ボタンをローディング状態に
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // フォームデータの収集
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // 送信シミュレーション（実際のAPIに置き換える）
    setTimeout(() => {
        // 成功アニメーション
        submitButton.classList.remove('loading');
        submitButton.innerHTML = '<span class="btn-text">送信完了 ✓</span>';
        submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        // フォームリセット
        setTimeout(() => {
            contactForm.reset();
            submitButton.innerHTML = '<span class="btn-text">送信する</span><span class="btn-loader"></span>';
            submitButton.style.background = '';
            submitButton.disabled = false;
            
            // 成功メッセージ
            showNotification('お問い合わせありがとうございます。内容を確認の上、担当者よりご連絡させていただきます。');
        }, 2000);
    }, 2000);
});

// 通知表示関数
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: var(--shadow-xl);
        z-index: 9999;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 3s forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3500);
}

// スクロールトップボタン
const scrollToTopButton = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// マウスホイールでの横スクロール（テクノロジーセクション）
const techCategories = document.querySelector('.tech-categories');
if (techCategories) {
    techCategories.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            techCategories.scrollLeft += e.deltaY;
        }
    });
}

// ブログカードのクリックイベント
const blogCards = document.querySelectorAll('.blog-card');
blogCards.forEach(card => {
    card.addEventListener('click', () => {
        window.open('https://note.com/ready_bison5376', '_blank', 'noopener noreferrer');
    });
});

// YouTubeビデオのクリックイベント
const videoElements = document.querySelectorAll('.video-placeholder, .video-card');
videoElements.forEach(element => {
    element.addEventListener('click', () => {
        window.open('https://www.youtube.com/channel/UCsmqx_x47tlemPGxcdrdqPg', '_blank', 'noopener noreferrer');
    });
});

// サービスカードのホバーエフェクト
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 10;
        const angleY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// テキストアニメーション
const animateText = (element) => {
    const text = element.textContent;
    element.textContent = '';
    
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
        element.appendChild(span);
    });
};

// ページロード時のアニメーション
window.addEventListener('DOMContentLoaded', () => {
    // タイトルアニメーション
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
        }, 100);
    }
});

// リサイズ時の処理
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // レスポンシブ調整
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, 250);
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimized scroll handler
window.addEventListener('scroll', debounce(() => {
    // スクロール関連の処理
}, 10));

// Intersection Observer for lazy loading
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});