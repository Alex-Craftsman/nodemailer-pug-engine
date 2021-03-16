import { createTransport } from 'nodemailer';
import * as fileTransport from 'nodemailer-file-transport';
import { resolve } from 'path';
import { pugEngine } from '../lib';

export const mailer = createTransport(
    fileTransport({
        dir: __dirname,
        ext: 'html',
        useSubject: true
    })
);

mailer.use(
    'compile',
    pugEngine({
        templateDir: resolve(__dirname, 'templates'),
        pretty: true
    })
);

mailer.sendMail(<any>{
    to: 'someone@foo.com',
    template: 'test',
    ctx: {
        name: 'Bar'
    }
});
