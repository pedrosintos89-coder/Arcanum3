// Get DOM elements
const buildingImageUpload = document.getElementById('buildingImageUpload');
const fileNameSpan = document.getElementById('fileName');
const originalImagePreview = document.getElementById('originalImagePreview');
const noImageText = document.getElementById('noImageText');
const architecturalStyleSelect = document.getElementById('architecturalStyle');
const viewAngleSelect = document.getElementById('viewAngle');
const transformButton = document.getElementById('transformButton');
const statusMessage = document.getElementById('statusMessage');
const originalOutput = document.getElementById('originalOutput');
const transformedCanvas = document.getElementById('transformedCanvas');
const noTransformedText = document.getElementById('noTransformedText');

let currentImageBase64 = null; // Stores the base64 of the uploaded image

// Event listener for image upload
buildingImageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        fileNameSpan.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageBase64 = e.target.result;
            originalImagePreview.src = currentImageBase64;
            originalImagePreview.style.display = 'block';
            noImageText.style.display = 'none';
            
            originalOutput.src = currentImageBase64;
            originalOutput.style.display = 'block';

            transformedCanvas.style.display = 'none';
            noTransformedText.style.display = 'block';
            // Clear canvas context
            const ctx = transformedCanvas.getContext('2d');
            ctx.clearRect(0, 0, transformedCanvas.width, transformedCanvas.height);

            transformButton.disabled = false; // Enable button once image is loaded
            statusMessage.textContent = 'تم تحميل الصورة بنجاح. اختر الإعدادات وانقر تحويل.';
            statusMessage.className = 'status-message success';
        };
        reader.readAsDataURL(file);
    } else {
        fileNameSpan.textContent = 'لم يتم اختيار ملف';
        originalImagePreview.style.display = 'none';
        noImageText.style.display = 'block';
        originalOutput.style.display = 'none';
        currentImageBase64 = null;
        transformButton.disabled = true;
        statusMessage.textContent = 'الرجاء تحميل صورة للمبنى أولاً.';
        statusMessage.className = 'status-message';
    }
});

// Event listener for transform button
transformButton.addEventListener('click', async function() {
    if (!currentImageBase64) {
        statusMessage.textContent = 'الرجاء تحميل صورة للمبنى أولاً.';
        statusMessage.className = 'status-message';
        return;
    }

    statusMessage.textContent = 'جاري التحويل بالذكاء الاصطناعي... قد يستغرق بعض الوقت.';
    statusMessage.className = 'status-message';
    transformButton.disabled = true;

    const selectedStyle = architecturalStyleSelect.value;
    const selectedAngle = viewAngleSelect.value;

    await simulateAITransformation(currentImageBase64, selectedStyle, selectedAngle);

    transformButton.disabled = false;
    statusMessage.textContent = 'تم التحويل بنجاح! شاهد المبنى بطرازه الجديد.';
    statusMessage.className = 'status-message success';
});

