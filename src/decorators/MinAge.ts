import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function MinAge(age: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "MinAge",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!(value instanceof Date)) return false;

                    const today = new Date();
                    let diffYears = today.getFullYear() - value.getFullYear();

                    // Ajuste se o aniversário ainda não chegou este ano
                    const m = today.getMonth() - value.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < value.getDate())) {
                        diffYears--;
                    }

                    return diffYears >= age;
                },
                defaultMessage(args: ValidationArguments) {
                    return `O usuário deve ter pelo menos ${age} anos`;
                },
            },
        });
    };
}
