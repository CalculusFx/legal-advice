import nodemailer from 'nodemailer';

export async function handler(event, context) {
  // ตรวจสอบว่าเป็น POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { firstName, lastName, email, phone, topic, message } = data;

    // ตรวจสอบว่ามีการตั้งค่า SMTP หรือไม่ (สำหรับ development)
    const isProduction = process.env.SMTP_USER && process.env.SMTP_PASS;
    
    if (!isProduction) {
      // โหมด Development - จำลองการส่งอีเมลสำเร็จ
      console.log('Development Mode: Email would be sent with the following data:');
      console.log({ firstName, lastName, email, phone, topic, message });
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'ส่งข้อความเรียบร้อยแล้ว (Development Mode)',
          data: { firstName, lastName, email, phone, topic }
        })
      };
    }

    // ตั้งค่า SMTP transporter (ใช้ Gmail หรือ SMTP server ของคุณ)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // อีเมลที่ใช้ส่ง
        pass: process.env.SMTP_PASS  // รหัสผ่านหรือ App Password
      }
    });

    // กำหนดเนื้อหาอีเมล
    const mailOptions = {
      from: `"Legal Nest Thai Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL || 'info@legalconsult.co.th',
      replyTo: email,
      subject: `ติดต่อจากเว็บไซต์ - ${topic || 'ไม่ระบุหัวข้อ'}`,
      html: `
        <div style="font-family: 'Sarabun', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #8B6F47; border-bottom: 3px solid #C9A961; padding-bottom: 10px;">
              📧 ข้อความติดต่อจากเว็บไซต์
            </h2>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #FFF8E7; border-left: 4px solid #C9A961;">
              <h3 style="margin-top: 0; color: #8B6F47;">ข้อมูลผู้ติดต่อ</h3>
              <p><strong>ชื่อ-นามสกุล:</strong> ${firstName} ${lastName}</p>
              <p><strong>อีเมล:</strong> <a href="mailto:${email}" style="color: #8B6F47;">${email}</a></p>
              <p><strong>เบอร์โทรศัพท์:</strong> ${phone}</p>
              <p><strong>หัวข้อ:</strong> ${topic || '-'}</p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
              <h3 style="color: #8B6F47;">ข้อความ:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
              <p>ส่งจากฟอร์มติดต่อเรา Legal Nest Thai</p>
              <p>เวลาที่ส่ง: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}</p>
            </div>
          </div>
        </div>
      `,
      text: `
ข้อมูลผู้ติดต่อ
------------------
ชื่อ-นามสกุล: ${firstName} ${lastName}
อีเมล: ${email}
เบอร์โทรศัพท์: ${phone}
หัวข้อ: ${topic || '-'}

ข้อความ:
${message}

---
ส่งจากฟอร์มติดต่อเรา Legal Nest Thai
เวลาที่ส่ง: ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
      `
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'ส่งข้อความเรียบร้อยแล้ว' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการส่งอีเมล',
        error: error.message 
      })
    };
  }
}
