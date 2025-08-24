export const generateConfirmationEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Confirmation Received</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding-bottom: 20px; }
        .footer { font-size: 12px; text-align: center; color: #888; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Submission Received</h2>
        </div>
        <p>Dear ${name},</p>
        <p>Thank you for your photo submission! We’re currently experiencing a high volume of custom photo requests.</p>
        <p>Our team is reviewing each submission with care, so please allow a little extra time for a response. We appreciate your patience and your interest in Thousand Shades!</p>
        <p>We'll notify you as soon as your submission has been reviewed.</p>
        <div class="footer">
          &copy; 2025 Thousand Shades. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
