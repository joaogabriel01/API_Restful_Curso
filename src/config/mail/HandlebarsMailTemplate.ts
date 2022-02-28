import handlebars from 'handlebars';

interface ITemplateVariable{
    [key: string]: string | number;
}

interface IPareseMailTemplate {
    template: string;
    variables: ITemplateVariable;
}

export default class HandlebarsMailTemplate {
    public async parse({template, variables}: IPareseMailTemplate): Promise<string> {
        const parseTemplate = handlebars.compile(template);

        return parseTemplate(variables);
    }
}