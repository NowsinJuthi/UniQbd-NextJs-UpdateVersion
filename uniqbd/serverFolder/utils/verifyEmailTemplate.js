const VerificationEmail = (username, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>

      <style>
          body{
              margin:0;
              padding:0;
              background:#f4f6f8;
              font-family: Arial, Helvetica, sans-serif;
          }

          .container{
              max-width:600px;
              margin:40px auto;
              background:white;
              border-radius:12px;
              overflow:hidden;
              box-shadow:0 5px 20px rgba(0,0,0,0.08);
          }

          .header{
              background: linear-gradient(135deg,#6366f1,#9333ea);
              color:white;
              padding:30px;
              text-align:center;
          }

          .header h1{
              margin:0;
              font-size:24px;
              letter-spacing:1px;
          }

          .content{
              padding:30px;
              text-align:center;
              color:#333;
          }

          .content h2{
              margin-bottom:10px;
              font-size:22px;
          }

          .otp-box{
              margin:25px 0;
              padding:18px;
              background:#f1f5ff;
              border:2px dashed #6366f1;
              border-radius:10px;
              font-size:28px;
              font-weight:bold;
              letter-spacing:6px;
              color:#4338ca;
          }

          .info{
              font-size:14px;
              color:#666;
              margin-top:15px;
          }

          .footer{
              text-align:center;
              padding:20px;
              font-size:13px;
              background:#fafafa;
              color:#777;
          }

          .button{
              display:inline-block;
              margin-top:20px;
              padding:12px 25px;
              background:#6366f1;
              color:white;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
          }

          @media(max-width:600px){
              .content{
                  padding:20px;
              }
          }
      </style>
  </head>

  <body>

      <div class="container">

          <div class="header">
              <h1>Verify Your Email</h1>
          </div>

          <div class="content">

              <h2>Hello ${username} 👋</h2>

              <p>Thank you for registering. Please use the OTP below to verify your email address.</p>

              <div class="otp-box">
                  ${otp}
              </div>

              <p class="info">
                  This OTP will expire in <strong>5 minutes</strong>.
              </p>

              <p class="info">
                  If you did not request this email, please ignore it.
              </p>

          </div>

          <div class="footer">
              © ${new Date().getFullYear()} UniQbd. All rights reserved.
          </div>

      </div>

  </body>
  </html>
  `;
}

export default VerificationEmail;