// --- AI Simulation Logic (Frontend Only) ---
async function simulateAITransformation(base64Image, style, angle) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
            // Set initial canvas size based on image
            let originalWidth = img.width;
            let originalHeight = img.height;
            let finalWidth = originalWidth;
            let finalHeight = originalHeight;

            // --- Step 1: Simulate Symmetry Inference and Image Completion (Core Requirement) ---
            // Simulation logic: If the image width is below a threshold (conceptual 'partial'), 
            // we assume the left half is the missing right half (or vice versa) and mirror it.
            // We use 400px as a conceptual threshold for a 'partial' building facade.
            
            const symmetryThreshold = 400; 

            if (originalWidth < symmetryThreshold) {
                // Determine the half-width to mirror
                const halfWidth = Math.floor(originalWidth); // Use original width as the visible half
                finalWidth = halfWidth * 2;
                transformedCanvas.width = finalWidth;
                transformedCanvas.height = originalHeight;
                
                const ctx = transformedCanvas.getContext('2d');
                ctx.clearRect(0, 0, finalWidth, finalHeight);

                // 1. Draw the original image on the left (the visible half)
                ctx.drawImage(img, 0, 0, halfWidth, originalHeight);

                // 2. Mirror the original content to the right side (creating the symmetrical half)
                // We draw the original image flipped horizontally
                ctx.save();
                ctx.translate(finalWidth, 0); // Move origin to the far right edge of the new canvas
                ctx.scale(-1, 1); // Flip horizontally (mirroring the entire original image)
                ctx.drawImage(img, 0, 0, originalWidth, originalHeight);
                ctx.restore();
                
                // Set the current image reference to the completed (mirrored) version for later steps
                // We use the entire final canvas content as the new "image"
            } else {
                 // Image is assumed to be complete, draw it as is
                finalWidth = originalWidth;
                finalHeight = originalHeight;
                transformedCanvas.width = finalWidth;
                transformedCanvas.height = finalHeight;
                const ctx = transformedCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
            }
            
            // Re-get context after potential canvas resize
            const ctx = transformedCanvas.getContext('2d');
            originalWidth = transformedCanvas.width;
            originalHeight = transformedCanvas.height;


            // --- Step 2: Simulate Architectural Style Transformation (Simplified) ---
            
            // 1. Apply a subtle color filter/saturation for a 'richer' texture (classical feel)
            ctx.filter = 'saturate(1.2) contrast(1.1)'; 
            ctx.drawImage(transformedCanvas, 0, 0); 
            ctx.filter = 'none'; // Reset filter

            // 2. Placeholder for decorative classical elements (based on style)
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; 
            
            if (style === 'neoclassical' || style === 'baroque') {
                // Simulate column placement and a central pediment structure
                const numColumns = 6;
                const columnSpacing = originalWidth / (numColumns + 1);
                
                // Draw vertical lines resembling columns
                for (let i = 1; i <= numColumns; i++) {
                    ctx.beginPath();
                    ctx.moveTo(columnSpacing * i, originalHeight * 0.1);
                    ctx.lineTo(columnSpacing * i, originalHeight);
                    ctx.stroke();
                }

                // Draw a simple triangular pediment at the top center
                ctx.beginPath();
                ctx.moveTo(originalWidth * 0.4, originalHeight * 0.1);
                ctx.lineTo(originalWidth * 0.6, originalHeight * 0.1);
                ctx.lineTo(originalWidth / 2, originalHeight * 0.05);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }

            // --- Step 3: Simulate View Angle Change (Simplified) ---
            // We apply a basic perspective skew/translation transformation.
            
            ctx.save();
            let skewValue = 0;
            let translateX = 0;

            if (angle === 'slight-left') {
                skewValue = -0.1;
                translateX = originalWidth * 0.1; // Shift to the right
            } else if (angle === 'slight-right') {
                skewValue = 0.1;
                translateX = -originalWidth * 0.1; // Shift to the left
            } else if (angle === 'top-down') {
                // Simulate a slight vertical distortion/skew
                ctx.transform(1, 0.2, 0, 1, 0, 0); 
            }
            
            // Apply horizontal skew/translation if applicable
            if (skewValue !== 0) {
                // Apply a simple affine transformation: [1, 0, skewValue, 1, translateX, 0]
                ctx.transform(1, 0, skewValue, 1, translateX, 0);
            }
            
            // Redraw the current canvas content onto the transformed context
            // Note: This step is complex as it requires redrawing all previous steps within the transform, 
            // but drawing the current canvas content provides a visual result.
            const transformedImage = new Image();
            transformedImage.onload = () => {
                ctx.clearRect(0, 0, transformedCanvas.width, transformedCanvas.height);
                ctx.drawImage(transformedImage, 0, 0, transformedCanvas.width, transformedCanvas.height);
                ctx.restore(); // Restore context to prevent accumulated transformations

                transformedCanvas.style.display = 'block';
                noTransformedText.style.display = 'none';
                resolve();
            };
            transformedImage.src = transformedCanvas.toDataURL(); // Use current canvas state
        };
        img.src = base64Image;
    });
}

// Initial state
transformButton.disabled = true;
statusMessage.textContent = 'الرجاء تحميل صورة للمبنى للبدء.';
statusMessage.className = 'status-message';
