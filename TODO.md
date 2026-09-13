# TODO

- Render one registration consent card per published legal document after the host registration integration accepts multiple field descriptors or trusted custom field content. The current `createRegistrationField()` host contract consumes exactly one ordinary form-builder field and escapes its label, so this external module cannot inject the requested multi-card markup safely without a Cognis core contract change.
