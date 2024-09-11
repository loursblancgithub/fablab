const fs = require('fs');
const path = require('path');

/**
 * Create a directory for the order if it doesn't exist
 * @param {string} orderId - The ID of the order
 */
function createOrderDirectory(orderId) {
    const storageDir = path.join(__dirname, 'storage');
    if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
    }

    const orderDir = path.join(storageDir, 'orders', orderId.toString());
    if (!fs.existsSync(orderDir)) {
        fs.mkdirSync(orderDir, { recursive: true });
    }
}

/**
 * Save a file to the order's directory
 * @param {string} orderId - The ID of the order
 * @param {string} fileName - The name of the file
 * @param {Buffer} fileContent - The content of the file
 */
function saveFileToOrder(orderId, fileName, fileContent) {
    createOrderDirectory(orderId);
    const filePath = path.join(__dirname, 'storage', 'orders', orderId.toString(), fileName);
    fs.writeFileSync(filePath, fileContent);
}

/**
 * List all files in the order's directory
 * @param {string} orderId - The ID of the order
 * @returns {string[]} - Array of file names
 */
function listFilesInOrderDirectory(orderId) {
    const orderDir = path.join(__dirname, 'storage', 'orders', orderId);
    if (fs.existsSync(orderDir)) {
        return fs.readdirSync(orderDir);
    }
    return [];
}

module.exports = {
    createOrderDirectory,
    saveFileToOrder,
    listFilesInOrderDirectory
};