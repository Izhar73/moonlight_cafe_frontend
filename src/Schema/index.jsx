import * as yup from "yup"

export const categorySchema = yup.object({
    Category: yup.string().required("Required"),
    Description: yup.string().required("Required")
});