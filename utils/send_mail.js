var nodemailer = require("nodemailer");
const fs = require("fs");
{
  /* <img src="" alt="Logo Image" style="max-width: 50%;"> */
}
const sendOtpCode = async (data) => {
  console.log("data is email", data);
  var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, //smtp.gmail.com
    port: process.env.MAIL_PORT, //587
    // secure: false, // Use SSL
    auth: {
      user: process.env.MAIL_FROM_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  var sendOtp = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: data.emailAddress,
    subject: "Map My Dynasty",
    html: `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>OTP Email Template</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0;font-family: 'Poppins', sans-serif;">
      <div style="background: #000; border-radius: 20px; text-align: center; box-shadow: 0 6px 18px 0 rgba(0,0,0,.06);background-position: center; background-size: cover; max-width: 415px; margin: 0 auto; padding: 40px;">
          
          
          
        <div style="text-align: start; font-family: 'Urbanist', sans-serif;">
          <h1 style="color: #D7D7D7; font-weight: 500; margin: 0; font-size: 17px;">Dear 
            <span style="font-weight: 600">${data.name}</span>,
          </h1>
          <p style="font-size: 16px; line-height: 20px; color: #D7D7D7;">It seems you've requested to reset your password for Map My Dynasty. We're here to help you regain access to your account.</p>
          <p style="font-size: 16px; line-height: 20px; color: #D7D7D7;">To complete the password reset process, please use the verification code below:</p>
          
          <h2 style="margin-bottom: 40px;margin-top: 20px; font-size: 20px;font-weight: 500;line-height: 31px;color: #ffffff82; text-transform: uppercase; text-align:center;font-weight: 600; font-size: 20px; line-height: 34px; color: #ffffff82; border-radius: 5px; background-color: #f5a7bc33; padding: 15px; text-align: center;">Verification Code<br><span style="line-height: 50px;font-weight: 700;font-size: 54px;color: #EE5E86;">${data.otp}</span></h2>
          <p style="font-size: 16px; line-height: 20px; color: #D7D7D7;">
            Please enter this code on the password reset page within the next 24 hours to proceed with resetting your password. If you didn't initiate this request, please ignore this email or reach out to our support team immediately at <a href="#" style="text-decoration: none; font-weight:600; color:#fb7c9f;">${process.env.MAIL_FROM_ADDRESS}</a>
          </p>
          <p style="font-size: 16px; line-height: 20px; color: #D7D7D7;">
            Remember to create a strong, unique password that you haven't used before to secure your account.
          </p>
          <p style="font-size: 16px; line-height: 20px; color: #D7D7D7;">
            Thank you for using Map My Dynasty. If you have any questions or need further assistance, don't hesitate to contact us.
          </p>
          <h1 style="color: #D7D7D7; font-weight: 500; margin: 0; font-size: 17px; line-height: 25px;">Best regards, <br>
            <span style="font-weight: 600">Map My Dynasty team</span>
          </h1>
        </div>
    
      </div>
    
    </body>
    </html>`,
  };

  return await transporter.sendMail(sendOtp);
};

module.exports = { sendOtpCode };

/*     
`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">s
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0;font-family: 'Poppins', sans-serif;">
  <div style="background: linear-gradient(180deg, #b9f0ff8c 0%, #ffeac6c2 100%); max-width: 415px; margin: 0 auto; padding: 40px;background-size: cover; background-position: center;border: 4px solid rgba(255, 255, 255, 0.40); box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12); border-radius: 20px;">
    <div style="text-align: center;">
      <img src= alt="Logo Image" style="max-width: 100%;">
    </div>
    <p style="font-weight: 600;font-size: 20px;line-height: 30px;color: #000000; margin: 0 0 10px 0;">Hello ${data.name},</p>
    <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #676767;margin: 0 0 0 0;">We’ve received a request to reset your Password. If you didn’t make the request, just ignore email.</p>
    <h2 style="font-weight: 600; font-size: 20px; line-height: 34px; color: #000000; border-radius: 5px; background: linear-gradient(90deg, #5CCBEA -4.34%, #EFD296 103.9%); padding: 15px; text-align: center;">Your Verification code is<br><span style="display:block;margin-top: 20px;font-weight: 700;font-size: 54px;color: #000000;">${data.otp}</span></h2>
    <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #676767;margin: 0 0 0 0;">Please do not share your code with anyone else.</p>
    <p style="font-weight: 400;font-size: 15px;line-height: 22px;color: #676767; margin: 15px 0 0; ">If you have any questions or trouble logging on please contact <a href="mailto:info@ad-anima.com" style="font-weight:600;color: #000000;">${process.env.MAIL_FROM_ADDRESS}</a></p>
    <div style="margin-top: 30px;font-weight: 500;font-size: 15px;color: #000000;">
      Thank You,<br> Map My Dynasty Team
    </div>
  </div>
</body>
</html>` */
