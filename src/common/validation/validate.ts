import {validate} from "class-validator";
import {AppError} from "../error/AppError";

export async function validateBody <T extends Object>(cls: new () => T, body: unknown) : Promise<T> {
    // const register = new DTO(body)
    // Mapping the request body to the DTO class instance to use the class-validator decorators for structural validation
    // which can be used across all modules and their endpoints
    const instance = Object.assign(new cls(), body);
    const errors = await validate(instance, {whitelist: true});

    if(errors.length > 0) {
        const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
        throw new AppError(messages.join(', \n'), 400)
    }
    // a filtered and clean instance of the DTO class with only the properties defined in the class and
    // validated according to the decorators is returned
    return instance;
}