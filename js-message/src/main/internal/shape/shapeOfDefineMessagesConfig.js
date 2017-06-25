import { Spec } from 'js-spec';

const nameRegex = /^[a-z][a-z-A-Z0-9]*$/;

export default Spec.shape({
    messageTypes: 
        Spec.and(
            Spec.object,
            Spec.keys(Spec.matches(nameRegex)),
            Spec.values(
                Spec.and(
                    Spec.object,
                    Spec.keys(nameRegex),
                    Spec.values(
                        Spec.shape({
                            type: Spec.optional(Spec.func),
                            constraint: Spec.optional(Spec.func),
                            defaultValue: Spec.optional(Spec.any)
                        })
                    )
                )
            )
        ),

    namespace: 
        Spec.optional(
            Spec.matches(/^[a-z][a-zA-Z0-9.]*$/))
});
