document.addEventListener('DOMContentLoaded', () => {
    // Xử lý cuộn mượt mà khi nhấp vào liên kết điều hướng
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Hiệu ứng hover cho nút "Mua sắm ngay" và "Xem TikTok"
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('pulse');
        });
        button.addEventListener('mouseout', () => {
            button.classList.remove('pulse');
        });
    });

    // Thông báo chào mừng (tùy chọn)
    setTimeout(() => {
        console.log('Chào mừng đến với Order Hàng Taobao!');
    }, 1000);
});