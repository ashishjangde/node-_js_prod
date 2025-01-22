import { ZodError, ZodIssue } from "zod";

const formatValidationErrors = (error: ZodError): string[] => {
    return error.errors.map((issue: ZodIssue) => {
      const path = issue.path.map((p) => String(p)); 
      return `${path.join('.')} : { ${issue.message} }`;
    });
  };

export default formatValidationErrors;