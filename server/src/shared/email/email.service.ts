import {Injectable} from '@nestjs/common';
import {User} from '../../user/models/user.model';
import * as Email from 'email-templates';
import * as path from 'path';
import {BoundLogger, LogService} from '../utilities/log.service';
import {ConfigurationService} from '../configuration/configuration.service';
import {Configuration} from '../configuration/configuration.enum';
import {ClientPaths} from '../constants/client-paths';

enum EmailTemplatePath {
  VerifyEmail = 'verify-email',
  PasswordReset = 'password-reset',
}

const EMAIL_ROOT = path.join(__dirname);
const TEMPLATE_ROOT = path.join(EMAIL_ROOT, 'templates');
const TOKEN_NAME = 'token';

@Injectable()
export class EmailService {

  private log: BoundLogger = this.logService.bindToNamespace(EmailService.name);

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly logService: LogService,
  ) {

  }

  async sendVerifyEmailAddressEmail(user: User, token: string): Promise<void> {
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
    const sendPromise = this.sendEmail(
      email,
      templatePath,
      destinationAddress,
      locals
    );

    sendPromise
      .then(() => {
        this.log.info(`Sent email address verification email to ${destinationAddress}`);
      })
      .catch((err) => {
        this.log.error(`Failed to send email address verification email to ${destinationAddress}: ${err}`);
      });

    return sendPromise;
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
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
    const sendPromise = this.sendEmail(
      email,
      templatePath,
      destinationAddress,
      locals
    );

    sendPromise
      .then(() => {
        this.log.info(`Sent password recovery email to ${destinationAddress}`);
      })
      .catch((err) => {
        this.log.error(`Failed to send password recovery email to ${destinationAddress}: ${err}`);
      });

    return sendPromise;
  }

  private async sendEmail(
    email: Email,
    templatePath: string,
    destinationAddress: string,
    locals: any
  ): Promise<void> {
    const sendPromise = email
      .send({
        template: templatePath,
        message: { to: destinationAddress },
        locals
      });
    return sendPromise;
  }

  private getBaseEmail(): Email {
    const email = new Email({
      message: {
        from: this.configurationService.get(Configuration.EMAIL_FROM_ADDRESS)
      },
      transport: {
        jsonTransport: true
      },
      juiceResources: {
        webResources: {
          relativeTo: EMAIL_ROOT
        }
      },
      views: {
        options: {
          extension: 'handlebars'
        }
      }
      // send: true, // uncomment to send emails in dev
    });
    return email;
  }
}
