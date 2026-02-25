// Đợi cho đến khi toàn bộ nội dung trang web được tải xong
document.addEventListener("DOMContentLoaded", function() {

    // 1. Chọn tất cả các phần tử có class là 'hidden'
    // Đây là những section chúng ta muốn áp dụng hiệu ứng động
    const hiddenElements = document.querySelectorAll('.hidden');

    // 2. Tạo một 'IntersectionObserver'
    // Đây là công cụ của trình duyệt giúp phát hiện khi nào một phần tử xuất hiện trong khung nhìn (viewport)
    const observer = new IntersectionObserver((entries) => {
        // 'entries' là danh sách các phần tử đang được theo dõi
        entries.forEach((entry) => {
            console.log(entry); // (Tùy chọn) Kiểm tra trong console để xem nó hoạt động thế nào

            // Nếu phần tử đang giao nhau với khung nhìn (nghĩa là nó đang hiển thị trên màn hình)
            if (entry.isIntersecting) {
                // Thêm class 'show' vào phần tử đó
                // Class 'show' trong CSS sẽ kích hoạt hiệu ứng chuyển động (từ mờ sang rõ, trượt từ dưới lên)
                entry.target.classList.add('show');

                // (Tùy chọn) Ngừng theo dõi phần tử này sau khi nó đã hiện ra một lần
                // Điều này giúp hiệu ứng chỉ chạy 1 lần duy nhất khi cuộn xuống
                // observer.unobserve(entry.target);
            } else {
                // (Tùy chọn) Nếu muốn hiệu ứng lặp lại khi cuộn lên/xuống, hãy bỏ comment dòng dưới
                // entry.target.classList.remove('show');
            }
        });
    }, {
        // Tùy chọn cấu hình cho Observer
        // threshold: 0.15 nghĩa là khi 15% của phần tử xuất hiện thì mới kích hoạt hiệu ứng
        // Giúp hiệu ứng không bị kích hoạt quá sớm khi phần tử vừa mới ló dạng
        threshold: 0.15
    });

    // 3. Bắt đầu theo dõi tất cả các phần tử 'hidden' đã chọn ở bước 1
    hiddenElements.forEach((el) => observer.observe(el));

    // ============================================================
    // (Bổ sung) Hiệu ứng cuộn mượt khi click vào link nội bộ (ví dụ: nút "Nhấp vào đây")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Ngăn chặn hành vi nhảy trang mặc định

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth', // Cuộn mượt
                    block: 'start' // Căn đầu phần tử lên đầu màn hình
                });
            }
        });
    });

});

// Biến lưu trữ vị trí hiện tại của slider
let currentStep = 0;
const imagesPerPage = 5; 

// 1. Hàm đổi ảnh chính (đã có của bạn, cập nhật thêm active class)
function changeImage(element) {
    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
        mainImg.src = element.src;
    }
    
    // Xử lý viền cho ảnh đang chọn
    let thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

// 2. Hàm trượt slider theo nhóm 5 ảnh
function moveSlider(direction) {
    const list = document.getElementById('thumbList');
    const thumbs = document.querySelectorAll('.thumb');
    const totalImages = thumbs.length;
    
    // Tính tổng số lượt bấm tối đa (ví dụ 12 ảnh / 5 = 2.4 -> cần 3 lượt)
    const maxSteps = Math.ceil(totalImages / imagesPerPage) - 1;

    currentStep += direction;

    // Chặn không cho trượt quá giới hạn
    if (currentStep < 0) {
        currentStep = 0;
    } else if (currentStep > maxSteps) {
        currentStep = maxSteps;
    }

    // Tính toán khoảng cách trượt
    // Mỗi step trượt 100% chiều rộng của container hiển thị
    const offset = currentStep * 100;
    list.style.transform = `translateX(-${offset}%)`;
    
    // Tùy chọn: Ẩn/hiện nút nếu đã ở đầu/cuối trang
    updateButtonState(currentStep, maxSteps);
}

// Hàm hỗ trợ làm mờ nút khi không trượt được nữa
function updateButtonState(step, max) {
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (prevBtn) prevBtn.style.opacity = (step === 0) ? "0.3" : "1";
    if (nextBtn) nextBtn.style.opacity = (step === max) ? "0.3" : "1";
}

// Hàm tự động tạo ảnh để bạn không phải viết thủ công 60 thẻ <img>
function loadGallery() {
    const grids = {
        'grid53': 36,
        'grid70': 12,
        'grid90': 0
    };

    for (let id in grids) {
        const container = document.getElementById(id);
        const count = grids[id];
        const sizeTag = id.replace('grid', ''); // Lấy ra 53, 70 hoặc 90

        for (let i = 1; i <= count; i++) {
            const img = document.createElement('img');
            // Bạn cần đặt tên ảnh là khan53-1.jpg, khan53-2.jpg... để khớp logic này
            img.src = `SanPham/khan-to-tam/ktt${sizeTag}/anhfull/anh (${i}).jpg`; 
            img.className = 'grid-item';
            img.alt = `Khăn tơ tằm ${sizeTag} mẫu ${i}`;
            
            // Khi bấm vào sẽ gọi hàm mở Lightbox
            img.onclick = function() { openLightbox(this.src); };
            
            container.appendChild(img);
        }
    }
}

function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    lb.style.display = 'flex';
    lbImg.src = src;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// Chạy hàm khi trang tải xong
window.onload = loadGallery;