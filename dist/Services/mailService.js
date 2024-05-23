"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWeatherEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Function to send an email with weather data
function sendWeatherEmail(recipient, weatherData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a transporter object using the default SMTP transport with Gmail service
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail', // Using Gmail as the email service
            auth: {
                user: 'maheshmate2627@gmail.com', // Your Gmail email address
                pass: 'nwhqslfqvqmqcngi', // Your Gmail app password (or OAuth2 token)
            },
        });
        // Format the weather data into an HTML table
        const htmlTable = `
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>City</th>
          <th>Country</th>
          <th>Date</th>
          <th>Weather</th>
        </tr>
      </thead>
      <tbody>
        ${weatherData.map(weather => `
          <tr>
            <td>${weather.id}</td>
            <td>${weather.city}</td>
            <td>${weather.country}</td>
            <td>${new Date(weather.time).toLocaleString()}</td>
            <td>${weather.weather}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `; // Create an HTML table with the weather data
        // Define the email options including recipient, subject, and HTML content
        const mailOptions = {
            from: 'maheshmate2627@gmail.com', // Sender email address
            to: recipient, // Recipient email address
            subject: 'Weather Dashboard Data', // Email subject
            html: htmlTable, // HTML content (the weather data table)
        };
        // Send the email using the transporter
        yield transporter.sendMail(mailOptions);
    });
}
exports.sendWeatherEmail = sendWeatherEmail;
//# sourceMappingURL=mailService.js.map