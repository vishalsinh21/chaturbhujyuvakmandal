export const generateOtpEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en" style="margin:0; padding:0; box-sizing:border-box;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { text-align: center; padding-bottom: 20px; }
        .otp { font-size: 32px; font-weight: bold; background-color: #f0f0f0; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px; margin: 20px 0; }
        .footer { font-size: 12px; text-align: center; color: #888; margin-top: 20px; }
        @media(max-width: 600px) { .container { margin: 20px 10px; padding: 15px; } .otp { font-size: 26px; padding: 10px 20px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Verify Your Email</h2>
        </div>
        <p>Hello,</p>
        <p>Use the following One-Time Password (OTP) to complete your verification:</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for a limited time. Do not share it with anyone.</p>
        <div class="footer">
          &copy; 2025 Thousand Shades. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};