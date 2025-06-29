const crypto = require("crypto");
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(process.env.SECRET_KEY)).digest('base64').substr(0, 32);
const IV = crypto.randomBytes(16);

exports.encryptField = (text) => {
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), IV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return IV.toString("hex") + ":" + encrypted.toString("hex");
};

exports.decryptField = (text) => {
    const [ivHex, encryptedText] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedText, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};