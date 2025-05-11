const fs = require('fs').promises;
const path = require('path');

async function base64ToImage(base64String, imageName = 'upload.jpg', uploadDir = path.join(__dirname, '../../src/public/uploads')) {
    try {
        // Kiểm tra xem chuỗi Base64 có tiền tố data URL không và loại bỏ nó
        const base64Data = base64String.startsWith('data:') ? base64String.replace(/^data:image\/\w+;base64,/, '') : base64String;

        // Chuyển đổi chuỗi Base64 thành Buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Tạo tên file duy nhất
        const uniqueImageName = `${Date.now()}-${imageName}`;
        const imagePath = path.join(uploadDir, uniqueImageName);
        const imageUrl = `/uploads/${uniqueImageName}`;

        // Tạo thư mục uploads nếu chưa tồn tại
        await fs.mkdir(uploadDir, { recursive: true });

        // Ghi Buffer vào file
        await fs.writeFile(imagePath, imageBuffer);

        return { success: true, path: imagePath, url: imageUrl };

    } catch (error) {
        console.error('Lỗi khi chuyển đổi Base64 thành ảnh:', error);
        return { success: false, error: error.message };
    }
}

module.exports = base64ToImage;