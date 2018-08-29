export default function setJsSpecValidator(func, validator) {
  Object.defineProperty(func, 'js-spec:validate', {
    value: validator
  })
}
