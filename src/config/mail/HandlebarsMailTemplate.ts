import handlebars from 'handlebars';
import fs from 'fs';

interface ITemplateVariable{
    [key: string]: string | number;
}

interface IPareseMailTemplate {
    file: string;
    variables: ITemplateVariable;
}

export default class HandlebarsMailTemplate {
    public async parse({file, variables}: IPareseMailTemplate): Promise<string> {
        const templareFileContent = await fs.promises.readFile(file, {encoding: 'utf-8'})
        const parseTemplate = handlebars.compile(templareFileContent);

        return parseTemplate(variables);
    }
}