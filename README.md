<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
npm install --save @nestjs/typeorm typeorm mysql2
npm i --save class-validator class-transformer
npm i bcrypt
npm install @types/bcrypt bcrypt
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
npm i --save @nestjs/config
npm i cookie-parser
npm i -D @types/cookie-parser
npm i @nestjs/passport passport passport-google-oauth20
npm i -D @types/passport-google-oauth20
npm i -D @types/multer
npm i nanoid@3.3.7
npm i --save @nestjs-modules/mailer nodemailer
npm i --save-dev @types/nodemailer


CTRL ALT L format code
https://myaccount.google.com/apppasswords?rapt=AEjHL4P05G3oJjkjJRzDPUHXRt9F71PaYIuCkWWv87gjKcNqYl5tYHVRqHHmFvUJTnj8A6cOFiWxFe7BKeOla6yNJ3_AuBPucbXyfgSjyHNLTHpk0i1BdfE
password-Google:HwdO6ncdh4

Mệnh đề ON DELETE CASCADE có nghĩa là nếu một khách hàng bị xóa khỏi bảng Khách hàng, tất cả các hàng trong bảng Đơn hàng có chứa cùng một giá trị mã định danh khách hàng cũng sẽ bị xóa.

// quên password trước tiên kiểm tra xem email đó có tồn tại trong cơ sở dữ liệu ko.
public async forgotPassword(email: string): Promise<any> {
//Check that user exits
const user: User = await this.userService.getByEmail(email);
if (user) {
// If user exists,generate password reset link
const expiryDate: Date = new Date();
expiryDate.setMinutes(expiryDate.getMinutes() + 30);
// const currentTime: Date = new Date();
// const timeDiff: number = expiryDate.getTime() - currentTime.getTime();
// const remainingMinutes: number = Math.floor(timeDiff / (1000 * 60));
const resetToken: string = nanoid(64);
await this.userService.updateResetTokenUser(user.userId, resetToken,expiryDate);
} else {
return { msg: "Nếu người dùng tồn tại bạn xẽ nhận được Email" };

    }
}





// try {
//   const resetLink: string = `${this.configService.get<string>("APP_URL")}?token=${token}`;
//   const mailOptions = {
//     from: this.configService.get<string>("EMAIL_USERNAME"),
//     to: email,
//     subject: "Password Reset Request",
//     html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`
//   };
//   await this.transporter.sendMail(mailOptions);
//   console.log("Email đã được gửi thành công"); // Debugging line
// } catch (error) {
//   console.log(error, "Error in sending email");
// }