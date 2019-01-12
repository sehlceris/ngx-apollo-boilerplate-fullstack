import { Injectable } from '@nestjs/common';
import * as Email from 'email-templates';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { UserVm } from '../../user/models/view-models/user-vm.model';
import { Configuration } from '../configuration/configuration.enum';
import { ConfigurationService } from '../configuration/configuration.service';
import { ClientPaths } from '../constants/client-paths';
import { BoundLogger, LogService } from '../utilities/log.service';
import { UserService } from '../../user/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum EmailTemplatePath {
  VerifyEmail = 'verify-email',
  PasswordReset = 'password-reset',
}

const EMAIL_ROOT = path.join(__dirname);
const TEMPLATE_ROOT = path.join(EMAIL_ROOT, 'templates');
const TOKEN_NAME = 'token';

@Injectable()
export class EmailService {
  private cachedTransport = this.getTransport();
  private log: BoundLogger = this.logService.bindToNamespace(EmailService.name);
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly configurationService: ConfigurationService,
    private readonly logService: LogService,
  ) {
  }

  public startReactingToEvents() {
    this.unsubscribe$.next(); // prevent double email effects if this method is accidentally called twice

    this.userService.newUserRegistered$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.handleNewUserRegistered.bind(this));

    this.userService.resendVerificationEmailRequested$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.handleResendVerificationEmailRequested.bind(this));

    this.userService.passwordResetRequested$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.handlePasswordResetRequested$.bind(this));
  }

  async sendVerifyEmailAddressEmail(user: UserVm, token: string): Promise<void> {
    const email = this.getBaseEmail();
    const destinationAddress = user.email;
    const templatePath = path.join(TEMPLATE_ROOT, EmailTemplatePath.VerifyEmail);
    const url = new URL(ClientPaths.VerifyEmail, this.configurationService.clientBaseUrl);
    url.searchParams.append(TOKEN_NAME, token);
    const locals = {
      username: user.username,
      email: user.email,
      url: url.toString(),
    };
    const sendPromise = this.sendEmail(email, templatePath, destinationAddress, locals);

    sendPromise
      .then(() => {
        this.log.info(`Sent email address verification email to ${destinationAddress}`);
        this.log.debug(`token: ${token}`);
      })
      .catch((err) => {
        this.log.error(`Failed to send email address verification email to ${destinationAddress}: ${err}`);
      });

    return sendPromise;
  }

  async sendPasswordResetEmail(user: UserVm, token: string): Promise<void> {
    const email = this.getBaseEmail();
    const destinationAddress = user.email;
    const templatePath = path.join(TEMPLATE_ROOT, EmailTemplatePath.PasswordReset);
    const url = new URL(ClientPaths.ResetPassword, this.configurationService.clientBaseUrl);
    url.searchParams.append(TOKEN_NAME, token);
    const locals = {
      username: user.username,
      email: user.email,
      url: url.toString(),
    };
    const sendPromise = this.sendEmail(email, templatePath, destinationAddress, locals);

    sendPromise
      .then(() => {
        this.log.info(`Sent password recovery email to ${destinationAddress}`);
      })
      .catch((err) => {
        this.log.error(`Failed to send password recovery email to ${destinationAddress}: ${err}`);
      });

    return sendPromise;
  }

  private async handleNewUserRegistered(user: UserVm) {
    const token = await this.userService.createJwtVerifyEmailPayload(user);
    await this.sendVerifyEmailAddressEmail(user, token);
  }

  private async handleResendVerificationEmailRequested(user: UserVm) {
    const token = await this.userService.createJwtVerifyEmailPayload(user);
    await this.sendVerifyEmailAddressEmail(user, token);
  }

  private async handlePasswordResetRequested$(user: UserVm) {
    const token = await this.userService.createJwtResetPasswordPayload(user);
    await this.sendPasswordResetEmail(user, token);
  }

  private async sendEmail(email: Email, templatePath: string, destinationAddress: string, locals: any): Promise<void> {

    const sendPromise = email.send({
      template: templatePath,
      message: { to: destinationAddress },
      locals,
    });
    return sendPromise;
  }

  private getBaseEmail(): Email {
    const email = new Email({
      message: {
        from: this.configurationService.get(Configuration.EMAIL_FROM_ADDRESS),
      },
      transport: this.getTransport(),
      juiceResources: {
        webResources: {
          relativeTo: EMAIL_ROOT,
        },
      },
      views: {
        options: {
          extension: 'handlebars',
        },
      },
      // send: true, // uncomment to send emails in dev
    });
    return email;
  }

  private getTransport() {
    if (this.cachedTransport) {
      return this.cachedTransport;
    }
    const transport = new SMTPTransport(this.getSmtpConfig());
    const transporter = nodemailer.createTransport(transport);
    return transporter;
  }

  private getSmtpConfig() {
    const poolConfig = {
      pool: true,
      secure: false, // use TLS
      host: this.configurationService.get(Configuration.EMAIL_SMTP_HOST),
      port: parseInt(this.configurationService.get(Configuration.EMAIL_SMTP_PORT), 10),
      auth: {
        user: this.configurationService.get(Configuration.EMAIL_SMTP_USERNAME),
        pass: this.configurationService.get(Configuration.EMAIL_SMTP_PASSWORD),
      },
    };
    return poolConfig;
  }
}
