export const attendanceEmailTemplate = (name: string, message: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f6f6f6;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; background: #ffffff;">
        <tr>
          <td align="center" style="padding: 0;">
            <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; border-spacing: 0; text-align: left;">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 30px 30px 30px; background: #70bbd9;">
                  <h1 style="font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif; color: #ffffff;">
                    Attendance Message
                  </h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 36px 30px 42px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0;">
                    <tr>
                      <td style="padding: 0 0 36px 0; color: #153643; font-family: Arial, sans-serif;">
                        <h2 style="font-size: 20px; margin: 0 0 20px 0;">Hello ${name},</h2>
                        <div class="message-container" style="
                          background-color: #f8f9fa;
                          border-radius: 8px;
                          padding: 20px;
                          margin: 15px 0;
                          border-left: 4px solid #70bbd9;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1)
                        ">
                          <p style="margin: 0; font-size: 16px; line-height: 24px;">
                            ${message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background: #ee4c50;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; font-size: 9px;">
                    <tr>
                      <td style="padding: 0; width: 50%;" align="left">
                        <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">
                          &copy; 2024 ATTENDANCE MANAGEMENT SYSTEM<br/>
                        </p>
                      </td>
                      <td style="padding: 0; width: 50%;" align="right">
                     
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;
