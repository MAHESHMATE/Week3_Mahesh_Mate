import nodemailer from "nodemailer";

// function to send an email with weather data
async function sendEmail(recipient: string, weatherData: any[]) {
  // creates object using SMTP transport with Gmail service
  const send = nodemailer.createTransport({
    service: "Gmail", // used gmail as the email service
    auth: {
      user: "maheshmate2627@gmail.com", // entered email address
      pass: "nwhqslfqvqmqcngi", // entered app password
    },
  });

  // HTML code for creating weather data table
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
        ${weatherData
          .map(
            (weather) => `
          <tr>
            <td>${weather.id}</td>
            <td>${weather.city}</td>
            <td>${weather.country}</td>
            <td>${new Date(weather.time).toLocaleString()}</td>
            <td>${weather.weather}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  // add mail details including recipient, subject, and HTML content
  const mailDetails = {
    from: "maheshmate2627@gmail.com", // sender email address
    to: recipient, // reciever email address
    subject: "Weather Data", // Email subject
    html: htmlTable, // HTML weather data table
  };

  // send the email
  await send.sendMail(mailDetails);
}

// export the sendEmail function
export { sendEmail };
