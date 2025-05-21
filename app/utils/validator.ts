export interface ValidationError {
    fieldName: string;
    message: string;
    element: HTMLElement;
}

export class Validator {
    private errors: ValidationError[] = [];
    private errorContainer: HTMLElement;

    constructor(errorContainerId: string) {
        const container = document.getElementById(errorContainerId);
        if (!container) {
            throw new Error(`Error container with id "${errorContainerId}" not found`);
        }
        this.errorContainer = container;
    }

    /**
     * Validates a form field and creates an error if validation fails
     * @param fieldName - Name of the field being validated
     * @param element - The input element to validate
     * @param rules - Array of validation rules (functions that return true if valid, false if invalid)
     * @param errorMessage - Message to display if validation fails
     */
    public validateField(
        fieldName: string,
        element: HTMLElement,
        rules: ((value: string) => boolean)[],
        errorMessage: string
    ): boolean {
        const value = (element as HTMLInputElement).value;
        const isValid = rules.every(rule => rule(value));

        if (!isValid) {
            this.createError(fieldName, element, errorMessage);
            return false;
        }

        this.removeError(fieldName);
        return true;
    }

    /**
     * Creates a validation error
     */
    private createError(fieldName: string, element: HTMLElement, message: string): void {
        // Remove any existing error for this field
        this.removeError(fieldName);

        // Add error styling to the element
        element.classList.add('error-input');

        // Create error object
        const error: ValidationError = {
            fieldName,
            message,
            element
        };

        this.errors.push(error);
        this.showErrors();
    }

    /**
     * Removes a validation error for a specific field
     */
    private removeError(fieldName: string): void {
        const errorIndex = this.errors.findIndex(error => error.fieldName === fieldName);
        if (errorIndex !== -1) {
            const error = this.errors[errorIndex];
            error.element.classList.remove('error-input');
            this.errors.splice(errorIndex, 1);
            this.showErrors();
        }
    }

    /**
     * Shows all current validation errors in the error container
     */
    private showErrors(): void {
        this.errorContainer.innerHTML = '';
        
        if (this.errors.length === 0) {
            this.errorContainer.style.display = 'none';
            return;
        }

        this.errorContainer.style.display = 'block';
        const errorList = document.createElement('ul');
        errorList.className = 'error-list';

        this.errors.forEach(error => {
            const errorItem = document.createElement('li');
            errorItem.textContent = `${error.fieldName}: ${error.message}`;
            errorList.appendChild(errorItem);
        });

        this.errorContainer.appendChild(errorList);
    }

    /**
     * Clears all validation errors
     */
    public clearErrors(): void {
        this.errors.forEach(error => {
            error.element.classList.remove('error-input');
        });
        this.errors = [];
        this.showErrors();
    }

    /**
     * Validates all fields in a form
     * @param validations - Array of validation configurations
     * @returns boolean indicating if all validations passed
     */
    public validateForm(validations: {
        fieldName: string;
        element: HTMLElement;
        rules: ((value: string) => boolean)[];
        errorMessage: string;
    }[]): boolean {
        let isValid = true;
        validations.forEach(validation => {
            if (!this.validateField(
                validation.fieldName,
                validation.element,
                validation.rules,
                validation.errorMessage
            )) {
                isValid = false;
            }
        });
        return isValid;
    }
} 