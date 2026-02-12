const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const data = [
    {
        SKU: 'PRD-001',
        Name_EN: 'Silk Evening Gown',
        Name_AR: 'فستان سهرة حريري',
        Description_EN: 'High quality silk gown...',
        Description_AR: 'فستان حريري عالي الجودة...',
        Price: 150.00,
        Min_Order: 5,
        Category_Slug: 'evening-wear',
        Image_URL: 'https://example.com/image1.jpg',
        Variants: 'Color:Red|Hex:#FF0000|Sizes:S,M,L,XL|Image:https://example.com/red.jpg;Color:Blue|Hex:#0000FF|Sizes:M,L|Image:https://example.com/blue.jpg'
    },
    {
        SKU: 'AB-202',
        Name_EN: 'Modern Abaya',
        Name_AR: 'عباية عصرية',
        Description_EN: 'Breathable fabric...',
        Description_AR: 'قماش يسمح بمرور الهواء...',
        Price: 85.00,
        Min_Order: 10,
        Category_Slug: 'modest-fashion',
        Image_URL: 'https://example.com/image2.jpg',
        Variants: 'Color:Black|Hex:#000000|Sizes:Free Size|Image:https://example.com/black.jpg'
    }
];

const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Products");

const publicPath = path.join(__dirname, 'public');
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
}

const filePath = path.join(publicPath, 'template.xlsx');
XLSX.writeFile(wb, filePath);

console.log('Template created at:', filePath);
