import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "DateNotBeforeToday", async: false })
export class DateNotBeforeToday implements ValidatorConstraintInterface {
    validate(value: any) {
        if (!value) return false;

        const input = new Date(value);
        const today = new Date();

        // zera horas para comparação justa
        input.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return input >= today;
    }

    defaultMessage() {
        return "A data não pode ser no passado";
    }
}
