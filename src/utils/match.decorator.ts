import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';


export function Match(property: string, validationOption?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOption,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints;
          return `${relatedPropertyName}와 ${args.property}가 일치하지 않습니다`;
        },
      },
    });
  };
}