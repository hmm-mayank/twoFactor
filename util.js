const axios = require("axios");
const fs = require("fs");
function SendMessage(code, phone, message) {
  const messageUri = `http://my.usacricket.org:7200?code=${code}&phone=${phone}&message=${message}`;
  return axios
    .default({
      method: "get",
      baseURL: messageUri,
    })
    .then((result) => {
      return result.data;
    });
}

const emailUrl = `http://65.1.80.0:7860/email?from=usa`;
function SendEmail(id, content, subject) {
  return axios.default({
    method: "POST",
    baseURL: emailUrl,
    headers: {},
    data: {
      id: id,
      content: content,
      subject: subject.toString(),
    },
  });
}

function emailTemplate(code) {
  return `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
  <div style='margin:50px auto;width:70%;padding:20px 0'>
    <div style='border-bottom:1px solid #eee'>
      <a href='' style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>USA CRICKET</a>
    </div>
    <p style='font-size:1.1em'>Hello User,</p>
    <p>Two factor Validation code is</p>
    <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${code}</h2>
    <p style='font-size:0.9em;'>Regards,<br /></p>
    <hr style='border:none;border-top:1px solid #eee' />
    <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'>
      <p>USA Cricket</p>
     
    </div>
  </div>
</div>`;
}
module.exports = { SendMessage, SendEmail, emailTemplate };
