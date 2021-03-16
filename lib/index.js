"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pugEngine = void 0;
const path_1 = require("path");
const fs = require("fs");
const pug = require("pug");
function pugEngine(conf) {
    return (maildata, cb) => {
        const template = maildata.data.template;
        const ctx = maildata.data.ctx;
        const templateFile = path_1.resolve(conf.templateDir, template) + '.pug';
        const templateFolder = path_1.resolve(conf.templateDir, template);
        const subjectTemplate = path_1.resolve(templateFolder, 'subject.pug');
        const textTemplate = path_1.resolve(templateFolder, 'text.pug');
        const htmlTemplate = path_1.resolve(templateFolder, 'html.pug');
        const isExistsTemplate = fs.existsSync(templateFile);
        const isExistsTemplateFolder = fs.existsSync(templateFolder);
        const isExistsSubject = fs.existsSync(subjectTemplate);
        const isExistsText = fs.existsSync(textTemplate);
        const isExistsHtml = fs.existsSync(htmlTemplate);
        if (!template || (!isExistsTemplate && !isExistsTemplateFolder)) {
            return cb();
        }
        if (conf.pretty === true) {
            ctx.pretty = true;
        }
        if (isExistsTemplate) {
            pug.renderFile(templateFile, ctx, (err, html) => {
                if (err) {
                    cb(err);
                    return;
                }
                maildata.data.html = html;
                cb();
            });
        }
        else if (isExistsTemplateFolder && isExistsSubject && isExistsText && isExistsHtml) {
            const subjectTemplate = path_1.resolve(templateFolder, 'subject.pug');
            const textTemplate = path_1.resolve(templateFolder, 'text.pug');
            const htmlTemplate = path_1.resolve(templateFolder, 'html.pug');
            pug.renderFile(subjectTemplate, ctx, (err, subject) => {
                if (err) {
                    cb(err);
                    return;
                }
                maildata.data.subject = subject;
                pug.renderFile(textTemplate, ctx, (err, text) => {
                    if (err) {
                        cb(err);
                        return;
                    }
                    maildata.data.text = text;
                    pug.renderFile(htmlTemplate, ctx, (err, html) => {
                        if (err) {
                            cb(err);
                            return;
                        }
                        maildata.data.html = html;
                        cb();
                    });
                });
            });
        }
        else {
            return cb();
        }
    };
}
exports.pugEngine = pugEngine;
