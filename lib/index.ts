import { resolve } from 'path';
import * as fs from 'fs';
import * as pug from 'pug';

export interface IPugEngineConfig {
    templateDir: string;
    pretty?: boolean;
}

export function pugEngine(conf: IPugEngineConfig) {
    return (maildata: any, cb: (err?) => void) => {
        const template = maildata.data.template;
        const ctx = maildata.data.ctx;      

        const templateFile = resolve(conf.templateDir, template) + '.pug';
        const templateFolder = resolve(conf.templateDir, template);
        const subjectTemplate = resolve(templateFolder, 'subject.pug');
        const textTemplate = resolve(templateFolder, 'text.pug');
        const htmlTemplate = resolve(templateFolder, 'html.pug');

        const isExistsTemplate = fs.existsSync(templateFile);
        const isExistsTemplateFolder = fs.existsSync(templateFolder);
        const isExistsSubject = fs.existsSync(subjectTemplate);
        const isExistsText = fs.existsSync(textTemplate);
        const isExistsHtml = fs.existsSync(htmlTemplate);

        // do nothing when no template is defined
        if (!template || (!isExistsTemplate && !isExistsTemplateFolder)) {
            return cb();
        }

        // set options to pug
        if (conf.pretty === true) {
            ctx.pretty = true;
        }

        // render templates
        if(isExistsTemplate) {
            pug.renderFile(templateFile, ctx, (err, html: string) => {
                if (err) {
                    cb(err);
                    return;
                }
                maildata.data.html = html;
                cb();
            });            
        } else if (isExistsTemplateFolder && isExistsSubject && isExistsText && isExistsHtml) {
            const subjectTemplate = resolve(templateFolder, 'subject.pug');
            const textTemplate = resolve(templateFolder, 'text.pug');
            const htmlTemplate = resolve(templateFolder, 'html.pug');

            pug.renderFile(subjectTemplate, ctx, (err, subject: string) => {
                if (err) {
                    cb(err);
                    return;
                }
                maildata.data.subject = subject;

                pug.renderFile(textTemplate, ctx, (err, text: string) => {
                    if (err) {
                        cb(err);
                        return;
                    }
                    maildata.data.text = text;

                    pug.renderFile(htmlTemplate, ctx, (err, html: string) => {
                        if (err) {
                            cb(err);
                            return;
                        }
                        maildata.data.html = html;
                        cb();
                    });   
                });      
            });                   
        } else {
            return cb();
        }
    };
}