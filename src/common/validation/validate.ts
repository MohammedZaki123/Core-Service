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
        throw new AppError(messages.join('\n'), 400)
    }
    // a filtered and clean instance of the DTO class with only the properties defined in the class and
    // validated according to the decorators is returned
    return instance;
}

/**
 * Validates a path parameter is a valid positive integer.
 *
 * This function should be used to validate all ID parameters from the URL path.
 * Examples: /addresses/:id, /restaurants/:id, /orders/:id
 *
 * @param paramValue - The path parameter value (typically from req.params)
 * @param paramName - The name of the parameter for error messages (e.g., "Address ID", "Restaurant ID")
 * @returns The validated number as a positive integer
 * @throws AppError with status 400 if validation fails
 *
 * @example
 * ```typescript
 * // In controller
 * const addressId = validatePathParameter(req.params.id, "Address ID");
 * // addressId is guaranteed to be a positive integer or error is thrown
 * ```
 */
export function validatePathParameter(paramValue: string | string[], paramName: string = "ID"): number {
    // Check if parameter exists
    if (!paramValue) {
        throw new AppError(`${paramName} is required`, 400);
    }

    // Convert to number
    const numValue = Number(paramValue);

    // Check if conversion was successful (not NaN)
    if (isNaN(numValue)) {
        throw new AppError(`${paramName} must be a valid number`, 400);
    }

    // Check if it's a positive integer
    if (!Number.isInteger(numValue) || numValue <= 0) {
        throw new AppError(`${paramName} must be a positive integer`, 400);
    }

    return numValue;
}